import React, { Component } from 'react';
import { TextField } from 'material-ui';
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
            value: props.value,
            open: false,
            searchList: [],
            moreTerms: undefined,
        };

        this._change = this._change.bind(this);
        this._clickPerformSearch = this._clickPerformSearch.bind(this);
        this._handleOpenAdvancedSearch = this._handleOpenAdvancedSearch.bind(this);
        this._handleCloseAdvancedSearch = this._handleCloseAdvancedSearch.bind(this);
        this._handleAdvancedSearch = this._handleAdvancedSearch.bind(this);
        this._keyDown = this._keyDown.bind(this);
        this._clickTest = this._clickTest.bind(this);

        this._keywordSelected = this._keywordSelected.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ value: props.value });
    }

    bodyscrollingDisable(enable) {
        if (enable) {
            $('body').addClass('stop-scrolling');
        }
        else {
            $('body').removeClass('stop-scrolling');
        }
    }

    _change(e) {
        this.setState({ value: e.target.value });
    }

    _clickPerformSearch() {
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    _handleOpenAdvancedSearch() {
        const offSet = $('div.searchDiv').offset();

        customStyles.content.top = `${Number(offSet.top) + 45}px`;
        customStyles.content.left = `${offSet.left}px`;

        this.setState({ open: true });
        this.bodyscrollingDisable(true);
    }

    _handleCloseAdvancedSearch() {
        // get data from advanced search form
        const moreTerms = this.refs.advancedSearchForm.getSearchConditions();

        // TODO: If data exists, highlight the down-arrow with color

        this.setState({ open: false, moreTerms });
        this.bodyscrollingDisable(false);
    }

    _handleAdvancedSearch() {
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

    _clickTest() {
        this.setState({ open: false });
        this.bodyscrollingDisable(false);
    }

    _keyDown(e) {
        if (e.keyCode === 13) {
            this.props.onChangeEvent({ keyword: this.state.value });
        }
    }

    render() {
        const errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : 0,
        };

        return (
            <div className="searchDiv">
                <table className="searchTable">
                <tr>
                <td>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._clickPerformSearch}>
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
                </td>
                <td>
                    <AutoCompleteSearchKeyword searchId="searchKeyword" onSelect={this._keywordSelected} />
                </td>
                <td>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="30" viewBox="0 0 24 24" width="30" className="searchImg" onClick={this._handleOpenAdvancedSearch}>
                    <path d="M7 10l5 5 5-5z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
                </td>
                </tr>
                </table>

                <Modal
                    isOpen={this.state.open}
                    onRequestClose={this._handleCloseAdvancedSearch}
                    style={customStyles}
                    shouldCloseOnOverlayClick={true}>
                    <AdvanceSearchForm ref="advancedSearchForm" savedTerms={this.state.moreTerms} />
                    <div className="advanceSearchFormBtns">
                        <button className="cssBtnBlue" onClick={this._handleAdvancedSearch}>Search</button>
                        <button className="cssBtnGray" onClick={this._handleCloseAdvancedSearch}>Close</button>
                    </div>
                </Modal>
            </div>
        );
    }
}

SearchBox.propTypes = { value: React.PropTypes.string,
    multiLine: React.PropTypes.bool,
    onChangeEvent: React.PropTypes.func,
     };
SearchBox.defaultProps = { value: '' };

/*

                <TextField errorStyle={errorStyle} {...this.props} value={this.state.value} onChange={this._change} style={{ width: 350 }} onKeyDown={this._keyDown} />


                <TextField errorStyle={errorStyle} {...this.props} value={this.state.value} onChange={this._change} style={{ width: 350 }} onKeyDown={this._keyDown} />

*/
