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
        const comments = this._getSubComments(this.props.comments);
        return {
            showComments: comments.showComments,
            hideComments: comments.hideComments,
            hidden: true,
        };
    },

    _getSubComments(list) {
        let showComments = [];
        let hideComments = [];
        if (list.length >= 5) {
            showComments = list.slice(0, 5);
            if (list.length > 5) {
                hideComments = list.slice(5, list.length);
            }
        } else {
            showComments = list;
        }

        return {
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
            this.setState({
                hideComments: [],
                showComments: [],
            });

            this.setState(this._getSubComments(result.comments), function () {
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

    _deleteCommentSuccess(commentId) {
        actions.listComment(undefined, this.props.interpretationId).subscribe(result => {
            const comments = this.state.showComments;
            comments.concat(this.state.hideComments);
            this.removeFromArray(comments, 'id', commentId);

            this.setState({
                hideComments: [],
                showComments: [],
            });

            this.setState(this._getSubComments(result.comments));
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
            commentPart = <CommentList hidden isHidden={this.state.hidden} list={this.state.hideComments} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _showMore() {
        this.setState({ hidden: false }, function () {
            const hasMoreTagLinkId = `hasMoreCommentLink_${this.props.interpretationId}`;
            const hasMoreTagId = `hideCommentList_${this.props.interpretationId}`;

            $(`#${hasMoreTagLinkId}`).hide();
            $(`#${hasMoreTagId}`).show();
        });
    },

    render() {
        const hasMoreTagLinkId = `hasMoreCommentLink_${this.props.interpretationId}`;

        return (
            <div>
                <PostComment currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} postCommentSuccess={this._addCommentSuccess} />
                {this._getShowCommentListTag()}

                {this.state.hideComments.length > 0 && this.state.hidden ? <div id={hasMoreTagLinkId}><a onClick={this._showMore}>[{this.state.hideComments.length} more comments]</a></div> : ''}

                {this._getHideCommentListTag()}
            </div>
		);
    },
});

export default CommentArea;
