import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ChartList from '../../src/app/Chart.component';

const InterpretationList = React.createClass({
	
	searchKey: '',

	propTypes: {
        d2: React.PropTypes.object
    },
	
	childContextTypes: {
        d2: React.PropTypes.object
    },

    getChildContext() {
        return {
            d2: this.props.d2
        };
    },
	
	getInitialState() {
		return {
			hasMore: true
			,items: []
		};
	},
  
	loadMore( page, searchKey )
	{
		const me = this;
		const d2 = this.props.d2;
		const d2Api = d2.Api.getApi();

		let url = 'interpretations?fields=id,type,text,created,user[name],comments[id,created,text,user[name]],chart[id,name],map[id,name],reportTable[id,name]&page=' + page + '&pageSize=100';
		
		if ( this.searchKey !== undefined && this.searchKey != '' )
		{
			url += '&filter=text:ilike:' + this.searchKey;
		}
	

		d2Api.get( url ).then( result =>
		{			
			const dataList = this.getFormattedData( result.interpretations, d2Api.baseUrl );
		
			const hasMore = ( result.pager.page < result.pager.pageCount );
			const resultPage = result.pager.page;
			
			setTimeout(function () {

				this.setState({
					"items": this.state.items.concat( [me.createDiv( dataList, resultPage ) ] )
					,"hasMore" : hasMore
				});

			}.bind(this), 1000);
			
			return Promise.resolve();
		})
		.catch(error => {
			return Promise.resolve();
		});
	},
	

	getFormattedData( itemList, baseUrl )
	{	
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
		let dataList = [];

		for ( let i = 0; i < itemList.length; i++ )
		{
			var interpretation = itemList[i];
							
			let data = {};
			data = interpretation;	

			data.user = interpretation.user.name;


			// Comments information			
			var comments = "";
			for ( let j = 0; j < interpretation.comments.length; j++ )
			{
				var cm = interpretation.comments[ j ];
				comments += cm.user.name + "," + cm.created + "," + cm.text + ";";
			}
			
			if( comments.length > 0 )
			{						
				comments = comments.substring( 0 ,comments.length - 1 );
			}
			
			data.comments = comments;							

			if( interpretation.type == 'CHART' )
			{
				data.objId = interpretation.chart.id;
				data.name = interpretation.chart.name;
			}
			else if( interpretation.type == 'MAP' )
			{
				data.objId = interpretation.map.id;
				data.name = interpretation.map.name;
			}
			else
			{
				data.objId = interpretation.reportTable.id;
				data.name = interpretation.reportTable.name;
			}

			dataList.push( data );
		}
				
		return dataList;
	},
	

	createDiv( dataList, page ) 
	{
		console.log('page : ' + page);	
	
		return (
			<ChartList key={page} list={dataList} />
	    );
			
	},

	onSearchChanged( keyword )
	{
		// reset the list item
		this.state.items = [];

		// set the keyword on memory
		this.searchKey = keyword;
		
		this.loadMore( 1 );

		console.log( 'Search Performed: ' + keyword );
	},

  render: function () {
   
    return (
		<div>
			<InfiniteScroll loader={<div><img src="images/ajaxLoaderBar.gif" /></div>} loadMore={this.loadMore} hasMore={this.state.hasMore} useWindow={true}>
			 {this.state.items}
			</InfiniteScroll> 
		</div>
	);
}
});

export default InterpretationList;