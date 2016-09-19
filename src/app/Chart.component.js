
import React from 'react';
import { Dialog, FlatButton, Avatar } from 'material-ui';

import MessageOwner from './MessageOwner.component';
import CommentList from './Comment.component';
import PostComment from './PostComment.component';

import actions from './actions/Interpretation.action';

const Chart = React.createClass({

    getInitialState() {
        return {
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
        };
    },

    componentDidMount() {
        const id = this.props.data.objId;
        const divId = this.props.data.id;

        if (this.props.data.type === 'REPORT_TABLE') {
            DHIS.getTable({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
                displayDensity: 'compact',
            });

			                                                                                                $('#' + divId).closest('.interpretationItem ').addClass('contentTable');
        }
        else if (this.props.data.type === 'CHART') {
            DHIS.getChart({
                uid: id,
                el: divId,
                url: '../../..',
                width: 600,
                height: 400,
            });
        }
		else {
			                                                                                                $('#' + divId).css('width', '100%');
			                                                                                                $('#' + divId).css('height', '308px');
            DHIS.getMap({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
            });
        }
    },

    _showCommentHandler() {
        const postComentTagId = `postComent ${this.props.data.id}`;
		                                                                $('#' + postComentTagId).show();
		                                                                $('#' + postComentTagId).closest('.interpretationCommentArea').show();
    },

    _likeHandler() {
        actions.updateModel(this.props.data, this.props.data.id);
        const likes = this.state.likes + 1;
        let likedBy = this.state.likedBy;
        likedBy = likedBy.concat(this.props.data.user);

        this.setState({
            likes,
            likedBy,
        });

        const peopleLikeTagId = `peopleLike ${this.props.data.id}`;

        $('#' + peopleLikeTagId).show();
    },

    _openPeopleLikedHandler() {
        this.setState({
            open: true,
        });
    },

    _closePeopleLikedHandler() {
        this.setState({
            open: false,
        });
    },

    render() {
        let commentPart = '';
        if (this.props.data.comments.length > 0) {
            commentPart = <CommentList list={this.props.data.comments} key={this.props.data.id} currentUser={this.props.data.user} />;
        }

        let commentAreaClazzNames = 'interpretationCommentArea';
        if (commentPart === '' && this.props.data.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        const postComentTagId = `postComent ${this.props.data.id}`;
        const peopleLikeTagId = `peopleLike ${this.props.data.id}`;
        const peopleLikedByDialogActions = [
            <FlatButton
                label="Cancel"
                primary
                onTouchTap={this._openPeopleLikedHandler}
        	/>,
            <FlatButton
                label="Submit"
                primary
                keyboardFocused
                onTouchTap={this._closePeopleLikedHandler}
        	/>,
        ];

        return (
			<div>
				<div className="interpretationContainer" >

				<div>
					<div className="interpretationItem">
						<div className="title">{this.props.data.name}</div>
						<div id={this.props.data.id}></div>
					</div>
				</div>

				<MessageOwner data={this.props.data} />

				<div className="linkTag">
					<a onClick={this._likeHandler}>Like</a> |
					<a onClick={this._showCommentHandler}>Comment</a>
					<span className={this.props.currentUser === this.props.data.user ? '' : 'hidden'} > |
					<a onClick={this.editHandler}>Edit</a> |
					<a onClick={this.deleteHandler}>Delete</a>
					</span>
				</div>

				<div className={commentAreaClazzNames} >
					<div id={peopleLikeTagId}>
						<img src="./images/like.png" /> <a onClick={this._openPeopleLikedHandler}>{this.state.likes} people</a><span> liked this.</span>
					</div>
					<PostComment postCommentId={postComentTagId} currentUser={this.props.currentUser} />
					{commentPart}
				</div>

				<Dialog
    title="Dialog With Actions"
    actions={peopleLikedByDialogActions}
    modal
    open={this.state.open}
    onRequestClose={this._closePeopleLikedHandler}
				>
					<div>
						{this.state.likedBy.map(likedByUserName =>
							<p>{likedByUserName}</p>
						)}
					</div>
				</Dialog>
				</div>
			</div>
		);
    },
});


const ChartList = React.createClass({
    render() {
        return (
			<div>
			{this.props.list.map(data =>

			<Chart key={data.id} data={data} currentUser={this.props.currentUser} />
			)}
			</div>
		);
    },
});


export default ChartList;
