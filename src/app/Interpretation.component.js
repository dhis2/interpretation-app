
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import MessageOwner from './MessageOwner.component';
import CommentArea from './CommentArea.component';
import { getInstance as getD2 } from 'd2/lib/d2';
import { delayOnceTimeAction } from './utils';
import { dataInfo } from './data';
import { otherUtils } from './utils';

import actions from './actions/Interpretation.action';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

const Interpretation = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        deleteInterpretationSuccess: React.PropTypes.func,
        aggChartList: React.PropTypes.array,
    },

    getInitialState() {
        return {
            text: this.props.data.text,
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
            comments: this.props.data.comments.reverse(),
            isTooltipActive: false,
        };
    },


    componentDidMount() {
        window.addEventListener('resize', this._handleWindowResize);
        this._drawIntepretation();
    },


    componentWillUnmount() {
        window.removeEventListener('resize', this._handleWindowResize);
    },

    _handleWindowResize() {
        // If browser window width is less than 900, do not request for redraw
        if ($('.intpreContents').width() < 650) {
            $('.intpreContents').width(650);
        }
        else {
            $('.intpreContents').width(dataInfo.getleftAreaWidth());
        }

        this._drawIntepretation(true);
    },


    _drawIntepretation(isRedraw) {
        delayOnceTimeAction.bind(1000, `resultInterpretation${this.props.data.id}`, () => {
            const divId = this.props.data.id;

            if (this.props.data.type === 'REPORT_TABLE') {
                this._setReportTable();
            } else if (this.props.data.type === 'MAP') {
                if (isRedraw) {
                    $(`#${divId}`).html('<img className="loadingImg" src="images/ajax-loader-circle.gif" />');
                }
                actions.getMap('', this.props.data.map.id).subscribe(result => {
                    this._setMap(result);
                });
            } else if (this.props.data.type === 'EVENT_REPORT') {
                if (!isRedraw) {
                    this._setEventReport();
                }
            } else if (this.props.data.type === 'EVENT_CHART') {
                if (!isRedraw) {
                    this._setEventChart();
                }
            }
        });

        delayOnceTimeAction.bind(5000, `imgLoading${this.props.data.id}`, () => {
            const divId = this.props.data.id;
            $(`#${divId}`).find('img.loadingImg').remove();
        });
    },

    _setReportTable() {
        const width = dataInfo.getleftAreaWidth();
        const divId = this.props.data.id;

        $(`#${divId}`).closest('.interpretationItem ').addClass('contentTable');
        $(`#${divId}`).css('width', width).css('maxHeight', '600px');
    },

    _setEventReport() {
        const width = dataInfo.getleftAreaWidth();
        const id = this.props.data.objId;
        const divId = this.props.data.id;


        $(`#${divId}`).closest('.interpretationItem ').addClass('contentTable');
        $(`#${divId}`).css('width', width).css('maxHeight', '600px');

        // Report Table do not need to redraw when browser window side changes
        getD2().then(d2 => {
            const options = {};
            options.el = divId;
            options.id = id;
            options.url = d2.Api.getApi().baseUrl.replace('api', '');
            options.width = width;
            options.height = 400;
            options.displayDensity = 'compact';
            options.fontSize = 'small';
            options.relativePeriodDate = this.props.data.created;

            DHIS.getEventReport(options);
        });
    },

    _setEventChart() {
        const id = this.props.data.objId;
        const divId = this.props.data.id;
        const width = dataInfo.getleftAreaWidth();

        getD2().then(d2 => {
            const options = {};
            options.uid = id;
            options.el = divId;
            options.id = id;
            options.url = d2.Api.getApi().baseUrl.replace('api', '');
            options.width = width;
            options.height = 400;
            options.relativePeriodDate = this.props.data.created;

            options.domainAxisStyle = {
                labelRotation: 45,
                labelFont: '10px sans-serif',
                labelColor: '#111',
            };

            options.rangeAxisStyle = {
                labelFont: '9px sans-serif',
            };

            options.legendStyle = {
                labelFont: 'normal 10px sans-serif',
                labelColor: '#222',
                labelMarkerSize: 10,
                titleFont: 'bold 12px sans-serif',
                titleColor: '#333',
            };

            options.seriesStyle = {
                labelColor: '#333',
                labelFont: '9px sans-serif',
            };

            DHIS.getEventChart(options);
        });
    },

    relativePeriodKeys: [
        'THIS_MONTH',
        'LAST_MONTH',
        'LAST_3_MONTHS',
        'LAST_6_MONTHS',
        'LAST_12_MONTHS',
        'THIS_YEAR',
        'LAST_YEAR',
        'LAST_5_YEARS',
    ],

    _setMap(data) {
        const me = this;
        getD2().then(d2 => {
            const width = dataInfo.getleftAreaWidth();
            const divId = this.props.data.id;
            const createdDate = this.props.data.created;

            $(`#${divId}`).css('height', '308px');

            const options = {};

            options.el = divId;
            options.url = d2.Api.getApi().baseUrl.replace('api', '');
            options.width = width;
            options.height = 400;

            options.mapViews = data.mapViews;

            for (let i = 0; i < data.mapViews.length; i++) {
                const mapView = data.mapViews[i];
               // mapView.relativePeriodDate = createdDate.substring(0, 10);
                if (otherUtils.findItemFromList(mapView.filters, 'dimension', 'pe') !== undefined) {
                    let relativePeriods = [];
                    for (let j = 0; j < mapView.filters.length; j++) {
                        const items = mapView.filters[j].items;
                        for (let k = 0; k < items.length; k++) {
                            if (this.relativePeriodKeys.indexOf(items[k].id) >= 0) {
                                relativePeriods = relativePeriods.concat(me._converRelativePeriods(items[k].id, createdDate));
                            }
                        }
                        if (relativePeriods.length > 0) {
                            options.mapViews[i].filters[j].items = relativePeriods;
                        }
                    }
                }
            }

            DHIS.getMap(options);
        });
    },

    _convertToNumber(n) {
        return (n.startsWith('0')) ? eval(n[1]) : eval(n);
    },

    // Quaterly && 6-month period
    _converRelativePeriods(relativePeriodKey, createdDate) {
        let periods = [];

        const created = createdDate.substring(0, 10).split('-');
        let month = this._convertToNumber(created[1]);
        month = month - 1;
        const day = this._convertToNumber(created[2]);
        const date = new Date(created[0], month, day);

        const currentYear = date.getFullYear();

        // Yearly periods
        if (relativePeriodKey === 'THIS_YEAR') {
            periods.push({ id: currentYear.toString(), name: currentYear.toString() });
        } else if (relativePeriodKey === 'LAST_YEAR') {
            const lastYear = currentYear - 1;
            periods.push({ id: lastYear.toString(), name: lastYear.toString() });
        } else if (relativePeriodKey === 'LAST_5_YEARS') {
            const start = currentYear - 5;
            const end = currentYear - 1;
            for (let year = start; year >= end; year++) {
                periods.push({ id: year.toString(), name: year.toString() });
            }
        } else if (relativePeriodKey === 'THIS_MONTH') { // Monthy periods
            let currentMonth = date.getMonth() + 1;// Month from Date Object starts from 0
            currentMonth = (currentMonth > 10) ? currentMonth : `0${currentMonth}`;
            const period = `${currentYear}${currentMonth}`;
            periods.push({ id: period, name: period });
        } else if (relativePeriodKey === 'LAST_MONTH') {
            let currentMonth = date.getMonth();// Month from Date Object starts from 0
            currentMonth = (currentMonth > 10) ? currentMonth : `0${currentMonth}`;
            periods.push({ id: `${currentYear}${currentMonth}`, name: `${currentYear}${currentMonth}` });
        } else if (relativePeriodKey === 'monthsThisYear') {
            const currentMonth = date.getMonth();// Month from Date Object starts from 0
            for (let m = 1; m <= currentMonth; m++) {
                const k = (m > 10) ? m : `0${m}`;
                periods.push({ id: `${currentYear}${k}` });
            }
        } else if (relativePeriodKey === 'LAST_12_MONTHS') {
            periods = periods.concat(this._getLastNMonth(12, currentYear, date.getMonth()));
        } else if (relativePeriodKey === 'LAST_3_MONTHS') {
            periods = periods.concat(this._getLastNMonth(3, currentYear, date.getMonth()));
        } else if (relativePeriodKey === 'LAST_6_MONTHS') {
            periods = periods.concat(this._getLastNMonth(6, currentYear, date.getMonth()));
        }

        return periods;
    },

    _quarterlyNames: ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'],

    _getLastNMonth(noNumber, year, month) {
        const currentYearPeriods = [];

        let count = 0;
        for (let m = month; m >= 1 && count < noNumber; m--) {
            const k = (m >= 10) ? m : `0${m}`;
            currentYearPeriods.push({ id: `${year}${k}`, name: `${year}${k}` });
            count++;
        }

        const lastYearPeriods = [];
        if (count < noNumber - 1) {
            const lastYear = year - 1;
            for (let m = noNumber; m >= 1 && count < noNumber; m--) {
                const k = (m >= 10) ? m : `0${m}`;
                lastYearPeriods.push({ id: `${lastYear}${k}`, name: `${lastYear}${k}` });
                count++;
            }
        }

        let periods = lastYearPeriods.reverse();
        periods = periods.concat(currentYearPeriods.reverse());

        return periods;
    },

    _likeHandler() {
        actions.updateLike(this.props.data, this.props.data.id).subscribe(() => {
            const likes = this.state.likes + 1;
            const likedBy = this.state.likedBy;
            likedBy.push({ name: this.props.currentUser.name, id: this.props.currentUser.id });

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

    _unlikeHandler() {
        actions.removeLike(this.props.data, this.props.data.id).subscribe(() => {
            const likes = this.state.likes - 1;
            const likedBy = this.state.likedBy;
            otherUtils.removeFromList(likedBy, 'id', this.props.currentUser.id);

            this.setState({
                likes,
                likedBy,
            }, function () {
                if (likes === 0) {
                    const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
                    $(`#${peopleLikeTagId}`).hide();
                }
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

    _getPeopleLikeList() {
        const list = this.state.likedBy.slice(0, 10);
        return <div>{list.map(likedByUserName => <span key={likedByUserName.id}>{likedByUserName.name}<br /></span>)} {this.state.likedBy.length > 10 ? <span>more...</span> : '' }</div>;
    },

    _exploreInterpretation() {
        let link = '';
        if (this.props.data.type === 'REPORT_TABLE') {
            link = 'dhis-web-pivot';
        } else if (this.props.data.type === 'CHART') {
            link = 'dhis-web-visualizer';
        } else if (this.props.data.type === 'MAP') {
            link = 'dhis-web-mapping';
        } else if (this.props.data.type === 'EVENT_REPORT') {
            link = 'dhis-web-event-reports';
        } else {
            link = 'dhis-web-event-visualizer'; // Event chart
        }

        window.location.href = `../../../${link}/index.html?id=${this.props.data.objId}`;
    },

    render() {
        const likeLinkTagId = `likeLink_${this.props.data.id}`;
        const interpretationTagId = `interpretation_${this.props.data.id}`;
        const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
        const peopleLikeLinkTagId = `peopleLikeLink_${this.props.data.id}`;
        const commentAreaKey = `commentArea_${this.props.data.id}`;
        const messageOwnerKey = `messageOwnerKey_${this.props.data.id}`;
        const likeDialogKey = `likeDialogKey_${this.props.data.id}`;

        const peopleLikedByDialogActions = [
            <FlatButton type="button"
                onClick={this._closePeopleLikedHandler}
                label="Cancel"
                primary
            />,
        ];

        return (
			<div id={interpretationTagId} key={interpretationTagId}>
				<div className="interpretationContainer" >

                    <div>
                        <div className="interpretationItem">
                            <div className="title"><span>{this.props.data.name}</span> <label className="linkArea"> <span className="smallFont">|</span> <a onClick={this._exploreInterpretation} className="smallFont" target="_blank">Explore</a></label></div>
                            <div id={this.props.data.id} className="center"><img className="loadingImg" src="images/ajax-loader-circle.gif" /></div>
                        </div>
                    </div>

                    <MessageOwner key={messageOwnerKey} data={this.props.data} text={this.state.text} editInterpretationTextSuccess={this._editInterpretationTextSuccess} />

                    <div className="linkTag">
                        {otherUtils.findItemFromList(this.props.data.likedBy, 'id', this.props.currentUser.id) === undefined ? <a onClick={this._likeHandler} id={likeLinkTagId}>Like</a> : <a onClick={this._unlikeHandler} id={likeLinkTagId}>Unlike</a> } 
                        <span className={this.props.currentUser.id === this.props.data.userId || this.props.currentUser.superUser ? '' : 'hidden'} >
                        <label className="linkArea">·</label><a onClick={this._showEditHandler}>Edit</a>
                        <label className="linkArea">·</label><a onClick={this._deleteHandler}>Delete</a>
                        </span>
                    </div>

                     <div className="interpretationCommentArea">
                        <div id={peopleLikeTagId} className={this.state.likes > 0 ? 'greyBackground likeArea paddingLeft' : 'hidden greyBackground likeArea'}>
                            <img src="images/like.png" className="verticalAlignTop" />
                            <Tooltip
                                placement="left"
                                overlay={this._getPeopleLikeList()}
                                arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                            >
                                    <a onClick={this._openPeopleLikedHandler} id={peopleLikeLinkTagId}>{this.state.likes} people </a>
                            </Tooltip>
                            <span> liked this</span><label className="linkArea">·</label><span>{this.state.comments.length} people commented</span>
                            <br />
                        </div>
                        <CommentArea key={commentAreaKey} comments={this.state.comments} likes={this.state.likes} interpretationId={this.props.data.id} likedBy={this.state.likedBy} currentUser={this.props.currentUser} />


                        <Dialog
                            title="People"
                            actions={peopleLikedByDialogActions}
                            modal
                            open={this.state.open}
                            onRequestClose={this._closePeopleLikedHandler}
                        >
                            <div key={likeDialogKey}>
                                {this.state.likedBy.map(likedByUserName =>
                                    <p key={likedByUserName.id}>{likedByUserName.name}</p>
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
