
import React, { Component } from 'react';
import { DatePicker, SelectField, MenuItem } from 'material-ui';
// import { Button, FormControl } from 'react-bootstrap';
// import DatePicker from 'react-bootstrap-date-picker';
import AutoCompleteUsers from './AutoCompleteUsers.component';
// import DatePicker from 'react-datepicker';
import { getInstance as getD2 } from 'd2/lib/d2';


export default class AdvanceSearchForm extends Component {
    constructor(props) {
        super(props);

        // const today = new Date().toISOString();
        this.state = (!props.savedTerms) ? this.getInitialData() : props.savedTerms;

        this._clickCloseBtn = this._clickCloseBtn.bind(this);
        this._typeChanged = this._typeChanged.bind(this);
        this._setDateCreatedFrom = this._setDateCreatedFrom.bind(this);
        this._setDateCreatedTo = this._setDateCreatedTo.bind(this);
        this._setDateModiFrom = this._setDateModiFrom.bind(this);
        this._setDateModiTo = this._setDateModiTo.bind(this);
        this._authorSelected = this._authorSelected.bind(this);
        this._commentatorSelected = this._commentatorSelected.bind(this);

        this._onSelectAuthor = this._onSelectAuthor.bind(this);
    }

    getInitialData() {
        return {
            type: '',
            dateCreatedFrom: null,
            dateCreatedTo: null,
            dateModiFrom: null,
            dateModiTo: null,
            author: { id: '', displayName: '' },
            authorDataSource: [],
            commentator: { id: '', displayName: '' },
            commentatorDataSource: [],
        };
    }

    getSearchConditions() {
        return this.state;
    }

    resetForm() {
        this.setState(this.getInitialData());

        this.refs.author.clear();
        this.refs.commentator.clear();
    }

    _clickCloseBtn() {
        this.props.askPopupClose();
    }

    _typeChanged(event, index, value) {
        this.setState({ type: value });
    }

    _setDateCreatedFrom(event, date) {
        this.setState({ dateCreatedFrom: date });
    }

    _setDateCreatedTo(event, date) {
        this.setState({ dateCreatedTo: date });
    }

    _setDateModiFrom(event, dateModiFrom) {
        this.setState({ dateModiFrom });
    }

    _setDateModiTo(event, dateModiTo) {
        this.setState({ dateModiTo });
    }

    _authorSelected(user) {
        this.state.author = user;
    }

    _commentatorSelected(user) {
        this.state.commentator = user;
    }

    _onSelectAuthor(value, i) {
        // Set real author here with setstate!!
        this.state.author = this.state.authorDataSource[i].source;
    }

    render() {
        return (
            <div className="advanceSearchForm">
                <div tabIndex="0" aria-label="Close search options" className="btnImages seachPopupCloseImg" role="button" onClick={this._clickCloseBtn}>
                    <svg x="0px" y="0px" width="12px" height="12px" viewBox="0 0 10 10" focusable="false" style={{ float: 'right', margin: '0 0 10px 10px' }}>
                        <polygon points="10,1.01 8.99,0 5,3.99 1.01,0 0,1.01 3.99,5 0,8.99 1.01,10 5,6.01 8.99,10 10,8.99 6.01,5 "></polygon>
                    </svg>
                </div>
                <table className="advanceSearchFormTable">
                    <tbody>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Type</span></td>
                            <td className="tdData">
                                <SelectField value={this.state.type} onChange={this._typeChanged}>
                                    <MenuItem value="" primaryText="" />
                                    <MenuItem value="CHART" primaryText="Chart" />
                                    <MenuItem value="REPORT_TABLE" primaryText="Report Table" />
                                    <MenuItem value="MAP" primaryText="Map" />
                                </SelectField>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Date created</span></td>
                            <td className="tdData">
                                <table>
                                <tbody>
                                <tr>
                                <td>
                                    <DatePicker value={this.state.dateCreatedFrom} style={{ width: '130px' }} hintText="From" onChange={this._setDateCreatedFrom} />
                                </td>
                                <td>
                                    <div>-</div>
                                </td>
                                <td>
                                    <DatePicker value={this.state.dateCreatedTo} style={{ width: '130px' }} hintText="To" onChange={this._setDateCreatedTo} />
                                </td>
                                </tr>
                                </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Date modified</span></td>
                            <td className="tdData">
                                <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <DatePicker value={this.state.dateModiFrom} style={{ width: '130px' }} hintText="From" onChange={this._setDateModiFrom} />
                                    </td>
                                    <td>
                                        <div>-</div>
                                    </td>
                                    <td>
                                        <DatePicker value={this.state.dateModiTo} style={{ width: '130px' }} hintText="To" onChange={this._setDateModiTo} />
                                    </td>
                                </tr>
                                </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Author (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="author" fullWidth item={this.state.author} ref="author" />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Commentator (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="commentator" fullWidth item={this.state.commentator} ref="commentator" />
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
