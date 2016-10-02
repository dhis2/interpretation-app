import React, { Component } from 'react';
import { FlatButton, Dialog, DatePicker } from 'material-ui';
// import Modal from 'react-modal';
import AdvanceSearchForm from './AdvanceSearchForm.component';
import AutoCompleteSearchKeyword from './AutoCompleteSearchKeyword.component';


export default class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            open: false,
            searchList: [],
            moreTerms: undefined,
        };

        this._searchKeywordChanged = this._searchKeywordChanged.bind(this);
        this._searchIconClicked = this._searchIconClicked.bind(this);
        this._openAdvancedSearchForm = this._openAdvancedSearchForm.bind(this);
        this._closeAdvancedSearchForm = this._closeAdvancedSearchForm.bind(this);
        this._advSearchFormReset = this._advSearchFormReset.bind(this);
        this._performAdvancedSearch = this._performAdvancedSearch.bind(this);
        this._searchedItemSelected = this._searchedItemSelected.bind(this);
    }

    bodyscrollingDisable(enable) {
        if (enable) {
            $('body').addClass('stop-scrolling');
        }
        else {
            $('body').removeClass('stop-scrolling');
        }
    }

    _searchKeywordChanged(event, value) {
        this.setState({ value });
    }

    _searchIconClicked() {
        if (this.refs.advancedSearchForm) this.refs.advancedSearchForm.collapseMenu();
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    _openAdvancedSearchForm() {
        this.setState({ open: true });
        this.bodyscrollingDisable(true);
    }

    _closeAdvancedSearchForm() {
        // get data from advanced search form
        const moreTerms = this.refs.advancedSearchForm.getSearchConditions();

        // TODO: If data exists, highlight the down-arrow with color

        this.setState({ open: false, moreTerms });
        this.bodyscrollingDisable(false);
    }

    _advSearchFormReset() {
        this.refs.advancedSearchForm.resetForm();
    }

    _performAdvancedSearch() {
        // get data from advanced search form
        const moreTerms = this.refs.advancedSearchForm.getSearchConditions();

        // Call back with search term and keyword
        this.props.onChangeEvent({ keyword: this.state.value, moreTerms });

        // Save the moreTerms in memory..
        this.setState({ open: false, moreTerms });
        this.bodyscrollingDisable(false);
    }

    _searchedItemSelected(item) {
        this.state.value = item.text;
        // if ID exists (selected from list), do not pass keyword
        const keywordToPass = (item.id) ? '' : item.text;
        this.props.onChangeEvent({ id: item.id, keyword: keywordToPass });
    }

    render() {
        const actions = [
            <FlatButton
                label="Search"
                primary={true}
                onClick={this._performAdvancedSearch}
            />,
            <FlatButton
                label="Reset"
                primary={true}
                onClick={this._advSearchFormReset}
            />,
        ];

        return (
            <div className="searchDiv">
                <table className="searchTable">
                <tbody>
                <tr>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._searchIconClicked}>
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </td>
                <td>
                    <AutoCompleteSearchKeyword searchId="searchKeyword" onChange={this._searchKeywordChanged} onSelect={this._searchedItemSelected} />
                </td>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._openAdvancedSearchForm}>
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
                    contentStyle={{ position: 'absolute', top: '33px', left: '12px', right: 'auto', bottom: 'auto', width: '645px' }}
                    autoDetectWindowHeight={false}
                >
                    <AdvanceSearchForm ref="advancedSearchForm" savedTerms={this.state.moreTerms} askPopupClose={this._closeAdvancedSearchForm} />                
                </Dialog>
            </div>
        );
    }
}

SearchBox.propTypes = { value: React.PropTypes.any,
    multiLine: React.PropTypes.bool,
    onChangeEvent: React.PropTypes.func,
     };
SearchBox.defaultProps = { value: '' };
