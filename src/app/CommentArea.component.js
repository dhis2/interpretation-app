import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import React from 'react'
import actions from './actions/Comment.action'
import CommentList from './CommentList.component'
import PostComment from './PostComment.component'

const CommentArea = createReactClass({
    propTypes: {
        comments: PropTypes.array,
        likes: PropTypes.number,
        likedBy: PropTypes.array,
        interpretationId: PropTypes.string,
        currentUser: PropTypes.object,
    },

    getInitialState() {
        const comments = this._getSubComments(this.props.comments, false)
        return {
            showComments: comments.showComments,
            hideComments: comments.hideComments,
            showAll: comments.showAll,
        }
    },

    noComment: 3,

    _getSubComments(list, showAll) {
        let hideComments = []
        let showComments = list
        if (!showAll) {
            let index = list.length - this.noComment
            if (index < 0) {
                index = 0
            }

            showComments = list.slice(index, list.length)
            hideComments = []
            if (showComments.length < list.length) {
                hideComments = list.slice(0, list.length - showComments.length)
            }
        }

        return {
            showAll,
            showComments,
            hideComments,
        }
    },

    _addCommentSuccess() {
        actions
            .listComment(undefined, this.props.interpretationId)
            .subscribe(result => {
                this.setState({
                    hideComments: [],
                    showComments: [],
                })

                this.setState(
                    this._getSubComments(result.comments, this.state.showAll),
                    function () {
                        const postComentTagId = `postComent_${this.props.interpretationId}`
                        $(`#${postComentTagId}`)
                            .closest('.interpretationCommentArea')
                            .show()
                    }
                )
            })
    },

    _updateCommentSuccess(id, text) {
        const showComments = this.state.showComments
        for (let i = 0; i < showComments.length; i++) {
            if (showComments[i].id === id) {
                showComments[i].text = text
            }
        }

        const hideComments = this.state.hideComments
        for (let i = 0; i < hideComments.length; i++) {
            if (hideComments[i].id === id) {
                hideComments[i].text = text
            }
        }

        this.setState({
            showComments,
            hideComments,
        })
    },

    _deleteCommentSuccess() {
        actions
            .listComment(undefined, this.props.interpretationId)
            .subscribe(result => {
                this.setState({
                    hideComments: [],
                    showComments: [],
                })

                this.setState(
                    this._getSubComments(result.comments, this.state.showAll)
                )
            })
    },

    _getShowCommentListTag() {
        let commentPart = ''
        if (this.state.showComments.length > 0) {
            const keyTagId = `showList_${this.props.interpretationId}`
            commentPart = (
                <CommentList
                    list={this.state.showComments}
                    hidden={false}
                    isHidden={false}
                    key={keyTagId}
                    interpretationId={this.props.interpretationId}
                    currentUser={this.props.currentUser}
                    updateCommentSuccess={this._updateCommentSuccess}
                    deleteCommentSuccess={this._deleteCommentSuccess}
                />
            )
        }

        return commentPart
    },

    _getHideCommentListTag() {
        let commentPart = ''

        if (this.state.hideComments.length > 0) {
            const keyTagId = `hideList_${this.props.interpretationId}`
            commentPart = (
                <CommentList
                    isHidden
                    hidden
                    list={this.state.hideComments}
                    key={keyTagId}
                    interpretationId={this.props.interpretationId}
                    currentUser={this.props.currentUser}
                    updateCommentSuccess={this._updateCommentSuccess}
                    deleteCommentSuccess={this._deleteCommentSuccess}
                />
            )
        }

        return commentPart
    },

    _showMore() {
        let list = this.state.hideComments
        list = list.concat(this.state.showComments)

        setTimeout(() => {
            this.setState({
                hideComments: [],
                showComments: [],
            })
        }, 100)

        setTimeout(() => {
            this.setState({
                hideComments: [],
                showComments: list,
                showAll: true,
            })
        }, 300)
    },

    render() {
        const hasMoreTagLinkId = `hasMoreCommentLink_${this.props.interpretationId}`
        const commentAreaKey = `commentAreaMainKey_${this.props.interpretationId}`

        return (
            <div key={commentAreaKey}>
                {!this.state.showAll && this.state.hideComments.length > 0 ? (
                    <div
                        className="greyBackground paddingLeft"
                        id={hasMoreTagLinkId}
                    >
                        <a onClick={this._showMore}>
                            [{this.state.hideComments.length} more comments]
                        </a>
                    </div>
                ) : (
                    ''
                )}

                {this._getHideCommentListTag()}

                {this._getShowCommentListTag()}

                <PostComment
                    currentUser={this.props.currentUser}
                    interpretationId={this.props.interpretationId}
                    postCommentSuccess={this._addCommentSuccess}
                />
            </div>
        )
    },
})

export default CommentArea
