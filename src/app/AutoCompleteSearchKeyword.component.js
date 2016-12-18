import React from 'react';
import { AutoComplete } from 'material-ui';
import { delayOnceTimeAction, restUtil, otherUtils } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';


const AutoCompleteSearchKeyword = React.createClass({
    propTypes: {
        value: React.PropTypes.any,
        searchId: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        onChange: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: this.props.value,
            itemList: [],
            loading: false,
            open: false,
            keywordDataSource: [],
            keyword: this.getKeywordObj(),
        };
    },

    componentDidMount() {
        // Change input 'type' from 'text' to 'search' - has 'x' clear mark on html5 browser.
        $('div.autoCompleteTextField').find('input[type="text"]').attr('type', 'search');
    },

    getKeywordObj(idInput, textInput) {
        const id = (!idInput) ? '' : idInput;
        const text = (!textInput) ? '' : textInput;
        return { id, text };
    },

    getPlaceHolderItems() {
        const placeHolderItems = [];

        placeHolderItems.push(this.createPlaceHolderObj('Chart Favorite', 'images/chart.png', 'Chart Favorite Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Report Table Favorite', 'images/table.png', 'Report Table Favorite Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Map Favorite', 'images/map.png', 'Map Favorite Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Author', 'images/user_small.png', 'Author Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Commentator', 'images/user_small.png', 'Commentator Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Interpretation Text', 'images/interpretation.png', 'Interpretation Text Searching...'));
        placeHolderItems.push(this.createPlaceHolderObj('Comment Text', 'images/comment.png', 'Comment Text Searching...'));

        return placeHolderItems;
    },

    performMultiItemSearch(d2, value, updateItemList) {
        const d2Api = d2.Api.getApi();

        // UpdateItemList with placeholder of each section first..
        updateItemList(this.getPlaceHolderItems());


        // Chart Favorit Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,chart[id,name,title]&filter=chart.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.chart.name);

                    keywordList.push(this.createSelectionObj(source, 'images/chart_small.png', 'Chart Favorite'));
                }

                updateItemList(keywordList, 'Chart Favorite', 'Chart');
            });

        // Report Table Favorite Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,reportTable[id,name,title]&filter=reportTable.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.reportTable.name);

                    keywordList.push(this.createSelectionObj(source, 'images/table_small.png', 'Report Table Favorite'));
                }

                updateItemList(keywordList, 'Report Table Favorite', 'Report Table');
            });


        // Chart Favorit Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,eventCart[id,name,title]&filter=eventChart.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.chart.name);

                    keywordList.push(this.createSelectionObj(source, 'images/chart_small.png', 'Event Chart Favorite'));
                }

                updateItemList(keywordList, 'Event Chart Favorite', 'Event Chart');
            });

        // Report Table Favorite Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,eventReport[id,name,title]&filter=eventReport.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.reportTable.name);

                    keywordList.push(this.createSelectionObj(source, 'images/table_small.png', 'Event Report Table Favorite'));
                }

                updateItemList(keywordList, 'Event Report Table Favorite', 'Event Report Table');
            });

        // Map Favorite Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,map[id,name,title]&filter=map.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.map.name);

                    keywordList.push(this.createSelectionObj(source, 'images/map_small.png', 'Map Favorite'));
                }

                updateItemList(keywordList, 'Map Favorite', 'Map');
            });

        // Author Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,user[id,name]&filter=user.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.user.name);

                    keywordList.push(this.createSelectionObj(source, 'images/user_small.png', 'Author'));
                }

                updateItemList(keywordList, 'Author', 'Author');
            });

        // Commentator Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,comments[user[id,name]]&filter=comments.user.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    for (const comment of interpretation.comments) {
                        if (comment.user.name.search(new RegExp(value, 'i')) >= 0) {
                            const source = this.getKeywordObj(interpretation.id, comment.user.name);

                            keywordList.push(this.createSelectionObj(source, 'images/user_small.png', 'Commentator'));
                        }
                    }
                }

                updateItemList(keywordList, 'Commentator', 'Commentator');
            });


        // Interpretation Text Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    const source = this.getKeywordObj(interpretation.id, interpretation.text);

                    keywordList.push(this.createSelectionObj(source, 'images/interpretation_small.png', 'Interpretation Text'));
                }

                updateItemList(keywordList, 'Interpretation Text', 'Interpretation Text');
            });



        // Comment Text Search
        restUtil.requestGetHelper(d2Api,
            `interpretations?paging=false&fields=id,text,comments[text]&filter=comments.text:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    for (const comment of interpretation.comments) {
                        if (comment.text.search(new RegExp(value, 'i')) >= 0) {
                            const source = this.getKeywordObj(interpretation.id, comment.text);

                            keywordList.push(this.createSelectionObj(source, 'images/comment.png', 'Comment Text'));
                        }
                    }
                }

                updateItemList(keywordList, 'Comment Text', 'Comment Text');
            });
    },

    createHeaderPart(text, title) {
        return { text,
                value: <div className="divSearchItemHeaderPart">
                            <span className="spanSearchItemHeaderName">{title}</span>
                        </div>,
                source: { id: '', text: '' } };
    },

    createSelectionObj(source, imageSrc, title) {
        return { text: source.text,
                value: <div value={source.id} className="searchItemStyle">
                            <img alt={title} src={imageSrc} title={title} />
                            <span className="searchItemName">{source.text}</span>
                        </div>,
                source };
    },

    createPlaceHolderObj(text, imageSrc, title) {
        return { text,
                value: <div className="divLoadingPlaceHolder">
                        <img src="images/loadingSmall.gif" /> Loading -&nbsp;
                        <img alt={text} height="14" width="14" src={imageSrc} /> {title}
                    </div>,
                source: { id: '', text: '' } };
    },

    clear() {
        this.setState({ value: '', keyword: this.getKeywordObj() });
    },

    collapseMenu() {
        this.setState({ open: false });
    },

    combineList(keywordDataSource, resultItems) {
        const newArray = this.state.keywordDataSource.slice();
        for (const item of resultItems) {
            newArray.push(item);
        }
        return newArray;
    },

    _onUpdatekeywords(value) {
        this.setState({ value, loading: true, open: false });
        // Call back the parent passed in method for change
        this.props.onChange(event, value);

        delayOnceTimeAction.bind(500, this.props.searchId, () => {
            if (value === '') {
                this.setState({ keywordDataSource: [], keyword: this.getKeywordObj() });
                this.props.onSelect(this.getKeywordObj());
            } else {
                getD2().then(d2 => {
                    // Clear the dropdown List
                    this.setState({ keywordDataSource: [] });

                    this.performMultiItemSearch(d2, value, (resultItems, loadTypeName, sectionName) => {
                        if (resultItems.length > 0) resultItems.unshift(this.createHeaderPart(loadTypeName, sectionName));

                        // Add to the result
                        const newList = this.combineList(this.state.keywordDataSource, resultItems);

                        // remove previous list??
                        otherUtils.removeFromList(newList, 'text', loadTypeName);

                        this.setState({ keywordDataSource: newList });
                    });
                });
            }
        });
    },

    _onSelectkeyword(value, i) {
        if (i === undefined) {
            // Enter Key was pressed without selection
            this.props.onSelect(this.getKeywordObj('', value));
        } else {
            // Set real keyword here with setstate!!
            this.state.keyword = this.state.keywordDataSource[i].source;
            this.props.onSelect(this.state.keyword);
        }
    },

    render() {
        return (
            <AutoComplete hintText="Search Interpretation" className="autoCompleteTextField"
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdatekeywords}
                onNewRequest={this._onSelectkeyword}
                dataSource={this.state.keywordDataSource}
                fullWidth
                searchText={this.state.value}
                menuStyle={{ maxHeight: '400px' }}
                openOnFocus
            />
        );
    },
});

export default AutoCompleteSearchKeyword;
