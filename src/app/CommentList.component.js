import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import React from 'react'
import Comment from './Comment.component'

const CommentList = createReactClass({
    propTypes: {
        currentUser: PropTypes.object,
        deleteCommentSuccess: PropTypes.func,
        hidden: PropTypes.bool,
        interpretationId: PropTypes.string,
        list: PropTypes.array,
        updateCommentSuccess: PropTypes.func,
    },

    getInitialState() {
        return { list: this.props.list }
    },

    render() {
        const clazzName = this.props.hidden ? 'hidden' : ''

        let tagId = ''
        if (this.props.hidden) {
            tagId = `hideCommentList_${this.props.interpretationId}`
        } else {
            tagId = `showCommentList_${this.props.interpretationId}`
        }

        return (
            <div className={clazzName} id={tagId} key={tagId}>
                {this.state.list.map(data => (
                    <div id={data.id} key={data.id} className="greyBackground">
                        <Comment
                            key={data}
                            data={data}
                            currentUser={this.props.currentUser}
                            interpretationId={this.props.interpretationId}
                            updateCommentSuccess={
                                this.props.updateCommentSuccess
                            }
                            deleteCommentSuccess={
                                this.props.deleteCommentSuccess
                            }
                        />
                    </div>
                ))}
            </div>
        )
    },
})

export default CommentList
