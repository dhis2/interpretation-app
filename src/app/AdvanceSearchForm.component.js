
import React, { Component } from 'react';
import { DatePicker, TextField, SelectField, MenuItem, Checkbox } from 'material-ui';
import AutoCompleteUsers from './AutoCompleteUsers.component';
import { otherUtils, dateUtil } from './utils';

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
        this._onChangeInterpretationText = this._onChangeInterpretationText.bind(this);
        this._onChangeFavoritesName = this._onChangeFavoritesName.bind(this);
        this._onChangeCommentText = this._onChangeCommentText.bind(this);
        this._onCheckStar = this._onCheckStar.bind(this);
        this._onCheckSubscribe = this._onCheckSubscribe.bind(this);
        this._onCheckMention = this._onCheckMention.bind(this);
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
            interpretationText: '',
            favoritesName: '',
            commentText: '',
            showFavoritesNameSearch: false,
            //favoritesNameSearchHint: '',
            star: false,
            subscribe: false,
            mention: false,
        };
    }

    getSearchConditions() {
        return this.state;
    }

    resetForm() {
        this.setState(this.getInitialData());

        if (this.refs.author !== undefined) this.refs.author.clear();
        if (this.refs.commentator !== undefined) this.refs.commentator.clear();
    }

    generateAdvSearchText() {
        let summaryStr = '';

        // TODO: Trim - otherUtils.trim
        if (this.state.type) summaryStr += `Type: ${this.state.type}, `;
        if (this.state.dateCreatedFrom) summaryStr += `dateCreatedFrom: ${dateUtil.formatDateMMDDYYYY(this.state.dateCreatedFrom, '/')}, `;
        if (this.state.dateCreatedTo) summaryStr += `dateCreatedTo: ${dateUtil.formatDateMMDDYYYY(this.state.dateCreatedTo, '/')}, `;
        if (this.state.dateModiFrom) summaryStr += `dateModiFrom: ${dateUtil.formatDateMMDDYYYY(this.state.dateModiFrom, '/')}, `;
        if (this.state.dateModiTo) summaryStr += `dateModiTo: ${dateUtil.formatDateMMDDYYYY(this.state.dateModiTo, '/')}, `;
        if (this.state.author.id) summaryStr += `author: ${this.state.author.displayName}, `;
        if (this.state.commentator.id) summaryStr += `commentator: ${this.state.commentator.displayName}, `;
        if (this.state.interpretationText) summaryStr += `interpretationText: ${this.state.interpretationText}, `;
        if (this.state.favoritesName) summaryStr += `favoritesName: ${this.state.favoritesName}, `;
        if (this.state.commentText) summaryStr += `commentText: ${this.state.commentText}, `;

        // TODO: Need to use Star/Subscribe/Mention..  <-- DOES THIS WORK?  
        if (this.state.star) summaryStr += `star: ${this.state.star}, `;
        if (this.state.subscribe) summaryStr += `subscribe: ${this.state.subscribe}, `;
        if (this.state.mention) summaryStr += `mention: ${this.state.mention}, `;

        if (summaryStr) summaryStr = `${otherUtils.advSearchStr}: ${summaryStr.substring(0, summaryStr.length - 2)}`;

        return summaryStr;
    }

    _clickCloseBtn() {
        this.props.askPopupClose();
    }

    _typeChanged(event, index, value) {
        this.setState({ type: value });

        //this.setState({ favoritesNameSearchHint: 'Partial Type Favorites Name' });
        // Show Hide the line..
        const showFavoritesNameSearchRow = (value); // ? true : false;
        this.setState({ showFavoritesNameSearch: showFavoritesNameSearchRow });
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

    _onChangeInterpretationText(event) {
        this.setState({ interpretationText: event.target.value });
    }
    _onChangeFavoritesName(event) {
        this.setState({ favoritesName: event.target.value });
    }
    _onChangeCommentText(event) {
        this.setState({ commentText: event.target.value });
    }

    _onCheckStar(event) {
        setTimeout(() => {
            this.setState((oldState) => { return { star: !oldState.star }; });    
        }, 1 );
    }
    _onCheckSubscribe(event) {
        setTimeout(() => {
            this.setState((oldState) => { return { subscribe: !oldState.subscribe }; });    
        }, 1 );
    }
    _onCheckMention(event) {
        setTimeout(() => {
            this.setState((oldState) => { return { mention: !oldState.mention }; });
        }, 1 );
    }

    _tempClickFix( returnFunc ) {
        setTimeout( returnFunc, 1 );
    }

    render() {
        const hintStyle = { fontSize: '14px' };
        const underlineStyle = { width: '400px' };
        const menuStyle = { fontSize: '14px' };
        const fontStyle = { fontSize: '14px' };

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
                                <SelectField value={this.state.type} style={fontStyle} menuStyle={menuStyle} hintStyle={hintStyle} onChange={this._typeChanged}>
                                    <MenuItem value="" primaryText="No Selection" />
                                    <MenuItem value="CHART" primaryText="Chart" />
                                    <MenuItem value="VISUALIZATION" primaryText="Visualization" />
                                    <MenuItem value="EVENT_CHART" primaryText="Event Chart" />
                                    <MenuItem value="EVENT_REPORT" primaryText="Event Report Table" />
                                    <MenuItem value="MAP" primaryText="Map" />
                                </SelectField>
                            </td>
                        </tr>
                        { this.state.showFavoritesNameSearch ? <tr>
                            <td className="tdTitle"><span className="searchStyle">Favorites Name</span></td>
                            <td className="tdData">
                                <TextField
                                    hintText="Partial Favorites Name"
                                    hintStyle={hintStyle}
                                    value={this.state.favoritesName}
                                    fullWidth
                                    underlineStyle={underlineStyle}
                                    onChange={this._onChangeFavoritesName}
                                />
                            </td>
                        </tr> : null }
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Date created</span></td>
                            <td className="tdData">
                                <table>
                                <tbody>
                                <tr>
                                <td>
                                    <DatePicker value={this.state.dateCreatedFrom} style={{ width: '130px' }} underlineStyle={{ width: '130px' }} hintText="From" hintStyle={hintStyle} onChange={this._setDateCreatedFrom} />
                                </td>
                                <td>
                                    <div>-</div>
                                </td>
                                <td>
                                    <DatePicker value={this.state.dateCreatedTo} style={{ width: '130px' }} underlineStyle={{ width: '130px' }} hintText="To" hintStyle={hintStyle} onChange={this._setDateCreatedTo} />
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
                                        <DatePicker value={this.state.dateModiFrom} style={{ width: '130px' }} underlineStyle={{ width: '130px' }} hintText="From" hintStyle={hintStyle} onChange={this._setDateModiFrom} />
                                    </td>
                                    <td>
                                        <div>-</div>
                                    </td>
                                    <td>
                                        <DatePicker value={this.state.dateModiTo} style={{ width: '130px' }} underlineStyle={{ width: '130px' }} hintText="To" hintStyle={hintStyle} onChange={this._setDateModiTo} />
                                    </td>
                                </tr>
                                </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Follow-ups</span></td>
                            <td className="tdData">
                                <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <Checkbox label="Mention" value={this.state.mention} checked={this.state.mention} onCheck={this._onCheckMention} iconStyle={{left: "7"}} />
                                    </td>
                                </tr>
                                </tbody>
                                </table>
                            </td>
                        </tr>                        
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Author (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="author" fullWidth hintStyle={hintStyle} item={this.state.author} ref="author" />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Commentator (user)</span></td>
                            <td className="tdData">
                                <AutoCompleteUsers searchId="commentator" fullWidth hintStyle={hintStyle} item={this.state.commentator} ref="commentator" />
                            </td>
                        </tr>

                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Interpretation Text</span></td>
                            <td className="tdData">
                                <TextField
                                    hintText="Partial Interpretation Text"
                                    hintStyle={hintStyle}
                                    value={this.state.interpretationText}
                                    fullWidth
                                    onChange={this._onChangeInterpretationText}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="tdTitle"><span className="searchStyle">Comment Text</span></td>
                            <td className="tdData">
                                <TextField
                                    hintText="Partial Comment Text"
                                    hintStyle={hintStyle}
                                    value={this.state.commentText}
                                    fullWidth
                                    onChange={this._onChangeCommentText}
                                />
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
