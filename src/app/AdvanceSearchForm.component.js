
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

        this.state = {
            type: '',
            dateCreatedFrom: '',
            dateCreatedTo: '',
            dateModifiedFrom: '',
            dateModifiedTo: '',
            author: '',
            commentator: '',
        };

        this._typeChanged = this._typeChanged.bind(this);
        this._setDateCreatedFrom = this._setDateCreatedFrom.bind(this);
        this._setDateCreatedTo = this._setDateCreatedTo.bind(this);
        this._setDateModifiedFrom = this._setDateModifiedFrom.bind(this);
        this._setDateModifiedTo = this._setDateModifiedTo.bind(this);
        this._authorSelected = this._authorSelected.bind(this);
        this._commentatorSelected = this._commentatorSelected.bind(this);
    }

    getSearchConditions() {
        return this.state;
    }

    _typeChanged(e) {
        this.setState({ type: e.target.value });
    }

    _setDateCreatedFrom(date) {
        this.setState({ dateCreatedFrom: date });
    }

    _setDateCreatedTo(date) {
        this.setState({ dateCreatedTo: date });
    }

    _setDateModifiedFrom(date) {
        this.setState({ dateModifiedFrom: date });
    }

    _setDateModifiedTo(date) {
        this.setState({ dateModifiedTo: date });
    }

    _authorSelected(user) {
        this.state.author = user.id;
    }

    _commentatorSelected(user) {
        this.state.commentator = user.id;
    }

    render() {
        return (
            <div className="advanceSearchForm form-control">
                <table className="advanceSearchFormTable">
                    <tbody>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Type</span></td>
                            <td className="tdData">
                                <select className="searchStyle form-control" onChange={this._typeChanged}>
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
                                <DatePicker
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateCreatedFrom}
                                    onChange={this._setDateCreatedFrom}
                                    placeholderText="From"
                                />
                                &nbsp;&nbsp;-&nbsp;&nbsp;
                                <DatePicker
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
                                <DatePicker
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateModifiedFrom}
                                    onChange={this._setdateModifiedFrom}
                                    placeholderText="From"
                                />
                                &nbsp;&nbsp;-&nbsp;&nbsp;
                                <DatePicker
                                    className="searchStyle calendar"
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.dateModifiedTo}
                                    onChange={this._setdateModifiedTo}
                                    placeholderText="To"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Author (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="author" onSelect={this._authorSelected} />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Commentator (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="commentator" onSelect={this._commentatorSelected} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

// AdvanceSearchForm.propTypes = { value: React.PropTypes.string };
// AdvanceSearchForm.defaultProps = { value: '' };

// className="searchStyle calendar"
