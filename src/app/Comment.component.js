
import React from 'react';
import {IntlProvider, FormattedRelative} from 'react-intl';

const Comment = React.createClass({
	
	getInitialState() {
		return {
            "user": ""
			,"created" : ""
			,"text": ""
        };
    },
	
	componentDidMount(){
		const data = this.props.data.split( "," );
		
		this.setState({
			 "user": data[0]
			,"created" : data[1]
			,"text": data[2]
		});
		
	},
	
    render(){  
		const created = this.state.created.substring( 0, 10 ).split( "-" );
		const time =  this.state.created.substring( 11,19 ).split( ":" );
		let date = new Date( created[0], created[1], created[2], time[0], time[1], time[2] );
		
		const userName = this.state.user.split( " " );
		let initChars = userName[0][0];
		if( userName.length > 1 )
		{
			initChars += userName[userName.length - 1][0];
		}
		
	    return (	  
			<table>
				<tr>
					<td><div className='badge'>{initChars}</div></td>
					<td>
						<div className='interpretationComment'>
							<a className="bold userLink">{this.state.user} </a>				
							<span className='interpretationText'>{this.state.text}</span>
							<br/>
							
							<span className="tipText">
								<IntlProvider>
									<FormattedRelative value={date} />
								</IntlProvider>								
							</span> 
							<span className={this.props.currentUser == this.state.currentUser ? '' : 'hidden'} >
								<a onClick={this.editHandler}> Edit</a> | 
								<a onClick={this.deleteHandler}>Delete</a>
							</span>		  
						</div>
					</td>
				</tr>
			</table>
			
		)
    }
  });
  
const CommentList = React.createClass({
	
	getInitialState() {
		return {
            "list" : []
        };
    },
	
	// componentDidMount: function() 
	componentDidMount()
	{		
		const comments = this.props.list.split( ";" );
				
		this.setState({
			 "list": comments
		});
	},
	
	render() {
		
		return (		
			<div>
				{this.state.list.map( data =>				
					<Comment key={data} data={data} currentUser={this.props.currentUser} /> 
				)}				
			</div>	
		)
	}
	
});


export default CommentList;

