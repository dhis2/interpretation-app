import React from 'react';
import Autocomplete from 'react-autocomplete';
import { delayOnceTimeAction } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';
import AutocompleteMod from './AutocompleteMod.component';


const autoSearchStyles = {
    item: {
        padding: '2px 6px',
        cursor: 'default',
    },
    highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default',
    },
    menu: {
        border: 'solid 1px #ccc',
    },
};

const AutoCompleteSearchKeyword = React.createClass({
    propTypes: {
        searchId: React.PropTypes.string,
        onSelect: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: '',
            itemList: [],
            loading: false,
            open: false,
        };
    },

    render() {
        return (
            <div className="searchTextDiv">
                <AutocompleteMod
                    className="searchTextbox"
                    inputProps={{ hintText: 'Search Interpretation', style: { width: '400px' } }}
                    ref="autocomplete"
                    value={this.state.value}
                    items={this.state.itemList}
                    getItemValue={(item) => item.text}
                    open={this.state.open}
                    onSelect={(value, item) => {
                        this.setState({ value, itemList: [item], open: false });
                        this.props.onSelect(item);
                    }}
                    onChange={(event, value) => {
                        this.setState({ value, loading: true, open: false });

                        delayOnceTimeAction.bind(700, this.props.searchId, () => {
                            if (value === '') {
                                this.setState({ itemList: [], loading: false, open: false });
                                this.props.onSelect({ text: '', id: '' });
                            }
                            else {
                                getD2().then(d2 => {
                                    const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

                                    d2.Api.getApi().get(url).then(result => {
                                        const openVal = (result.interpretations.length > 0) ? true: false;

                                        this.setState({ itemList: result.interpretations, loading: false, open: openVal });
                                    })
                                    .catch(errorResponse => {
                                        console.log(`error ${errorResponse}`);
                                    });
                                });
                            }
                        });
                    }}
                    renderItem={(item, isHighlighted) => (
                        <div className="searchItemsDiv" style={isHighlighted ? autoSearchStyles.highlightedItem : autoSearchStyles.item}
                            key={item.id}
                            id={item.id}
                        >{item.text}</div>
                    )}
                />
            </div>
        );
    },
});

export default AutoCompleteSearchKeyword;
