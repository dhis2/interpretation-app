
import React from 'react';
import Autocomplete from 'react-autocomplete';
import { delayOnceTimeAction } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';

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

const AutoCompleteUsers = React.createClass({
    propTypes: {
        searchId: React.PropTypes.string,
        value: React.PropTypes.string,
        item: React.PropTypes.object,
    },

    getInitialState() {
        return {
            value: this.props.item.displayName,
            itemList: [],
            loading: false,
            open: false,
        };
    },

    render() {
        return (
            <div className="divAuthorSelector">
                <Autocomplete
                    className="searchStyle author"
                    inputProps={{ placeholder: 'Type User Name', style: { width: '250px' } }}
                    ref="autocomplete"
                    value={this.state.value}
                    items={this.state.itemList}
                    getItemValue={(item) => item.displayName}
                    open={this.state.open}
                    onSelect={(value, item) => {
                        this.setState({ value, itemList: [item], open: false });
                        this.props.item.id = item.id;
                        this.props.item.displayName = item.displayName;
                    }}
                    onChange={(event, value) => {
                        this.setState({ value, loading: true, open: false });

                        delayOnceTimeAction.bind(500, this.props.searchId, () => {
                            if (value === '') {
                                this.setState({ itemList: [], loading: false, open: false });
                                // this.props.onSelect({ displayName: '', id: '' });
                                this.props.item.id = '';
                                this.props.item.displayName = '';
                            }
                            else {
                                getD2().then(d2 => {
                                    const url = `users.json?paging=false&filter=name:ilike:${value}`;
                                    d2.Api.getApi().get(url).then(result => {
                                        const openVal = (result.users.length > 0);

                                        this.setState({ itemList: result.users, loading: false, open: openVal });
                                    })
                                    .catch(errorResponse => {
                                        console.log(`error ${errorResponse}`);
                                    });
                                });
                            }
                        });
                    }}
                    renderItem={(item, isHighlighted) => (
                        <div style={isHighlighted ? autoSearchStyles.highlightedItem : autoSearchStyles.item}
                            key={item.id}
                            id={item.id}
                        >{item.displayName}</div>
                    )}
                />
            </div>
        );
    },
});

export default AutoCompleteUsers;
