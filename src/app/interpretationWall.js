import React from 'react';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import { LeftNav } from 'material-ui';

import SearchBox from './SearchBox.component';
import InterpretationList from './InterpretationList.component';


const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
        value: React.PropTypes.string,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
        value: React.PropTypes.string,
    },

    getInitialState() {
        return {
            charts: [],
            value: '',
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
            value: '',
        };
    },

    _onSearchChange(searchTerm) {
        this.refs.lists.onSearchChanged(searchTerm);
    },

    render() {
        return (
            <div className="app-wrapper">

                <HeaderBar />
				<mainPage>
					<div>
						<SearchBox
    onChangeEvent={this._onSearchChange}
    hintText="Search by name"
    value={this.state.value}
						/>
					</div>

					<InterpretationList d2={this.props.d2} ref="lists" />
				</mainPage>
			</div>
        );
    },
});
