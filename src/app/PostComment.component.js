
import React from 'react';

  
const PostComment = React.createClass({
	
	getInitialState() {
		return {
            "list" : []
        };
    },
	
	componentDidMount() 
	{		
		
	},
	
	render() {
		return (
				
			<div className="postComment">
				<textarea className="commentArea" hintText="Add a comment..." ></textarea>
				<input type="button" class="commentButton" value="Post comment" />
			</div>
		)
	}
	
});


export default PostComment;

