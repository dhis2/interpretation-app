
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import MessageOwner from './MessageOwner.component';
import CommentArea from './CommentArea.component';

import actions from './actions/Interpretation.action';

const Interpretation = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        currentUser: React.PropTypes.string,
        deleteInterpretationSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            text: this.props.data.text,
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
            comments: this.props.data.comments,
        };
    },

    componentDidMount() {
        const currentUserId = this.props.currentUser.id;
        for (let i = 0; i < this.props.data.likedBy.length; i++) {
            if (currentUserId === this.props.data.likedBy[i].id) {
                const likeLinkTagId = `likeLink_${this.props.data.id}`;
                $(`#${likeLinkTagId}`).replaceWith("<span class='disabledLink'>Like</span>");
            }
        }

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
        const postComentTagId = `postComent_${this.props.data.id}`;
        $(`#${postComentTagId}`).show();
        $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
    },

    _likeHandler() {
        actions.updateLike(this.props.data, this.props.data.id).subscribe(() => {
            const likeLinkTagId = `likeLink_${this.props.data.id}`;
            $(`#${likeLinkTagId}`).replaceWith("<span class='disabledLink'>Like</span>");

            const likes = this.state.likes + 1;
            const likedBy = this.state.likedBy;
            likedBy.push({ name: this.props.data.user, id: this.props.data.userId });

            this.setState({
                likes,
                likedBy,
            }, function () {
                const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
                const postComentTagId = `postComent_${this.props.data.id}`;
                $(`#${peopleLikeTagId}`).show();
                $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
            });
        });
    },

    _deleteHandler() {
        actions.deleteInterpretation(this.props.data, this.props.data.id)
			.subscribe(() => {
    this.props.deleteInterpretationSuccess(this.props.data.id);
		});
    },

    _showEditHandler() {
        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        $(`#${divEditText}`).show();
        $(`#${divShowText}`).hide();
    },

    _editInterpretationTextSuccess(text) {
        this.props.data.text = text;

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        $(`#${divEditText}`).hide();
        $(`#${divShowText}`).show();

        this.setState({ text });
    },

    _getCommentAreaClazz() {
        let commentAreaClazzNames = 'interpretationCommentArea';
        if (this.props.data.comments.length === 0 && this.state.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        return commentAreaClazzNames;
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
        const likeLinkTagId = `likeLink_${this.props.data.id}`;
        const interpretationTagId = `interpretation_${this.props.data.id}`;
        const peopleLikeTagId = `peopleLike_${this.props.data.id}`;

        const peopleLikedByDialogActions = [
            <FlatButton type="button"
                onClick={this._closePeopleLikedHandler}
                label="Cancel"
                primary
            />,
        ];

        return (
			<div id={interpretationTagId}>
				<div className="interpretationContainer" >

                    <div>
                        <div className="interpretationItem">
                            <div className="title">{this.props.data.name}</div>
                            <div id={this.props.data.id}></div>
                        </div>
                    </div>

                    <MessageOwner data={this.props.data} text={this.state.text} editInterpretationTextSuccess={this._editInterpretationTextSuccess} />

                    <div className="linkTag">
                        <a onClick={this._likeHandler} id={likeLinkTagId}>  Like </a> |
                        <a onClick={this._showCommentHandler}>  Comment </a>
                        <span className={this.props.currentUser.id === this.props.data.userId || this.props.currentUser.superUser ? '' : 'hidden'} >|
                        <a onClick={this._showEditHandler}>  Edit </a> |
                        <a onClick={this._deleteHandler}>  Delete </a>
                        </span>
                    </div>

                     <div className={this._getCommentAreaClazz()} >
                        <div id={peopleLikeTagId} className={this.state.likes > 0 ? '' : 'hidden'}>
                            <img src="./images/like.png" /> <a onClick={this._openPeopleLikedHandler}>{this.state.likes} people</a><span> liked this.</span>
                            <br />
                        </div>
                        <CommentArea comments={this.state.comments} likes={this.state.likes} interpretationId={this.props.data.id} likedBy={this.state.likedBy} currentUser={this.props.currentUser} />
                    
                        
                        <Dialog
                            title="People"
                            actions={peopleLikedByDialogActions}
                            modal="true"
                            open={this.state.open}
                            onRequestClose={this._closePeopleLikedHandler}
                        >
                            <div>
                                {this.state.likedBy.map(likedByUserName =>
                                    <p>{likedByUserName.name}</p>
                                )}
                            </div>
                        </Dialog>


                    </div>
                </div>
			</div>
		);
    },
});

export default Interpretation;
