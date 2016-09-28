
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
// import { Button, FormControl } from 'react-bootstrap';
// import DatePicker from 'react-bootstrap-date-picker';
import AutoCompleteUsers from './AutoCompleteUsers.component';
import DatePicker from 'react-datepicker';
import { getInstance as getD2 } from 'd2/lib/d2';


export default class AdvanceSearchForm extends Component {
    constructor(props) {
        super(props);

        // const today = new Date().toISOString();
        this.state = (!props.savedTerms) ? this.getInitialData() : props.savedTerms;

        this._clickCloseBtn = this._clickCloseBtn.bind(this);
        this._typeChanged = this._typeChanged.bind(this);
        this._setDateModiFrom = this._setDateModiFrom.bind(this);
        this._setDateModiTo = this._setDateModiTo.bind(this);
        this._setDateCreatedFrom = this._setDateCreatedFrom.bind(this);
        this._setDateCreatedTo = this._setDateCreatedTo.bind(this);
        this._authorSelected = this._authorSelected.bind(this);
        this._commentatorSelected = this._commentatorSelected.bind(this);
    }

    getInitialData() {
        return {
            type: '',
            dateModiFrom: null,
            dateModiTo: null,
            dateCreatedFrom: null,
            dateCreatedTo: null,
            dateModifiedFrom: null,
            dateModifiedTo: null,
            author: { id: '', displayName: '' },
            commentator: { id: '', displayName: '' },
        };
    }

    getSearchConditions() {
        return this.state;
    }

    resetForm() {
        this.setState(this.getInitialData());
    }

    _clickCloseBtn() {
        this.props.askPopupClose();
    }

    _typeChanged(e) {
        this.setState({ type: e.target.value });
    }

    _setDateModiFrom(dateModiFrom) {
        this.setState({ dateModiFrom });
    }

    _setDateModiTo(dateModiTo) {
        this.setState({ dateModiTo });
    }

    _setDateCreatedFrom(date) {
        this.setState({ dateCreatedFrom: date });
    }

    _setDateCreatedTo(date) {
        this.setState({ dateCreatedTo: date });
    }

    _authorSelected(user) {
        this.state.author = user;
    }

    _commentatorSelected(user) {
        this.state.commentator = user;
    }

    render() {
        return (
            <div className="advanceSearchForm form-control">
                <div tabIndex="0" aria-label="Close search options" className="btnImages seachPopupCloseImg" role="button" onClick={this._clickCloseBtn}>
                    <svg x="0px" y="0px" width="12px" height="12px" viewBox="0 0 10 10" focusable="false" style={{ float: 'right', margin: '0 0 10px 10px;' }}>
                        <polygon points="10,1.01 8.99,0 5,3.99 1.01,0 0,1.01 3.99,5 0,8.99 1.01,10 5,6.01 8.99,10 10,8.99 6.01,5 "></polygon>
                    </svg>
                </div>
                <table className="advanceSearchFormTable">
                    <tbody>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Type</span></td>
                            <td className="tdData">
                                <select className="searchStyle form-control" value={this.state.type} onChange={this._typeChanged}>
                                    <option value=""></option>
                                    <option value="CHART">Chart</option>
                                    <option value="REPORT_TABLE">Report Table</option>
                                    <option value="MAP">Map</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Date created</span></td>
                            <td className="tdData">
                                <DatePicker key="dateCreatedFrom"
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateCreatedFrom}
                                    onChange={this._setDateCreatedFrom}
                                    placeholderText="From"
                                />
                                &nbsp;&nbsp;-&nbsp;&nbsp;
                                <DatePicker key="dateCreatedTo"
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateCreatedTo}
                                    onChange={this._setDateCreatedTo}
                                    placeholderText="To"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Date modified</span></td>
                            <td className="tdData">
                                <DatePicker key="dateModiFrom"
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateModiFrom}
                                    onChange={this._setDateModiFrom}
                                    placeholderText="From"
                                />
                                &nbsp;&nbsp;-&nbsp;&nbsp;
                                <DatePicker key="dateModiTo"
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateModiTo}
                                    onChange={this._setDateModiTo}
                                    placeholderText="To"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Author (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="author" item={this.state.author} />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Commentator (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="commentator" item={this.state.commentator} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

AdvanceSearchForm.propTypes = {
    savedTerms: React.PropTypes.object,
    askPopupClose: React.PropTypes.func,
};
// AdvanceSearchForm.defaultProps = { savedTerms: undefined };

// className="searchStyle calendar"
