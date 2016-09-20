
import React from 'react';
import Comment from './Comment.component';

const CommentList = React.createClass({
    propTypes: {
        list: React.PropTypes.text,
        currentUser: React.PropTypes.text,
    },

    getInitialState() {
        const comments = this.props.list.split(';');
        return { list: comments };
    },

    render() {
        return (
            <div>
                {this.state.list.map(data =>
                    <Comment key={data} data={data} currentUser={this.props.currentUser} />
                )}
            </div>
        );
    },
});

export default CommentList;
