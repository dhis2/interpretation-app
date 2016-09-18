
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
	},
	
    // render: function() {
	render(){ 
		
		let commentPart = "";
		if(this.props.data.comments.length > 0 ) 
		{
			commentPart = <CommentList list={this.props.data.comments} key={this.props.data.id}/>
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
						<br/>
					</div>
					
					<MessageOwner data={this.props.data}/>
					
					<div><a onClick={this.showCommentHandler}>Comment</a></div>
					
					
					<div className="interpretationCommentArea">									
						<PostComment id={postComentTagId} className='hidden' />
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
		  
            <Chart key={data.id} data={data} /> 
          )}
        </div>		
    )
  }
});


export default ChartList;