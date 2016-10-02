import React from 'react';
import { MenuItem, AutoComplete } from 'material-ui';
import { delayOnceTimeAction } from './utils';
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

    getKeywordObj(idInput, textInput) {
        const id = (!idInput) ? '' : idInput;
        const text = (!textInput) ? '' : textInput;
        return { id, text };
    },

    collapseMenu() {
        this.setState({ open: false });
    },

    _onUpdatekeywords(value) {

        this.setState({ value, loading: true, open: false });
        // Call back the parent passed in method for change 
        this.props.onChange(event, value);


        delayOnceTimeAction.bind(500, this.props.searchId, () => {
            if (value === '') {
                this.setState({ keywordDataSource: [], keyword: this.getKeywordObj() });
                this.props.onSelect(this.getKeywordObj());
            }
            else {
                getD2().then(d2 => {
                    const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

                    d2.Api.getApi().get(url).then(result => {
                        const keywordList = [];

                        for (const user of result.interpretations) {
                            const source = this.getKeywordObj(user.id, user.text);
                            keywordList.push({ text: source.text, value: <MenuItem primaryText={source.text} value={source.id} />, source });
                        }

                        this.setState({ keywordDataSource: keywordList });

                        // this.setState({ itemList: result.interpretations, loading: false, open: openVal });
                    })
                    .catch(errorResponse => {
                        console.log(`error ${errorResponse}`);
                    });
                });
            }
        });
    },

    _onSelectkeyword(value, i) {
        if (i === undefined) {
            // Enter Key was pressed without selection
            this.props.onSelect(this.getKeywordObj('', value));
        }
        else {
            // Set real keyword here with setstate!!
            this.state.keyword = this.state.keywordDataSource[i].source;
            this.props.onSelect(this.state.keyword);
        }
    },

    render() {
        return (
            <AutoComplete hintText="Search Interpretation"
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdatekeywords}
                onNewRequest={this._onSelectkeyword}
                dataSource={this.state.keywordDataSource}
                style={{ width: '540px' }}
                fullWidth
            />	    
        );
    },
});

export default AutoCompleteSearchKeyword;
