import React from 'react';
import log from 'loglevel';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import SearchBox from '../../src/app/SearchBox.component';
import InterpretationList from '../../src/app/InterpretationList.component';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default React.createClass({
    propTypes: {
        d2: React.PropTypes.object
		,value: React.PropTypes.string
    },

    childContextTypes: {
        d2: React.PropTypes.object
		,value: React.PropTypes.string
    },

    getChildContext() {
        return {
            d2: this.props.d2
			,value: ""
        };
    },


	getInitialState() {
        return {
            charts: []
			,value: ""
        };
    },

    _onSearchChange( keyword ) {
        //this.setState({ value: e.target.value });

		console.log( 'Parent _onSearchChange is called: ' + keyword );

		this.refs.lists.onSearchChanged( keyword );
    },

    render() {
		
        return (
            <div className="app-wrapper">
			
                <HeaderBar />
				
				<div className="search-list-items">
					<SearchBox
						onChangeEvent={this._onSearchChange}
						fullWidth
						hintText="Search by name"
						value={this.state.value}
					/>
				</div>
				 
				 <InterpretationList list={this.state.data} d2={this.props.d2} ref="lists" />
            </div>
        );
    },
});
