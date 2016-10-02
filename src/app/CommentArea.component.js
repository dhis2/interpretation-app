import React from 'react';
import CommentList from './CommentList.component';
import PostComment from './PostComment.component';

import actions from './actions/Comment.action';

const CommentArea = React.createClass({

    propTypes: {
        comments: React.PropTypes.array,
        likes: React.PropTypes.number,
        likedBy: React.PropTypes.array,
        interpretationId: React.PropTypes.string,
        currentUser: React.PropTypes.object,
    },

    getInitialState() {
        const comments = this._getSubComments(this.props.comments, 1);
        return {
            showComments: comments.showComments,
            hideComments: comments.hideComments,
            indexShowRecord: comments.indexShowRecord,
        };
    },

    noComment: 3,

    _getSubComments(list, indexShowRecord) {
        let showComments = [];
        let hideComments = [];
        const idx = this.noComment * indexShowRecord;
        if (list.length >= this.noComment) {
            showComments = list.slice(0, idx);
            if (list.length > this.noComment) {
                hideComments = list.slice(idx, list.length);
            }
        } else {
            showComments = list;
        }

        return {
            indexShowRecord,
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

    _addCommentSuccess() {
        actions.listComment(undefined, this.props.interpretationId).subscribe(result => {
            this.setState({
                hideComments: [],
                showComments: [],
            });

            this.setState(this._getSubComments(result.comments.reverse(), this.state.indexShowRecord), function () {
                const postComentTagId = `postComent_${this.props.interpretationId}`;
                $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
            });
        });
    },

    _updateCommentSuccess(id, text) {
        const showComments = this.state.showComments;
        for (let i = 0; i < showComments.length; i++) {
            if (showComments[i].id === id) {
                showComments[i].text = text;
            }
        }

        const hideComments = this.state.hideComments;
        for (let i = 0; i < hideComments.length; i++) {
            if (hideComments[i].id === id) {
                hideComments[i].text = text;
            }
        }

        this.setState({
            showComments,
            hideComments,
        });
    },

    _deleteCommentSuccess() {
        actions.listComment(undefined, this.props.interpretationId).subscribe(result => {
            this.setState({
                hideComments: [],
                showComments: [],
            });

            this.setState(this._getSubComments(result.comments.reverse(), this.state.indexShowRecord));
        });
    },

    _getShowCommentListTag() {
        let commentPart = '';
        if (this.state.showComments.length > 0) {
            const keyTagId = `showList_${this.props.interpretationId}`;
            commentPart = <CommentList list={this.state.showComments} hidden={false} isHidden={false} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _getHideCommentListTag() {
        let commentPart = '';

        if (this.state.hideComments.length > 0) {
            const keyTagId = `hideList_${this.props.interpretationId}`;
            commentPart = <CommentList isHidden hidden list={this.state.hideComments} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _showMore() {
        const me = this;
        let list = this.state.showComments;
        list = list.concat(this.state.hideComments);

        this.setState({
            hideComments: [],
            showComments: [],
        });

        setTimeout(() => {
            const indexShowRecord = me.state.indexShowRecord + 1;
            me.setState(me._getSubComments(list, indexShowRecord), () => {
                const hasMoreTagLinkId = `hasMoreCommentLink_${me.props.interpretationId}`;
                const hasMoreTagId = `hideCommentList_${me.props.interpretationId}`;

                const commentListLength = me.state.showComments.length + me.state.hideComments.length;
                const idx = me.state.indexShowRecord * me.noComment;
                if (idx > commentListLength) {
                $(`#${hasMoreTagLinkId}`).hide();
                $(`#${hasMoreTagId}`).show();
                }
            });
        }, 100);
    },

    render() {
        const hasMoreTagLinkId = `hasMoreCommentLink_${this.props.interpretationId}`;
        const commentAreaKey = `commentAreaMainKey_${this.props.interpretationId}`;

        return (
            <div key={commentAreaKey}>
                <PostComment currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} postCommentSuccess={this._addCommentSuccess} />
                {this._getShowCommentListTag()}

                {this.state.hideComments.length > 0 ? <div id={hasMoreTagLinkId}><a onClick={this._showMore}>[{this.state.hideComments.length} more comments]</a></div> : ''}

                {this._getHideCommentListTag()}
            </div>
		);
    },
});

export default CommentArea;
