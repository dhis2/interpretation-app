import createReactClass from 'create-react-class'
import { getInstance as getD2 } from 'd2'
import { MenuItem, AutoComplete } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { delayOnceTimeAction } from './utils'

const AutoCompleteUsers = createReactClass({
    propTypes: {
        hintStyle: PropTypes.object,
        item: PropTypes.object,
        searchId: PropTypes.string,
    },

    getInitialState() {
        return {
            value: this.props.item ? this.props.item.displayName : '',
            loading: false,
            open: false,
            userDataSource: [],
            user: this.props.item
                ? this.props.item
                : { id: '', displayName: '' },
        }
    },

    clear() {
        this.setState({ value: '', user: { id: '', displayName: '' } })
    },

    _onUpdateUsers(value) {
        // this.setState({ value, loading: true, open: false });
        delayOnceTimeAction.bind(500, this.props.searchId, () => {
            if (value === '') {
                this.setState({
                    userDataSource: [],
                    user: { id: '', displayName: '' },
                })

                this.props.item.id = ''
                this.props.item.displayName = ''
            } else {
                getD2().then(d2 => {
                    const url = `users.json?paging=false&fields=id,displayName,userCredentials[username]&filter=name:ilike:${value}`

                    d2.Api.getApi()
                        .get(url)
                        .then(result => {
                            const userList = []

                            for (const user of result.users) {
                                const source = {
                                    id: user.id,
                                    displayName: `${user.displayName} (${user.userCredentials.username})`,
                                }
                                userList.push({
                                    text: source.displayName,
                                    value: (
                                        <MenuItem
                                            primaryText={source.displayName}
                                            value={source.id}
                                        />
                                    ),
                                    source,
                                })
                            }

                            this.setState({ userDataSource: userList })
                        })
                        .catch(errorResponse => {
                            console.log(`error ${errorResponse}`)
                        })
                })
            }
        })
    },

    _onSelectUser(value, i) {
        this.setState(
            {
                user: this.state.userDataSource[i].source,
            },
            () => {
                this.props.item.id = this.state.user.id
                this.props.item.displayName = this.state.user.displayName
            }
        )
    },

    render() {
        return (
            <AutoComplete
                hintText="Enter User Name"
                hintStyle={this.props.hintStyle}
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdateUsers}
                onNewRequest={this._onSelectUser}
                dataSource={this.state.userDataSource}
                searchText={this.state.value}
                fullWidth
            />
        )
    },
})

export default AutoCompleteUsers
