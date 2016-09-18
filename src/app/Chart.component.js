
import React from 'react';
import MessageOwner from './MessageOwner.component';
import CommentList from './Comment.component';
import PostComment from './PostComment.component'; 

const Chart = React.createClass({
	
		
	componentDidMount() {
		const id = this.props.data.objId;
		const divId = this.props.data.id;
		
		if( this.props.data.type=='REPORT_TABLE' )
		{
			DHIS.getTable({
				url: '../../..'
				,el: divId
				,id: id
				,width: 600
				,height: 400
				,displayDensity: 'compact'
			});
			
			$( '#' + divId ).closest( '.interpretationItem ' ).addClass( "contentTable" );
		}
		else if( this.props.data.type=='CHART' )
		{
			DHIS.getChart({ 
				uid: id
				,el: divId
				,url: '../../..' 
				,width: 600
				,height: 400
			});
		}
		else
		{
			$( '#' + divId ).css( "width", "100%" );
			$( '#' + divId ).css( "height", "308px" );
			DHIS.getMap({
				url: '../../..'
				,el: divId
				,id: id
				,width: 600
				,height: 400
			});
		}
		
		
    },
  
	showCommentHandler(e)
	{
		const postComentTagId = 'postComent' + this.props.data.id;
		
		$( "#" + postComentTagId ).show();
		$( "#" + postComentTagId ).closest( ".interpretationCommentArea" ).show();
	},
	
	likeHandler()
	{
		
	},
	
    // render: function() {
	render(){ 
		
		let commentPart = "";
		if(this.props.data.comments.length > 0 ) 
		{
			commentPart = <CommentList list={this.props.data.comments} key={this.props.data.id} currentUser={this.props.data.user} />
		}
		
		let commentAreaClazzNames = "interpretationCommentArea";
		if( commentPart == "" )
		{
			commentAreaClazzNames += " hidden";
		}
		
		const postComentTagId = 'postComent' + this.props.data.id;
	    return (	  
			<div>          
				<div className="interpretationContainer" >
					
					<div>
						<div className="interpretationItem">
							<div className="title">{this.props.data.name}</div>
							<div id={this.props.data.id}></div>
						</div>
					</div>
					
					<MessageOwner data={this.props.data}/>
					
					<div className='linkTag'>
						<a onClick={this.likeHandler}>Like</a> | 
						<a onClick={this.showCommentHandler}>Comment</a>
						<span className={this.props.currentUser == this.props.data.user ? '' : 'hidden'} > | 
							<a onClick={this.editHandler}>Edit</a> | 
							<a onClick={this.deleteHandler}>Delete</a>
						</span>
					</div>					
					
					<div className={commentAreaClazzNames} >									
						<PostComment postCommentId={postComentTagId} currentUser={this.props.currentUser} />
						{commentPart}
					</div>		
				</div>
			</div>
		)
    }
});

  
const ChartList = React.createClass({
  render() {
    return (
        <div>
          {this.props.list.map( data =>
		  
            <Chart key={data.id} data={data} currentUser={this.props.currentUser} /> 
          )}
        </div>		
    )
  }
});


export default ChartList;