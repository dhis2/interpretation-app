import React from 'react';
import CommentList from './CommentList.component';
import PostComment from './PostComment.component';

import actions from './actions/Comment.action';

const CommentArea = React.createClass({

    propTypes: {
        comments: React.PropTypes.string,
        likes: React.PropTypes.int,
        likedBy: React.PropTypes.array,
        interpretationId: React.PropTypes.string,
        currentUser: React.PropTypes.string,
    },

    getInitialState() {
        const comments = JSON.parse(this.props.comments);
        return this._setComments(comments);
    },

    _setComments(list) {
        let showComments = [];
        let hideComments = [];
        if (list.length >= 5) {
            showComments = list.slice(0, 5);
            if (list.length > 6) {
                hideComments = list.slice(6, list.length - 1);
            }
        }
        else {
            showComments = list;
        }

        return {
            comments: list,
            showComments,
            hideComments,
        };
    },

    removeFromArray(list, propertyName, value) {
        let index;

        for (let i = 0; i < list.length; i++) {
            if (list[i][propertyName] === value) {
                index = i;
            }
        }

        if (index !== undefined) {
            list.splice(index, 1);
        }

        return list;
    },

    // _addCommentSuccess(id, text) {
    _addCommentSuccess() {
        actions.listComment(undefined, this.props.interpretationId).subscribe(result => {
            /* const currentDateObj = new Date();
            let month = eval(currentDateObj.getMonth()) + 1;
            month = (month < 10) ? `0${month}` : month;
            const currentDate = `${currentDateObj.getFullYear()}-${month}-${currentDateObj.getDate()} ${currentDateObj.getHours()}:${currentDateObj.getMinutes()}:${currentDateObj.getSeconds()}`;
            const comments = this.state.comments;
            const commentId = result.comments[result.comments.length - 1].id;
            comments.push({
                id: `${commentId}`,
                created: `${currentDate}`,
                text: `${text}`,
                user: {
                    id: this.props.currentUser.id,
                    name: this.props.currentUser.name,
                },
            });

            this.setState({ comments }); */

            this._setComments(result.comments);

            const postComentTagId = `postComent_${this.props.interpretationId}`;
            $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
        });
    },

    _updateCommentSuccess(id, text) {
        const comments = this.state.comments;
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === id) {
                comments[i].text = text;
            }
        }

        this.setState({ comments });
    },

    _deleteCommentSuccess(commentId) {
        const comments = this.state.comments;
        this.removeFromArray(comments, 'id', commentId);
        this.setState({ comments });
    },

    _getShowCommentListTag() {
        let commentPart = '';
        if (this.state.showComments.length > 0) {
            const keyTagId = `showList_${this.props.interpretationId}`;
            commentPart = <CommentList list={this.state.showComments} hidden={false} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _getHideCommentListTag() {
        let commentPart = '';
        if (this.state.hideComments.length > 0) {
            const hasMoreTagId = `hasMore_${this.props.interpretationId}`;
            const keyTagId = `hideList_${this.props.interpretationId}`;
            commentPart = <CommentList id={hasMoreTagId} hidden list={this.state.hideComments} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _getCommentAreaClazz() {
        let commentAreaClazzNames = 'interpretationCommentArea';
        if (this.state.comments.length > 0 && this.props.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        return commentAreaClazzNames;
    },

    _showMore() {
        const hasMoreTagLinkId = `hasMoreLink_${this.props.interpretationId}`;
        const hasMoreTagId = `hasMore_${this.props.interpretationId}`;

        $(`#${hasMoreTagLinkId}`).hide();
        $(`#${hasMoreTagId}`).show();
    },

    render() {
        const hasMoreTagLinkId = `hasMoreLink_${this.props.interpretationId}`;

        return (
            <div className={this._getCommentAreaClazz()} >
                <PostComment currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} postCommentSuccess={this._addCommentSuccess} />
                {this._getShowCommentListTag()}

                {this.state.hideComments.length > 0 ? <div id={hasMoreTagLinkId}><a onClick={this._showMore}>[{this.state.hideComments.length} more comments]</a></div> : '' }

                {this._getHideCommentListTag()}
            </div>
		);
    },
});

export default CommentArea;
