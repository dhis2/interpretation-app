
import React from 'react';
import Comment from './Comment.component';

const CommentList = React.createClass({
    propTypes: {
        list: React.PropTypes.text,
        currentUser: React.PropTypes.text,
        interpretationId: React.PropTypes.text,
        hidden: React.PropTypes.bool,
        isHidden: React.PropTypes.bool,
        deleteCommentSuccess: React.PropTypes.func,
        updateCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return { list: this.props.list };
    },

    render() {
        const clazzName = this.props.isHidden ? 'hidden' : '';

        let tagId = '';
        if (this.props.hidden) {
            tagId = `hideCommentList_${this.props.interpretationId}`;
        } else {
            tagId = `showCommentList_${this.props.interpretationId}`;
        }

        return (
             <div className={clazzName} id={tagId} >
                {this.state.list.map(data =>
                    <div id={data.id}>
                        <Comment key={data} data={data} currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} updateCommentSuccess={this.props.updateCommentSuccess} deleteCommentSuccess={this.props.deleteCommentSuccess} />
                    </div>
                )}
            </div>
        );
    },
});

export default CommentList;
