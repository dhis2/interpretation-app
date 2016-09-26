
import React from 'react';
import { Avatar } from 'material-ui';

import actions from './actions/Comment.action';

const PostComment = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.string,
        interpretationId: React.PropTypes.string,
        postCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            text: '',
        };
    },

    _addComment() {
        actions.addComment(this.props.interpretationId, this.state.text)
			.subscribe((data) => {
                // const params = data.responseHeader.split("/");
    // this.props.postCommentSuccess('', this.state.text);
    this.props.postCommentSuccess();
    this.setState({ text: '' });
		});
    },

    _onChange(e) {
        this.setState({ text: e.target.value });
    },

    render() {
        const userName = this.props.currentUser.name.split(' ');
        let initChars = userName[0][0];
        if (userName.length > 1) {
            initChars += userName[userName.length - 1][0];
        }

        const postComentTagId = `postComent_${this.props.interpretationId}`;

        return (

			<div className="postComment hidden" id={postComentTagId} >
				<table>
					<tr>
						<td>
							<Avatar color="black" size="32">{initChars}</Avatar>
						</td>
						<td>
							<table>
								<tr>
									<td>
										<textarea className="commentArea" hintText="Add a comment..." value={this.state.text} onChange={this._onChange} />
										<br />
										<a onClick={this._addComment}>Share you comment</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
		);
    },

});


export default PostComment;

