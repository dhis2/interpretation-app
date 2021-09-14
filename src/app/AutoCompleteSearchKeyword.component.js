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
        onEnterKey: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: '',
            itemList: [],
            loading: false,
            open: false,
            keywordDataSource: [],
            keyword: this.getEmptyKeywordObj(),
        };
    },

    componentDidMount() {
        // Change input 'type' from 'text' to 'search' - has 'x' clear mark on html5 browser.
        $('div.autoCompleteTextField')
            .find('input[type="text"]')
            .attr('type', 'search');
    },

    getKeywordObj(idListInput, textInput, sourceIdInput) {
        const idList = !idListInput ? [] : idListInput;
        const text = !textInput ? '' : textInput;
        const sourceId = !sourceIdInput ? '' : sourceIdInput;
        return { idList, text, sourceId };
    },

    getEmptyKeywordObj() {
        return this.getKeywordObj();
    },

    getPlaceHolderItems() {
        const placeHolderItems = [];

        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Chart Favorite',
                'images/chart.png',
                'Chart Favorite Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Report Table Favorite',
                'images/table.png',
                'Report Table Favorite Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Map Favorite',
                'images/map.png',
                'Map Favorite Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Author',
                'images/user_small.png',
                'Author Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Commentator',
                'images/user_small.png',
                'Commentator Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Interpretation Text',
                'images/interpretation.png',
                'Interpretation Text Searching...'
            )
        );
        placeHolderItems.push(
            this.createPlaceHolderObj(
                'Comment Text',
                'images/comment.png',
                'Comment Text Searching...'
            )
        );

        return placeHolderItems;
    },

    getInputKeyword() {
        return this.state.value;
    },

    setInputKeyword(inputStr) {
        this.setState({ value: inputStr });
    },

    checkExistingSource(keywordList, sourceId) {
        const existingSourceInfo = { exists: false, source: undefined };

        for (const keywordItem of keywordList) {
            if (keywordItem.source.sourceId === sourceId) {
                existingSourceInfo.exists = true;
                existingSourceInfo.source = keywordItem.source;
                break;
            }
        }

        return existingSourceInfo;
    },

    // Method for adding multiple source on a keyword list item
    updateKeywordList(
        keywordList,
        sourceId,
        itemId,
        itemText,
        imageSrc,
        title
    ) {
        // If keywordList has same source (id), add to the list..
        const existingSourceInfo = this.checkExistingSource(
            keywordList,
            sourceId
        );

        if (existingSourceInfo.exists) {
            existingSourceInfo.source.idList.push(itemId);
        } else {
            const sizeOverride = title === 'Interpretation Text';
            const source = this.getKeywordObj([itemId], itemText, sourceId);

            keywordList.push(
                this.createSelectionObj(source, imageSrc, title, sizeOverride)
            );
        }
    },

    performMultiItemSearch(d2, value, updateItemList) {
        const d2Api = d2.Api.getApi();

        // UpdateItemList with placeholder of each section first..
        updateItemList(this.getPlaceHolderItems());

        // Chart Favorit Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,visualization[id,name,title]&filter=visualization.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.visualization.id,
                        interpretation.id,
                        interpretation.visualization.name,
                        'images/chart_small.png',
                        'Chart Favorite'
                    );
                }

                updateItemList(keywordList, 'Chart Favorite', 'Chart');
            }
        );

        // Report Table Favorite Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,visualization[id,name,title]&filter=visualization.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.visualization.id,
                        interpretation.id,
                        interpretation.visualization.name,
                        'images/table_small.png',
                        'Report Table Favorite'
                    );
                }

                updateItemList(
                    keywordList,
                    'Report Table Favorite',
                    'Report Table'
                );
            }
        );

        // Event Chart Favorit Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,eventChart[id,name,title]&filter=eventChart.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.eventChart.id,
                        interpretation.id,
                        interpretation.eventChart.name,
                        'images/chart_small.png',
                        'Event Chart Favorite'
                    );
                }

                updateItemList(
                    keywordList,
                    'Event Chart Favorite',
                    'Event Chart'
                );
            }
        );

        // Event Report Table Favorite Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,eventReport[id,name,title]&filter=eventReport.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.eventReport.id,
                        interpretation.id,
                        interpretation.eventReport.name,
                        'images/table_small.png',
                        'Event Report Table Favorite'
                    );
                }

                updateItemList(
                    keywordList,
                    'Event Report Table Favorite',
                    'Event Report Table'
                );
            }
        );

        // Map Favorite Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,map[id,name,title]&filter=map.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.map.id,
                        interpretation.id,
                        interpretation.map.name,
                        'images/map_small.png',
                        'Map Favorite'
                    );
                }

                updateItemList(keywordList, 'Map Favorite', 'Map');
            }
        );

        // Author Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,user[id,displayName~rename(name)]&filter=user.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.user.id,
                        interpretation.id,
                        interpretation.user.name,
                        'images/user_small.png',
                        'Author'
                    );
                }

                updateItemList(keywordList, 'Author', 'Author');
            }
        );

        // Commentator Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,comments[user[id,displayName~rename(name)]]&filter=comments.user.name:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    for (const comment of interpretation.comments) {
                        if (
                            comment.user.name.search(new RegExp(value, 'i')) >=
                            0
                        ) {
                            this.updateKeywordList(
                                keywordList,
                                comment.user.id,
                                interpretation.id,
                                comment.user.name,
                                'images/user_small.png',
                                'Commentator'
                            );
                        }
                    }
                }

                updateItemList(keywordList, 'Commentator', 'Commentator');
            }
        );

        // Interpretation Text Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    this.updateKeywordList(
                        keywordList,
                        interpretation.id,
                        interpretation.id,
                        interpretation.text,
                        'images/interpretation.png',
                        'Interpretation Text'
                    );
                }

                updateItemList(
                    keywordList,
                    'Interpretation Text',
                    'Interpretation Text'
                );
            }
        );

        // Comment Text Search
        restUtil.requestGetHelper(
            d2Api,
            `interpretations?paging=false&fields=id,text,comments[text]&filter=comments.text:ilike:${value}`,
            (result) => {
                const keywordList = [];

                for (const interpretation of result.interpretations) {
                    for (const comment of interpretation.comments) {
                        if (comment.text.search(new RegExp(value, 'i')) >= 0) {
                            this.updateKeywordList(
                                keywordList,
                                comment.id,
                                interpretation.id,
                                comment.text,
                                'images/comment.png',
                                'Comment Text'
                            );
                        }
                    }
                }

                updateItemList(keywordList, 'Comment Text', 'Comment Text');
            }
        );
    },

    createHeaderPart(text, title) {
        return {
            text,
            value: (
                <div className="divSearchItemHeaderPart">
                    <span className="spanSearchItemHeaderName">{title}</span>
                </div>
            ),
            source: this.getEmptyKeywordObj(),
        };
    },

    createSelectionObj(source, imageSrc, title, sizeOverride) {
        const props = sizeOverride ? { width: '14px', height: '14px' } : {};
        return {
            text: source.text,
            value: (
                <div value={source.id} className="searchItemStyle">
                    <img alt={title} src={imageSrc} title={title} {...props} />
                    <span className="searchItemName">{source.text}</span>
                </div>
            ),
            source,
        };
    },

    createPlaceHolderObj(text, imageSrc, title) {
        return {
            text,
            value: (
                <div className="divLoadingPlaceHolder">
                    <img src="images/loadingSmall.gif" /> Loading -&nbsp;
                    <img
                        alt={text}
                        height="14"
                        width="14"
                        src={imageSrc}
                    />{' '}
                    {title}
                </div>
            ),
            source: this.getEmptyKeywordObj(),
        };
    },

    clear() {
        this.setState({ value: '', keyword: this.getEmptyKeywordObj() });
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

    isChangedFromAdvancedStr() {
        return otherUtils.checkAdvancedSearch(this.state.value);
    },

    _onUpdatekeywords(value) {
        let changeStatus = '';
        // Clear the dropdown List
        this.setState({ keywordDataSource: [] });

        if (this.isChangedFromAdvancedStr()) {
            // Clear text if changed from '[ADV] --' text
            changeStatus = 'ADV_CLEARED';
            this.setState({ value: '' });
        } else if (otherUtils.checkAdvancedSearch(value)) {
            // If entered value is '[ADV] --', no action
            changeStatus = 'ADV_CASE';
        } else if (otherUtils.trim(value) === '') {
            // If empty values are entered, no action.  'EnterKey' on emptyString handled by _onSelectkeyword
            changeStatus = 'EMPTY_STR';
            this.setState({ value: '' });
        } else {
            changeStatus = 'AUTO_SEARCHING';
            this.setState({ value, loading: true, open: false });

            delayOnceTimeAction.bind(500, this.props.searchId, () => {
                getD2().then((d2) => {
                    this.performMultiItemSearch(
                        d2,
                        value,
                        (resultItems, loadTypeName, sectionName) => {
                            if (resultItems.length > 0)
                                resultItems.unshift(
                                    this.createHeaderPart(
                                        loadTypeName,
                                        sectionName
                                    )
                                );

                            // Add to the result
                            const newList = this.combineList(
                                this.state.keywordDataSource,
                                resultItems
                            );

                            // Remove previous list
                            otherUtils.removeFromList(
                                newList,
                                'text',
                                loadTypeName
                            );

                            this.setState({ keywordDataSource: newList });
                        }
                    );
                });
            });
        }

        // Call back the parent passed in method for change
        this.props.onChange(this.state.value, changeStatus);
    },

    _onSelectkeyword(value, i) {
        if (i === undefined) {
            // Enter Key was pressed without selection
            if (otherUtils.checkAdvancedSearch(value)) {
                //console.log( '-- keyword has advanced search string - Not calling search.');
            } else {
                //this.props.onSelect(this.getKeywordObj('', otherUtils.trim(value)));
                this.props.onEnterKey(otherUtils.trim(value));
            }
        } else {
            // Set keyword as 'value' (input) as well and pass back to parent control.
            /* const keyword = this.state.keywordDataSource[i].source;
            this.setState({ value: keyword, keyword });
            this.props.onSelect(keyword);
            */

            this.state.keyword = this.state.keywordDataSource[i].source;
            // this.state.value = this.state.keyword;
            this.props.onSelect(this.state.keyword);
        }
    },

    render() {
        return (
            <AutoComplete
                hintText="Search Interpretation"
                className="autoCompleteTextField"
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
