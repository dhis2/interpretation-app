import React from 'react';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import SearchBox from './SearchBox.component';
import InterpretationList from './InterpretationList.component';
import TopRankItems from './TopRankItems.component';
import AppVersionInfo from './AppVersionInfo.component';

import { dataInfo } from './data';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// If this is being rendered in a subframe, hide the header bar
const shouldRenderHeaderBar = window.self === window.top
// todo: remove
console.log({ shouldRenderHeaderBar })

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
            currentUser: { name: this.props.d2.currentUser.displayName, id: this.props.d2.currentUser.id, superUser: this.isSuperUser() },
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
            value: '',
        };
    },

    isSuperUser() {
        return this.props.d2.currentUser.authorities.has('ALL');
    },

    _onSearchChange(searchTerm) {
        this.refs.lists.onSearchChanged(searchTerm);
    },

    _onTopRankItemClicked(searchTerm) {
        this.refs.lists.onSearchChanged(searchTerm);
    },

    render() {
        const rightAreaWidth = `${dataInfo.rightAreaWidth}px`;
        return (
            // 'app-wrapper' apps margin-top styles; skip those if no header bar
            <div className={shouldRenderHeaderBar ? "app-wrapper" : undefined}>

                {shouldRenderHeaderBar && <HeaderBar />}
				<mainPage>

                    <div className="divMainPage">

                        <table className="tblMainPage">
                        <tbody>
                        <tr>
                        <td>
                            <div className="divMainArea">
                                <div className="divSearchArea">
                                    <SearchBox
                                        onChangeEvent={this._onSearchChange}
                                        hintText="Search by name"
                                        value={this.state.value}
                                    />
                                </div>

                                <InterpretationList d2={this.props.d2} ref="lists" />
                            </div>
                        </td>
                        <td>
                            <div className="divRightArea" style={{ width: rightAreaWidth }}>
                                <div style={{ minHeight: '500px' }}>
                                    <TopRankItems currentUser={this.state.currentUser} onTopRankItemClicked={this._onTopRankItemClicked} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <AppVersionInfo linkSrc="https://docs.google.com/document/d/12ob_Ptufu8d7RMq1XJvcYNdWpCx23Zk9kxJx2VijjCk" />
                                </div>
                            </div>
                        </td>
                        </tr>
                        </tbody>
                        </table>
                    </div>
				</mainPage>
			</div>
        );
    },
});
