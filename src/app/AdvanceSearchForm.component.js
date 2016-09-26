
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
        this.state = (!props.savedTerms) ? {
            type: '',
            dateModiFrom: null,
            dateModiTo: null,
            dateCreatedFrom: null,
            dateCreatedTo: null,
            dateModifiedFrom: null,
            dateModifiedTo: null,
            author: { id: '', displayName: '' },
            commentator: { id: '', displayName: '' },
        } : props.savedTerms;

        this._typeChanged = this._typeChanged.bind(this);
        this._setDateModiFrom = this._setDateModiFrom.bind(this);
        this._setDateModiTo = this._setDateModiTo.bind(this);
        this._setDateCreatedFrom = this._setDateCreatedFrom.bind(this);
        this._setDateCreatedTo = this._setDateCreatedTo.bind(this);
        this._authorSelected = this._authorSelected.bind(this);
        this._commentatorSelected = this._commentatorSelected.bind(this);
    }

    getSearchConditions() {
        return this.state;
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

AdvanceSearchForm.propTypes = { savedTerms: React.PropTypes.object };
// AdvanceSearchForm.defaultProps = { savedTerms: undefined };

// className="searchStyle calendar"
