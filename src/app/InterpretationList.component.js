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
            hasMore: true, items: [], currentUser: this.props.d2.currentUser.displayName,
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    },

    onSearchChanged(keyword) {
		// reset the list item
        this.state.items = [];

		// set the keyword on memory
        this.searchKey = keyword;

        this.loadMore(1);

        // console.log('Search Performed: ${keyword}');
    },

    getFormattedData(itemList) {
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
        const dataList = [];

        for (let i = 0; i < itemList.length; i++) {
            const interpretation = itemList[i];

            let data = {};
            data = interpretation;
            data.user = interpretation.user.name;

			// Comments information
            let comments = '';
            for (let j = 0; j < interpretation.comments.length; j++) {
                const cm = interpretation.comments[j];
                comments += `${cm.user.name},${cm.created},${cm.text};`;
            }

            if (comments.length > 0) {
                comments = comments.substring(0, comments.length - 1);
            }

            data.comments = comments;

            if (interpretation.type === 'CHART') {
                data.objId = interpretation.chart.id;
                data.name = interpretation.chart.name;
            } else if (interpretation.type === 'MAP') {
                data.objId = interpretation.map.id;
                data.name = interpretation.map.name;
            } else {
                data.objId = interpretation.reportTable.id;
                data.name = interpretation.reportTable.name;
            }

            dataList.push(data);
        }

        return dataList;
    },

    addToDivList(dataList, hasMore, resultPage) {
        this.setState({
            items: this.state.items.concat([this.createDiv(dataList, resultPage)]), hasMore,
        });
    },

    loadMore(page, searchKey) {
        const d2 = this.props.d2;
        const d2Api = d2.Api.getApi();

        let url = `interpretations?fields=id,type,text,created,likes,likedBy[name],user[name],comments[id,created,text,user[name]],chart[id,name],map[id,name],reportTable[id,name]&page=${page}&pageSize=3`;

        if (searchKey !== undefined && searchKey !== '') {
            url += `&filter=text:ilike:${searchKey}`;
        }

        d2Api.get(url).then(result => {
            const dataList = this.getFormattedData(result.interpretations, d2Api.baseUrl);

            const hasMore = (result.pager.page < result.pager.pageCount);
            const resultPage = result.pager.page;

            setTimeout(this.addToDivList(dataList, hasMore, resultPage).bind(this), 1000);

            return Promise.resolve();
        })
		.catch(error => { console.log(error); return Promise.resolve(); });
    },

    searchKey: '',

    createDiv(dataList, page) {
        return (
			<div>
			{dataList.map(data =>
			<Interpretation page={page} key={data.id} data={data} currentUser={this.state.currentUser} />
			)}
			</div>
        );
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
