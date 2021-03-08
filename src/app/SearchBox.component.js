import $ from 'jquery'
import { FlatButton, Dialog } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AdvanceSearchForm from './AdvanceSearchForm.component'
import AutoCompleteSearchKeyword from './AutoCompleteSearchKeyword.component'
import { otherUtils } from './utils'

export default class SearchBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            searchList: [],
            moreTerms: undefined,
        }

        this.searchKeywordRef = React.createRef()
        this.advancedSearchFormRef = React.createRef()

        this._searchKeywordChanged = this._searchKeywordChanged.bind(this)
        this._searchIconClicked = this._searchIconClicked.bind(this)
        this._openAdvancedSearchForm = this._openAdvancedSearchForm.bind(this)
        this._closeAdvancedSearchForm = this._closeAdvancedSearchForm.bind(this)
        this._advSearchFormReset = this._advSearchFormReset.bind(this)
        this._performAdvancedSearch = this._performAdvancedSearch.bind(this)
        this._searchedItemSelected = this._searchedItemSelected.bind(this)
        this._searchEnterKeyPressed = this._searchEnterKeyPressed.bind(this)
    }

    bodyscrollingDisable(enable) {
        if (enable) {
            $('body').addClass('stop-scrolling')
        } else {
            $('body').removeClass('stop-scrolling')
        }
    }

    _searchIconClicked() {
        this.advancedSearchFormRef.current.collapseMenu()

        const keyword = this.searchKeywordRef.current.getInputKeyword()

        this.props.onChangeEvent({ keyword })
    }

    _openAdvancedSearchForm() {
        if (
            !otherUtils.checkAdvancedSearch(
                this.searchKeywordRef.current.getInputKeyword()
            )
        ) {
            this._advSearchFormReset()
        }

        this.setState({ open: true })
        this.bodyscrollingDisable(true)
    }

    _closeAdvancedSearchForm() {
        // get data from advanced search form
        this.advancedSearchFormRef.current.resetForm()

        this.setState({ open: false, moreTerms: undefined })
        this.bodyscrollingDisable(false)
    }

    _advSearchFormReset() {
        // Reset the ADV Search data - on next open
        this.setState({ moreTerms: undefined })
    }

    _performAdvancedSearch() {
        // get data from advanced search form
        const moreTerms = this.advancedSearchFormRef.current.getSearchConditions()

        // Call back with search term
        this.props.onChangeEvent({ keyword: '', moreTerms })

        // Save the moreTerms in memory..
        this.setState({ open: false, moreTerms })
        this.bodyscrollingDisable(false)

        // Populate the search text input with advanced content ('ADV: ---')
        this.searchKeywordRef.current.setInputKeyword(
            this.advancedSearchFormRef.current.generateAdvSearchText()
        )
    }

    _searchKeywordChanged(value, type) {
        if (type === 'ADV_CLEARED' || type === 'EMPTY_STR') {
            // perform default search..
            this.props.onChangeEvent({ keyword: '' })
        }
    }

    _searchedItemSelected(item) {
        this.props.onChangeEvent({ idList: item.idList })
    }

    _searchEnterKeyPressed(input) {
        this.props.onChangeEvent({ keyword: input })
    }

    render() {
        const actions = [
            <FlatButton
                key="search"
                label="Search"
                primary
                onClick={this._performAdvancedSearch}
            />,
            <FlatButton
                key="reset"
                label="Reset"
                primary
                onClick={this._advSearchFormReset}
            />,
        ]

        return (
            <div className="searchDiv">
                <table className="searchTable">
                    <tbody>
                        <tr>
                            <td className="tdSearchIcon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#BBB"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    width="30"
                                    className="searchImg"
                                    onClick={this._searchIconClicked}
                                >
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                </svg>
                            </td>
                            <td className="tdSearchTextInput">
                                <AutoCompleteSearchKeyword
                                    searchId="searchKeyword"
                                    onChange={this._searchKeywordChanged}
                                    onEnterKey={this._searchEnterKeyPressed}
                                    onSelect={this._searchedItemSelected}
                                    ref={this.searchKeywordRef}
                                />
                            </td>
                            <td className="tdAdvancedSearch">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#BBB"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    width="30"
                                    className="searchImg"
                                    onClick={this._openAdvancedSearchForm}
                                >
                                    <path d="M7 10l5 5 5-5z"></path>
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Dialog
                    actions={actions}
                    onRequestClose={this._closeAdvancedSearchForm}
                    open={this.state.open}
                    overlayStyle={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
                    contentStyle={{
                        position: 'absolute',
                        top: '33px',
                        left: '20px',
                        right: 'auto',
                        bottom: 'auto',
                        width: '645px',
                    }}
                    autoDetectWindowHeight={false}
                >
                    <AdvanceSearchForm
                        ref={this.advancedSearchFormRef}
                        savedTerms={this.state.moreTerms}
                        askPopupClose={this._closeAdvancedSearchForm}
                    />
                </Dialog>
            </div>
        )
    }
}

SearchBox.propTypes = {
    onChangeEvent: PropTypes.func,
}
