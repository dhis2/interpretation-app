import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import Interpretation from './Interpretation.component';
import actions from './actions/Interpretation.action';
import { dataInfo } from './data';
import { dateUtil, restUtil, otherUtils } from './utils';
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
            d2Api: this.props.d2.Api.getApi(),
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    },

    componentDidMount() {
        this._handleWindowResize();

        window.addEventListener('resize', this._handleWindowResize);
    },

    onSearchChanged(searchTerm) {
        this.searchLoading(true);

		// set the search terms on state memory and reset the item list
        this.state.searchTerm = searchTerm;
        this.state.items = [];
        // Clear the previously displayed list first?
        //this.setState({ searchTerm, items: [] });

        // For search, let's simplify it by -->
        // retrieving all the ID of the all the search sections
        // combine and trim out the duplicate ones
        // and send the ID list to 'loadMore'
        this.checkAndHandleKeywordCase(searchTerm, (keywordSearchedIdList) => {
            if (keywordSearchedIdList === undefined) {
                //console.log('onSearchChanged -> loadMore CASE');
                // no search keyword entered case
                this.loadMore(1, () => {
                    this.searchLoading(false);
                });
            } else {
                // NOTE: THIS CASE DOES NOT WORK WITH PAGING!!!  <-- SINCE we already have list, not by query 'page' use..?
                //console.log('onSearchChanged -> loadSearchedListCase CASE');
                this.loadSearchedListCase(keywordSearchedIdList, () => {
                    this.searchLoading(false);
                });
            }
        });
        // Search for Interpretation with first page.  searchTerm are passed as memory
    },

    structureData_AndPutInGlobalList(itemList) {
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
        const dataList = [];
        this.aggReportItems = [];
        this.curAggchartItems = [];
        this.eventReportItems = [];
        this.curEventChartItems = [];

        for (let i = 0; i < itemList.length; i++) {
            const interpretation = itemList[i];

            let data = {};
            data = interpretation;

            if (interpretation.user === undefined) {
                data.userId = '';
                data.user = 'UNKNOWN';
            } else {
                data.userId = interpretation.user.id;
                data.user = interpretation.user.name;
            }
            // data.comments = JSON.stringify(interpretation.comments);

            if (interpretation.type === 'CHART') {
                data.objId = interpretation.chart.id;
                data.name = interpretation.chart.name;
                data.objData = interpretation.chart;
                this.curAggchartItems.push(interpretation);
            } else if (interpretation.type === 'MAP') {
                data.objId = interpretation.map.id;
                data.name = interpretation.map.name;
                data.objData = interpretation.map;
            } else if (interpretation.type === 'REPORT_TABLE') {
                data.objId = interpretation.reportTable.id;
                data.name = interpretation.reportTable.name;
                data.objData = interpretation.reportTable;
                this.aggReportItems.push(interpretation);
            } else if (interpretation.type === 'EVENT_REPORT') {
                data.objId = interpretation.eventReport.id;
                data.name = interpretation.eventReport.name;
                data.objData = interpretation.eventReport;
            } else if (interpretation.type === 'EVENT_CHART') {
                data.objId = interpretation.eventChart.id;
                data.name = interpretation.eventChart.name;
                data.objData = interpretation.eventChart;
            }

            dataList.push(data);
        }

        return dataList;
    },

    getSearchTerms(searchTerm) {
        let searchTermUrl = '';

        if (searchTerm !== undefined) {
            // TODO: Search by ID should be moved out of this!!
            if (searchTerm.idList && searchTerm.idList.length > 0) {
                // id changed to array
                searchTermUrl += `&filter=id:in:[${searchTerm.idList.toString()}]&order=created:desc`;
            } else if (searchTerm.moreTerms !== undefined) {
                if (searchTerm.moreTerms.author && searchTerm.moreTerms.author.id !== '') searchTermUrl += `&filter=user.id:eq:${searchTerm.moreTerms.author.id}`;

                if (searchTerm.moreTerms.commentator && searchTerm.moreTerms.commentator.id !== '') searchTermUrl += `&filter=comments.user.id:eq:${searchTerm.moreTerms.commentator.id}`;

                if (searchTerm.moreTerms.type) searchTermUrl += `&filter=type:eq:${searchTerm.moreTerms.type}`;

                if (searchTerm.moreTerms.dateCreatedFrom) searchTermUrl += `&filter=created:ge:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateCreatedFrom, '-')}`;

                if (searchTerm.moreTerms.dateCreatedTo) searchTermUrl += `&filter=created:le:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateCreatedTo, '-')}`;

                if (searchTerm.moreTerms.dateModiFrom) searchTermUrl += `&filter=lastUpdated:ge:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateModiFrom, '-')}`;

                if (searchTerm.moreTerms.dateModiTo) searchTermUrl += `&filter=lastUpdated:le:${dateUtil.formatDateYYYYMMDD(searchTerm.moreTerms.dateModiTo, '-')}`;

                if (searchTerm.moreTerms.interpretationText) searchTermUrl += `&filter=text:ilike:${searchTerm.moreTerms.interpretationText}`;

                // depending on the type, do other search..
                if (searchTerm.moreTerms.favoritesName && searchTerm.moreTerms.type) searchTermUrl += `&filter=${this.getFavoriteSearchKeyName(searchTerm.moreTerms.type)}:ilike:${searchTerm.moreTerms.favoritesName}`;

                if (searchTerm.moreTerms.commentText) searchTermUrl += `&filter=comments.text:ilike:${searchTerm.moreTerms.commentText}`;
                
                if (searchTerm.moreTerms.mention) searchTermUrl += `&filter=comments.mentions.username:eq:${this.props.d2.currentUser.username}`;

                // TODO:
                //      For 'Star' (Favorite), we can check it by '/{charId}/favorites...  so, we can do favorites:in:$---, but that would be in char..
                //      So, we need to do 'chart.favorites:in:-userId--' ?  How can we tell which type?
                //      Look at this in API after being able to submit for favorites/subscribers..

            }
        }

        return searchTermUrl;
    },

    getFavoriteSearchKeyName(favoriteType) {
        let searchFavoriteKeyName = '';
        switch (favoriteType) {
        case 'CHART':
            searchFavoriteKeyName = 'chart.name';
            break;
        case 'REPORT_TABLE':
            searchFavoriteKeyName = 'reportTable.name';
            break;
        case 'EVENT_CHART':
            searchFavoriteKeyName = 'eventChart.name';
            break;
        case 'EVENT_REPORT':
            searchFavoriteKeyName = 'eventReport.name';
            break;
        case 'MAP':
            searchFavoriteKeyName = 'map.name';
            break;
        default:
            break;
        }

        return searchFavoriteKeyName;
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

    _handleWindowResize() {
        const width = dataInfo.getleftAreaCalcWidth();
        const minLeftWidth = dataInfo.minLeftAreaWidth;
        const maxLeftWidth = dataInfo.maxLeftAreaWidth;
        const rightAreaOffSetPos = dataInfo.offSetRightAreaPosition;
        let leftEndPosition = width;

        if ($('.intpreContents').width() < minLeftWidth || width < minLeftWidth) leftEndPosition = minLeftWidth;
        else if ($('.intpreContents').width() >= maxLeftWidth || width >= maxLeftWidth) leftEndPosition = maxLeftWidth;

        const rightStartPosition = leftEndPosition + rightAreaOffSetPos;

        $('.intpreContents').width(leftEndPosition);
        $('.divSearchArea,.searchDiv').width(leftEndPosition - 1);
        $('.divRightArea').css('position', 'fixed').css('left', `${rightStartPosition}px`);
    },

    loadCharts(aggchartItems) {
        getD2().then(d2 => {
            //const width = dataInfo.getInterpDivWidth();

            const chartItems = [];
            for (let i = 0; i < aggchartItems.length; i++) {
                const id = aggchartItems[i].objId;
                const divId = aggchartItems[i].id;

                const options = {};
                options.uid = id;
                options.el = divId;
                options.id = id;
                //options.width = width;
                options.height = dataInfo.interpObjHeight;
                options.preventMask = false;
                options.relativePeriodDate = aggchartItems[i].created;
                chartItems.push(options);
            }

            chartPlugin.url = restUtil.getUrlBase_Formatted( d2 );
            chartPlugin.showTitles = false;
            chartPlugin.preventMask = false;
            chartPlugin.load(chartItems);
        });
    },

    loadAggregateReports() {
        getD2().then(d2 => {
            //const width = dataInfo.getInterpDivWidth();
            const items = [];
            for (let i = 0; i < this.aggReportItems.length; i++) {
                const id = this.aggReportItems[i].objId;
                const divId = this.aggReportItems[i].id;

                const options = {};
                options.el = divId;
                options.id = id;
                //options.width = width;
                options.height = dataInfo.interpObjHeight;
                options.displayDensity = 'compact';
                options.relativePeriodDate = this.aggReportItems[i].created;
                items.push(options);
            }

            reportTablePlugin.url = restUtil.getUrlBase_Formatted( d2 );
            reportTablePlugin.showTitles = false;
            reportTablePlugin.load(items);
        });
    },

    /*
    // CHANGED - #1
    loadEventReports() {
        getD2().then(d2 => {
            //const url = restUtil.getUrlBase_Formatted( d2 );
            //const width = dataInfo.getInterpDivWidth();

            const items = [];
            for (let i = 0; i < this.eventReportItems.length; i++) {
                const id = this.eventReportItems[i].objId;
                const divId = this.eventReportItems[i].id;

                const options = {};
                options.url = '..';
                options.el = divId;
                options.id = id;
                options.displayDensity = 'COMPACT';
                options.fontSize = 'SMALL';
                options.relativePeriodDate = this.eventReportItems[i].created;
                items.push(options);
            }

            eventReportPlugin.url = restUtil.getUrlBase_Formatted( d2 );
            eventReportPlugin.showTitles = false;
            eventReportPlugin.load(items);
        });
    },

    loadEventCharts(eventChartItems) {
        getD2().then(d2 => {
            //const url = restUtil.getUrlBase_Formatted( d2 );
            //const width = dataInfo.getInterpDivWidth();

            const chartItems = [];
            for (let i = 0; i < eventChartItems.length; i++) {
                const id = eventChartItems[i].objId;
                const divId = eventChartItems[i].id;

                const options = {};
                options.uid = id;
                options.el = divId;
                options.id = id;
                //options.width = width;
                options.height = dataInfo.interpObjHeight;
                options.preventMask = false;
                options.relativePeriodDate = eventChartItems[i].created;
                chartItems.push(options);
            }

            eventChartPlugin.url = restUtil.getUrlBase_Formatted( d2 );
            eventChartPlugin.showTitles = false;
            eventChartPlugin.preventMask = false;
            eventChartPlugin.load(chartItems);
        });
    },
*/
    addToDivList(dataList, hasMore, resultPage) {
        this.setState({
            items: this.state.items.concat([this.createDiv(dataList, resultPage)]), hasMore,
        });
    },

    isSuperUser() {
        return this.props.d2.currentUser.authorities.has('ALL');
    },

    loadSearchedListCase(idList, afterFunc) {
        const searchQuery = `&filter=id:in:[${idList.toString()}]&order=created:desc`;

        actions.listInterpretation('', searchQuery).subscribe(result => {
            // NOTE: Changed the name of the method to long and descriptive.  Break up the method purpose if you can.
            const dataList = this.structureData_AndPutInGlobalList(result.interpretations, this.state.d2Api.baseUrl);

            this.addToDivList(dataList, false, 1);

            // QUESTION: Could we pass this as local list? Rather than using global list?
            this.loadCharts(this.curAggchartItems);
            this.loadAggregateReports();
            // CHANGED - #2
            //this.loadEventCharts(this.curEventChartItems);
            //this.loadEventReports();

            if (afterFunc) afterFunc();

            this.setTableCentering();
        });
    },

    loadMore(page, afterFunc) {
        const searchQuery = this.getSearchTerms(this.state.searchTerm);

        actions.listInterpretation('', searchQuery, page).subscribe(result => {
            if (page === 1) {
                // Update the 'READ' timestamp
                const queryUrl = _dhisLoc + 'api/' + 'me/dashboard/interpretations/read';
                restUtil.requestPostHelper(this.state.d2Api, queryUrl, '', () => {
                    console.log('successfully updated read timestamp');
                });
            }

            // NOTE: Changed the name of the method to long and descriptive.  Break up the method purpose if you can.
            const dataList = this.structureData_AndPutInGlobalList(result.interpretations, this.state.d2Api.baseUrl);
            const hasMore = (result.pager.page < result.pager.pageCount);
            const resultPage = result.pager.page;

            this.addToDivList(dataList, hasMore, resultPage);

            // QUESTION: Could we pass this as local list? Rather than using global list?
            this.loadCharts(this.curAggchartItems);
            this.loadAggregateReports();
            // CHANGED - #3
            //this.loadEventCharts(this.curEventChartItems);
            //this.loadEventReports();

            if (afterFunc) afterFunc();

            this.setTableCentering();
        });
    },

    curAggchartItems: [],
    aggReportItems: [],
    curEventChartItems: [],
    eventReportItems: [],

    setTableCentering() {
        // TODO: If postback function after chart/table render is available, use that instead.
        // loop it for 15 times, once a 0.5 sec?
        let timesRun = 0;
        const interval = setInterval(() => {
            timesRun++;
            if (timesRun >= 15) clearInterval(interval);
            $('table.pivot').css('margin', '0 auto');
        }, 500);
    },

    checkAndHandleKeywordCase(searchTerm, returnFunc) {
        if (searchTerm !== undefined && searchTerm.keyword) {
            this.performKeywordSearchRequest(searchTerm.keyword, returnFunc);
        } else {
            returnFunc(); // with false?
        }
    },


    performKeywordSearchRequest(keyword, doneFunc) {
        const searchIdListObject = {};
        const searchPerformList = [
            { type: 'chart', performed: false, query: `interpretations?paging=false&fields=id&filter=chart.name:ilike:${keyword}` },
            { type: 'report', performed: false, query: `interpretations?paging=false&fields=id&filter=reportTable.name:ilike:${keyword}` },
            { type: 'chartEvent', performed: false, query: `interpretations?paging=false&fields=id&filter=eventChart.name:ilike:${keyword}` },
            { type: 'reportEvent', performed: false, query: `interpretations?paging=false&fields=id&filter=eventReport.name:ilike:${keyword}` },
            { type: 'map', performed: false, query: `interpretations?paging=false&fields=id&filter=map.name:ilike:${keyword}` },
            { type: 'author', performed: false, query: `interpretations?paging=false&fields=id&filter=user.name:ilike:${keyword}` },
            { type: 'commentator', performed: false, query: `interpretations?paging=false&fields=id&filter=comments.user.name:ilike:${keyword}` },
            { type: 'interpretationText', performed: false, query: `interpretations?paging=false&fields=id&filter=text:ilike:${keyword}` },
            { type: 'commentText', performed: false, query: `interpretations?paging=false&fields=id&filter=comments.text:ilike:${keyword}` },
        ];

        for (const searchItem of searchPerformList) {
            restUtil.requestGetHelper(this.state.d2Api, searchItem.query, (result) => {
                this.combineIdList(result, searchIdListObject);

                searchItem.performed = true;

                this.checkDoneList(searchPerformList, doneFunc, searchIdListObject);
            });
        }
    },

    combineIdList(result, searchIdListObject) {
        // use object and its property to easily make the unique list (without duplicates)
        if (result !== undefined && result.interpretations !== undefined) {
            for (const interpretation of result.interpretations) {
                searchIdListObject[interpretation.id] = {};
            }
        }
    },

    checkDoneList(searchPerformList, returnFunc, searchIdListObject) {
        let unfinished = false;

        for (const searchItem of searchPerformList) {
            if (!searchItem.performed) {
                unfinished = true;
                break;
            }
        }

        if (!unfinished) {
            const idList = [];
            // convert the object properties as list
            for (const propName in searchIdListObject) {
                idList.push(propName);
            }
            returnFunc(idList);
        }
    },

    createDiv(dataList, page) {
        const divKey = `list_${page}`;

        return (
			<div key={divKey}>
			{dataList.map(data =>
                <Interpretation page={page} key={data.id} data={data} currentUser={this.state.currentUser} d2Api={this.state.d2Api} deleteInterpretationSuccess={this._deleteInterpretationSuccess} />
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
                    <CircularProgress size={60} />
                </div>
                <div className="intpreContents">
                    <InfiniteScroll key="interpretationListKey"
                        loader={<div className="intprePageLoading"><CircularProgress size={30} /><span style={{ marginLeft: '20px' }}> Loading Interpretations...</span></div>}
                        loadMore={this.loadMore} hasMore={this.state.hasMore} useWindow>
                        {this.state.items}
                    </InfiniteScroll>
                </div>

			</div>
		);
    },
});

export default InterpretationList;
