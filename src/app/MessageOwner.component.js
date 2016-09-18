
import React from 'react';
import en from 'react-intl/locale-data/en';
import {IntlProvider, FormattedDate} from 'react-intl';


const MessageOwner = React.createClass({
	
	handleClick(e) {
		const linkTag = $( e.target );
		linkTag.closest( ".interpretationText" ).find( ".moreContent").show();
		linkTag.hide();
	},
	
	getWords(str, start, end){
		return str.split(/\s+/).slice(start,end).join(" ");
	},

    // render: function() {
	render(){ 
		
		const maxWords = 50;
		const content = this.props.data.text;
		const firstContent = this.getWords( content, 0, maxWords );
		let moreContent = "";
		const noWords = content.split(/\s+/).length;
		if( noWords >= maxWords )
		{
			moreContent = this.getWords( content, maxWords, noWords );
		}
		
		const created = this.props.data.created.substring( 0, 10 ).split( "-" );
		let date = new Date( created[0], created[1], created[2] );
		
		let clazzName = "moreLink";
		if( moreContent.length == 0 )
		{
			clazzName += " hidden";
		}
		
	    return (	  
				
			<div className="interpretationName">
				<div className="interpretationUser">
					<a className="bold userLink">{this.props.data.user} </a> 
					<span className="tipText">
						<IntlProvider>
							<FormattedDate
							  value={date}
							  day='2-digit'
							  month='short'
							  year='numeric'
							/>
						</IntlProvider>
					</span>
				</div>
				
				<div className="interpretationText">
					{firstContent} 
					<span className={clazzName} onClick={this.handleClick}> ... more</span>
					<span className="moreContent hidden">{moreContent}</span>
				</div>
			
			</div>
		)
    }
});

export default MessageOwner;
