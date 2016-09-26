import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Interpretation from '../../src/app/Interpretation.component';

const InterpretationList = React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
    },

    getInitialState() {
        return {
            hasMore: true,
            items: [],
            searchTerm: undefined,
            currentUser: { name: this.props.d2.currentUser.displayName, id: this.props.d2.currentUser.id, superUser: this.isSuperUser() },
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    },

    onSearchChanged(searchTerm) {
		// set the search terms on state memory
        this.state.searchTerm = searchTerm;

		// reset the list item
        this.setState({ hasMore: true, items: [], searchTerm });
    },

    getFormattedData(itemList) {
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
        const dataList = [];

        for (let i = 0; i < itemList.length; i++) {
            const interpretation = itemList[i];

            let data = {};
            data = interpretation;
            data.userId = interpretation.user.id;
            data.user = interpretation.user.name;
            data.comments = JSON.stringify(interpretation.comments);

            if (interpretation.type === 'CHART') {
                data.objId = interpretation.chart.id;
                data.name = interpretation.chart.name;
            } else if (interpretation.type === 'MAP') {
                data.objId = interpretation.map.id;
                data.name = interpretation.map.name;
            } else if (interpretation.type === 'REPORT_TABLE') {
                data.objId = interpretation.reportTable.id;
                data.name = interpretation.reportTable.name;
            }

            dataList.push(data);
        }

        return dataList;
    },

    getSearchTerms(searchTerm) {
        let searchTermUrl = '';

        if (searchTerm !== undefined) {
            if (searchTerm.keyword !== undefined && searchTerm.keyword !== '') {
                searchTermUrl += `&filter=text:ilike:${searchTerm.keyword}`;
            }

            if (searchTerm.moreTerms !== undefined) {
                if (searchTerm.moreTerms.author !== '') searchTermUrl += `&filter=user.id:eq:${searchTerm.moreTerms.author}`;

                if (searchTerm.moreTerms.commentator !== '') searchTermUrl += `&filter=comments.user.id:eq:${searchTerm.moreTerms.commentator}`;

                if (searchTerm.moreTerms.type !== '') searchTermUrl += `&filter=type:eq:${searchTerm.moreTerms.type}`;

                if (searchTerm.moreTerms.dateCreatedFrom !== '') searchTermUrl += `&filter=created:ge:${searchTerm.moreTerms.dateCreatedFrom.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateCreatedTo !== '') searchTermUrl += `&filter=created:le:${searchTerm.moreTerms.dateCreatedTo.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateModifiedFrom !== '') searchTermUrl += `&filter=lastUpdated:ge:${searchTerm.moreTerms.dateModifiedFrom.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateModifiedTo !== '') searchTermUrl += `&filter=lastUpdated:le:${searchTerm.moreTerms.dateModifiedTo.format('YYYY-MM-DD')}`;
            }
        }

        return searchTermUrl;
    },

    addToDivList(dataList, hasMore, resultPage) {
        this.setState({
            items: this.state.items.concat([this.createDiv(dataList, resultPage)]), hasMore,
        });
    },

    isSuperUser() {
        return this.props.d2.currentUser.authorities.has('ALL');
    },

    loadMore(page) {
        const d2 = this.props.d2;
        const d2Api = d2.Api.getApi();

        let url = `interpretations?fields=id,type,text,created,likes,likedBy[id,name],user[id,name],comments[id,created,text,user[id,name]],chart[id,name],map[id,name],reportTable[id,name]&page=${page}&pageSize=5`;
        url += this.getSearchTerms(this.state.searchTerm);

        d2Api.get(url).then(result => {
            const dataList = this.getFormattedData(result.interpretations, d2Api.baseUrl);
            const hasMore = (result.pager.page < result.pager.pageCount);
            const resultPage = result.pager.page;

            this.addToDivList(dataList, hasMore, resultPage);

            return Promise.resolve();
        })
		.catch(error => { console.log(error); return Promise.resolve(); });
    },

    createDiv(dataList, page) {
        return (
			<div>
			{dataList.map(data =>
                <Interpretation page={page} key={data.id} data={data} currentUser={this.state.currentUser} deleteInterpretationSuccess={this._deleteInterpretationSuccess} />
			)}
			</div>
        );
    },

    removeFromArray(list, propertyName, value) {
        let index;

        for (let i = 0; i < list.length; i++) {
            if (list[i][propertyName] === value) {
                index = i;
            }
        }

        if (index !== undefined) {
            list.splice(index, 1);
        }

        return list;
    },

    _deleteInterpretationSuccess(id) {
        const items = this.state.items;

        for (let i = 0; i < items.length; i++) {
            const children = items[i].props.children;
            this.removeFromArray(children, 'key', id);
        }

        this.setState({ items });
    },

    render() {
        return (
			<div>
				<InfiniteScroll loader={<div><img src="images/ajaxLoaderBar.gif" /></div>} loadMore={this.loadMore} hasMore={this.state.hasMore} useWindow>
                    {this.state.items}
				</InfiniteScroll>
			</div>
		);
    },
});

export default InterpretationList;
