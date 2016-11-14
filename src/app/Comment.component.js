
import React from 'react';
import { IntlProvider, FormattedRelative } from 'react-intl';
import { Avatar } from 'material-ui';
import { otherUtils } from './utils';

import actions from './actions/Comment.action';

const Comment = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        created: React.PropTypes.string,
        user: React.PropTypes.string,
        currentUser: React.PropTypes.object,
        interpretationId: React.PropTypes.string,
        deleteCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        const comments = this._setComments(this.props.data.text, this.props.data.text);

        return {
            data: this.props.data,
            text: comments.text,
            oldText: comments.text,
            showContent: comments.showContent,
            hideContent: comments.hideContent,
        };
    },

    componentDidMount() {
        this._displayContent();
    },

    _displayContent() {
        const showContent = otherUtils.parseStringToHTML(this.state.showContent);
        const hideContent = otherUtils.parseStringToHTML(this.state.hideContent);

        const divShowContent = `showContent_${this.props.data.id}`;
        const divHideContent = `hideContent_${this.props.data.id}`;

        $(`#${divShowContent}`).html('');
        $(`#${divHideContent}`).html('');
        $(`#${divShowContent}`).append(showContent);
        $(`#${divHideContent}`).append(hideContent);
    },

    maxWords: 30,

    _getWords(str, start, end) {
        return str.split(/\s+/).slice(start, end).join(' ');
    },

    _setComments(content, oldText) {
        let hideContent = '';
        const noWords = content.split(/\s+/).length;
        if (noWords >= this.maxWords) {
            hideContent = this._getWords(content, this.maxWords, noWords);
        }

        return {
            text: content,
            showContent: this._getWords(content, 0, this.maxWords),
            hideContent,
            oldText,
        };
    },

    _deleteHandler() {
        actions.deleteComment(this.props.interpretationId, this.state.data.id)
			.subscribe(() => {
    this.props.deleteCommentSuccess(this.state.data.id);
		});
    },

    _showEditHandler() {
        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;

        $(`#${divEditText}`).show();
        $(`#${divShowText}`).hide();
    },

    _handleClick(e) {
        const linkTag = $(e.target);
        linkTag.closest('.interpretationText').find('.hideContent').show();
        linkTag.hide();
    },

    _onChange(e) {
        this.setState(this._setComments(e.target.value, this.state.oldText), function () {
            this._displayContent();
        });
    },

    _editCommentText() {
        const text = this.state.text;
        actions.editComment(this.props.interpretationId, this.state.data.id, text)
			.subscribe(() => {
    this.setState(this._setComments(this.state.text, this.state.text), function () {
        this._displayContent();
    });
    const divEditText = `edit_${this.props.data.id}`;
    const divShowText = `show_${this.props.data.id}`;

    $(`#${divEditText}`).hide();
    $(`#${divShowText}`).show();
		});
    },

    _cancelCommentText() {
        this.setState(this._setComments(this.state.oldText, this.state.oldText), function () {
            this._displayContent();

            const divEditText = `edit_${this.props.data.id}`;
            const divShowText = `show_${this.props.data.id}`;

            $(`#${divEditText}`).hide();
            $(`#${divShowText}`).show();
        });
    },

    _convertToNumber(n) {
        return (n.startsWith('0')) ? eval(n[1]) : eval(n);
    },

    render() {
        const created = this.state.data.created.substring(0, 10).split('-');
        const time = this.state.data.created.substring(11, 19).split(':');

        let month = this._convertToNumber(created[1]);
        month = month - 1;
        const day = this._convertToNumber(created[2]);
        const hour = this._convertToNumber(time[0]);
        const minute = this._convertToNumber(time[1]);
        const second = this._convertToNumber(time[2]);


        const date = new Date(eval(created[0]), month, day, hour, minute, second);

        const userName = this.state.data.user.name.split(' ');
        let initChars = userName[0][0];
        if (userName.length > 1) {
            initChars += userName[userName.length - 1][0];
        }

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        const divShowContent = `showContent_${this.props.data.id}`;
        const divHideContent = `hideContent_${this.props.data.id}`;
        const style = { fontSize: 15, fontWeight: 'bold' };
        let clazzName = 'moreLink';
        if (this.state.hideContent.length === 0) {
            clazzName += ' hidden';
        }


        return (
            <table>
                <tbody>
                    <tr>
                        <td className="valignTop"><Avatar color="black" size={32} style={style}>{initChars}</Avatar></td>
                        <td>
                            <div className="interpretationComment">
                                <div className="interpretationText">
                                     <div id={divShowText} >
                                        <a className="bold userLink">{this.state.data.user.name} </a>
                                        <span id={divShowContent}></span>
                                        <span className={clazzName} onClick={this._handleClick}> ... more</span>
                                        <span className="hideContent hidden" id={divHideContent}></span>
                                    </div>
                                    <div className="hidden" id={divEditText}>
                                        <textarea className="commentArea" value={this.state.text} onChange={this._onChange} />
                                        <a onClick={this._editCommentText}>OK</a><label className="linkArea">·</label><a onClick={this._cancelCommentText}>Cancel</a>
                                    </div>
                                </div>

                                <span className="tipText">
                                    <IntlProvider locale="en">
                                        <FormattedRelative value={date} />
                                    </IntlProvider>
                                </span>
                                <span className={this.props.currentUser.id === this.state.data.user.id || this.props.currentUser.superUser ? '' : 'hidden'} >
                                   <label className="linkArea"></label><a onClick={this._showEditHandler}>Edit</a>
                                   <label className="linkArea">·</label><a onClick={this._deleteHandler}>Delete</a>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
});

export default Comment;
