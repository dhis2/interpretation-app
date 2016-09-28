import React, { Component } from 'react';
import Modal from 'react-modal';
import AdvanceSearchForm from './AdvanceSearchForm.component';
import AutoCompleteSearchKeyword from './AutoCompleteSearchKeyword.component';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        zIndex: 1000,
    },
    content: {
        position: 'absolute',
        top: '100px',
        left: '20px',
        right: 'auto',
        bottom: 'auto',
        width: '500px',
        'box-shadow': '3px 3px 2px #DDD',
        'font-size': '13px !important',
    },
};


export default class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            open: false,
            searchList: [],
            moreTerms: undefined,
        };

        this._onChange = this._onChange.bind(this);
        this._clickSearchIcon = this._clickSearchIcon.bind(this);
        this._openAdvancedSearchForm = this._openAdvancedSearchForm.bind(this);
        this._closeAdvancedSearchForm = this._closeAdvancedSearchForm.bind(this);
        this._advSearchFormReset = this._advSearchFormReset.bind(this);
        this._performAdvancedSearch = this._performAdvancedSearch.bind(this);
        this._onInputEnterPressed = this._onInputEnterPressed.bind(this);

        this._keywordSelected = this._keywordSelected.bind(this);
    }

    bodyscrollingDisable(enable) {
        if (enable) {
            $('body').addClass('stop-scrolling');
        }
        else {
            $('body').removeClass('stop-scrolling');
        }
    }

    _onChange(event, value) {
        this.setState({ value });
    }

    _clickSearchIcon() {
        if (this.refs.advancedSearchForm) this.refs.advancedSearchForm.collapseMenu();
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    _openAdvancedSearchForm() {
        if (this.refs.advancedSearchForm) this.refs.advancedSearchForm.collapseMenu();

        const offSet = $('div.searchDiv').offset();

        customStyles.content.top = `${Number(offSet.top) + 45}px`;
        customStyles.content.left = `${offSet.left}px`;

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

        // TODO: If data exists, highlight the down-arrow with color

        // Call back with search term and keyword
        this.props.onChangeEvent({ keyword: this.state.value, moreTerms });

        // Save the moreTerms in memory..
        this.setState({ open: false, moreTerms });
        this.bodyscrollingDisable(false);
    }

    _keywordSelected(item) {
        this.state.value = item.text;
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    _onInputEnterPressed() {
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    render() {
        return (
            <div className="searchDiv">
                <table className="searchTable"><tr>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._clickSearchIcon}>
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </td>
                <td>
                    <AutoCompleteSearchKeyword searchId="searchKeyword" onChange={this._onChange} onSelect={this._keywordSelected} onInputEnterPressed={this._onInputEnterPressed} />
                </td>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._openAdvancedSearchForm}>
                        <path d="M7 10l5 5 5-5z"></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </td>
                </tr></table>

                <Modal
                    isOpen={this.state.open}
                    onRequestClose={this._closeAdvancedSearchForm}
                    style={customStyles}
                    shouldCloseOnOverlayClick
                >
                    <AdvanceSearchForm ref="advancedSearchForm" savedTerms={this.state.moreTerms} askPopupClose={this._closeAdvancedSearchForm} />
                    <div className="advanceSearchFormBtns">
                        <button className="cssBtnBlue" onClick={this._performAdvancedSearch}>Search</button>
                        <button className="cssBtnGray" onClick={this._advSearchFormReset}>Reset</button>
                    </div>
                </Modal>
            </div>
        );
    }
}

SearchBox.propTypes = { value: React.PropTypes.any,
    multiLine: React.PropTypes.bool,
    onChangeEvent: React.PropTypes.func,
     };
SearchBox.defaultProps = { value: '' };
