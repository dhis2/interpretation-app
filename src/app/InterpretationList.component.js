import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { CircularProgress } from 'material-ui';
import Interpretation from './Interpretation.component';
import actions from './actions/Interpretation.action';
import { dataInfo } from './data';
import { dateUtil, otherUtils } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';

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

    componentDidMount() {
        window.addEventListener('resize', this._handleWindowResize);
    },

    _handleWindowResize() {
        // If browser window width is less than 900, do not request for redraw   
        if ($('.intpreContents').width() < 650) {
            $('.intpreContents').width(650);
        }
        else {
            $('.intpreContents').width(dataInfo.getleftAreaWidth());
        }

    },


    searchLoading(loading) {
        if (loading) {
            $('.intpreContents').hide();
            $('.intpreLoading').show();
        } else {
            $('.intpreLoading').hide();
            $('.intpreContents').show();
        }
    },

    curAggchartItems: [],
    aggReportItems: [],

    onSearchChanged(searchTerm) {
        this.searchLoading(true);
        // console.log( 'onSearchChanged called');

		// set the search terms on state memory and reset the item list
        this.state.searchTerm = searchTerm;
        this.state.items = [];

        // Search for Interpretation with first page.  searchTerm are passed as memory
        this.loadMore(1, () => {
            this.searchLoading(false);
        });
    },

    getFormattedData(itemList) {
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
        const dataList = [];
        this.aggReportItems = [];
        this.curAggchartItems = [];

        for (let i = 0; i < itemList.length; i++) {
            const interpretation = itemList[i];

            let data = {};
            data = interpretation;
            data.userId = interpretation.user.id;
            data.user = interpretation.user.name;
            // data.comments = JSON.stringify(interpretation.comments);

            if (interpretation.type === 'CHART') {
                data.objId = interpretation.chart.id;
                data.name = interpretation.chart.name;
                this.curAggchartItems.push(interpretation);
            } else if (interpretation.type === 'MAP') {
                data.objId = interpretation.map.id;
                data.name = interpretation.map.name;
            } else if (interpretation.type === 'REPORT_TABLE') {
                data.objId = interpretation.reportTable.id;
                data.name = interpretation.reportTable.name;
                this.aggReportItems.push(interpretation);
            } else if (interpretation.type === 'EVENT_REPORT') {
                data.objId = interpretation.eventReport.id;
                data.name = interpretation.eventReport.name;
            } else if (interpretation.type === 'EVENT_CHART') {
                data.objId = interpretation.eventChart.id;
                data.name = interpretation.eventChart.name;
            }

            dataList.push(data);
        }

        return dataList;
    },

    getSearchTerms(searchTerm) {
        let searchTermUrl = '';

        if (searchTerm !== undefined) {
            // TODO: Will be changed from text to object
            if (searchTerm.id) searchTermUrl += `&filter=id:eq:${searchTerm.id}`;

            if (searchTerm.keyword) searchTermUrl += `&filter=text:ilike:${searchTerm.keyword}`;

            if (searchTerm.moreTerms !== undefined) {
                if (searchTerm.moreTerms.author && searchTerm.moreTerms.author.id !== '') searchTermUrl += `&filter=user.id:eq:${searchTerm.moreTerms.author.id}`;

                if (searchTerm.moreTerms.commentator && searchTerm.moreTerms.commentator.id !== '') searchTermUrl += `&filter=comments.user.id:eq:${searchTerm.moreTerms.commentator.id}`;

                if (searchTerm.moreTerms.type) searchTermUrl += `&filter=type:eq:${searchTerm.moreTerms.type}`;

                if (searchTerm.moreTerms.dateCreatedFrom) searchTermUrl += `&filter=created:ge:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateCreatedFrom, '-')}`;

                if (searchTerm.moreTerms.dateCreatedTo) searchTermUrl += `&filter=created:le:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateCreatedTo, '-')}`;

                if (searchTerm.moreTerms.dateModiFrom) searchTermUrl += `&filter=lastUpdated:ge:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateModiFrom, '-')}`;

                if (searchTerm.moreTerms.dateModiTo) searchTermUrl += `&filter=lastUpdated:le:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateModiTo, '-')}`;

                if (searchTerm.moreTerms.contains) searchTermUrl += `&filter=text:ilike:${searchTerm.moreTerms.contains}`;
            }
        }

        return searchTermUrl;
    },

    loadCharts(aggchartItems) {
        getD2().then(d2 => {
            const url = d2.Api.getApi().baseUrl.replace('api', '');
            const width = dataInfo.getleftAreaWidth();

            const chartItems = [];
            for (let i = 0; i < aggchartItems.length; i++) {
                const id = aggchartItems[i].objId;
                const divId = aggchartItems[i].id;
               
                const options = {};
                options.uid = id;
                options.el = divId;
                options.id = id;
                options.width = width;
                options.height = 400;
                options.preventMask = false;
                options.relativePeriodDate = aggchartItems[i].created;
                chartItems.push(options);
            }

            chartPlugin.url = url;
            chartPlugin.showTitles = false;
            chartPlugin.preventMask = false;
            chartPlugin.load(chartItems);
        });
    },

    loadAggregateReports() {
        getD2().then(d2 => {
            const url = d2.Api.getApi().baseUrl.replace('api', '');
            const width = dataInfo.getleftAreaWidth();

            const items = [];
            for (let i = 0; i < this.aggReportItems.length; i++) {
                const id = this.aggReportItems[i].objId;
                const divId = this.aggReportItems[i].id;

                const options = {};
                options.el = divId;
                options.id = id;
                options.width = width;
                options.height = 400;
                options.displayDensity = 'compact';
                options.relativePeriodDate = this.aggReportItems[i].created;
                items.push(options);
            }

            reportTablePlugin.url = url;
            reportTablePlugin.showTitles = false;
            reportTablePlugin.load(items);
        });
    },

    addToDivList(dataList, hasMore, resultPage) {
        this.setState({
            items: this.state.items.concat([this.createDiv(dataList, resultPage)]), hasMore,
        });
    },

    isSuperUser() {
        return this.props.d2.currentUser.authorities.has('ALL');
    },

    loadMore(page, afterFunc) {
        const searchData = this.getSearchTerms(this.state.searchTerm);

        actions.listInterpretation('', searchData, page).subscribe(result => {
            const d2 = this.props.d2;
            const d2Api = d2.Api.getApi();

            const dataList = this.getFormattedData(result.interpretations, d2Api.baseUrl);
            const hasMore = (result.pager.page < result.pager.pageCount);
            const resultPage = result.pager.page;

            this.addToDivList(dataList, hasMore, resultPage);

            this.loadCharts(this.curAggchartItems);
            this.loadAggregateReports();

            if (afterFunc) afterFunc();
        });
    },
    // TODO: Does not have fail response, or always response!!!


    createDiv(dataList, page) {
        const divKey = `list_${page}`;

        return (
			<div key={divKey}>
			{dataList.map(data =>
                <Interpretation page={page} key={data.id} data={data} currentUser={this.state.currentUser} deleteInterpretationSuccess={this._deleteInterpretationSuccess} />
			)}
			</div>
        );
    },

    _deleteInterpretationSuccess(id) {
        const items = this.state.items;

        for (let i = 0; i < items.length; i++) {
            const children = items[i].props.children;
            otherUtils.removeFromList(children, 'key', id);
        }

        this.setState({ items });
    },

    render() {
        return (
			<div>
                <div className="intpreLoading" style={{ display: 'none' }}>
                    <CircularProgress size={2} />
                </div>
                <div className="intpreContents">
                    <InfiniteScroll key="interpretationListKey" loader={<div><img src="images/ajaxLoaderBar.gif" /></div>} loadMore={this.loadMore} hasMore={this.state.hasMore} useWindow>
                        {this.state.items}
                    </InfiniteScroll>
                </div>

			</div>
		);
    },
});

export default InterpretationList;
