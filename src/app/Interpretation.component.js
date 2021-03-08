import createReactClass from 'create-react-class'
import { getInstance as getD2 } from 'd2'
import $ from 'jquery'
import { Dialog, FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'
import React from 'react'
import actions from './actions/Interpretation.action'
import CommentArea from './CommentArea.component'
import { dataInfo } from './data'
import MessageOwner from './MessageOwner.component'
import { delayOnceTimeAction, restUtil, dhisUtils, otherUtils } from './utils'
import 'rc-tooltip/assets/bootstrap_white.css'

/* eslint-disable max-params */

const _dhisLoc = '../'

const Interpretation = createReactClass({
    propTypes: {
        currentUser: PropTypes.object,
        d2Api: PropTypes.object,
        data: PropTypes.object,
        deleteInterpretationSuccess: PropTypes.func,
    },

    getInitialState() {
        return {
            text: this.props.data.text,
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
            comments: this.props.data.comments,
            isTooltipActive: false,
        }
    },

    componentDidMount() {
        this._drawIntepretation()
    },

    _drawIntepretation(isRedraw) {
        delayOnceTimeAction.bind(
            1000,
            `resultInterpretation${this.props.data.id}`,
            () => {
                const divId = this.props.data.id

                if (this.props.data.type === 'REPORT_TABLE') {
                    this._setReportTable()
                } else if (this.props.data.type === 'MAP') {
                    if (isRedraw) {
                        $(`#${divId}`).html('Loading')
                    }
                    actions
                        .getMap('', this.props.data.map.id)
                        .subscribe(result => {
                            this._setMap(result)
                        })
                } else if (this.props.data.type === 'EVENT_REPORT') {
                    if (!isRedraw) {
                        this._setEventReport()
                    }
                } else if (this.props.data.type === 'EVENT_CHART') {
                    if (!isRedraw) {
                        this._setEventChart()
                    }
                }
            }
        )

        delayOnceTimeAction.bind(
            8000,
            `imgLoading${this.props.data.id}`,
            () => {
                const divId = this.props.data.id
                $(`#${divId}`).find('img.loadingImg').remove()
            }
        )
    },

    _setReportTable() {
        const divId = this.props.data.id

        $(`#${divId}`).closest('.interpretationItem ').addClass('contentTable')
        $(`#${divId}`).css('maxHeight', `${dataInfo.interpObjMaxHeight}px`)
    },

    _setEventReport() {
        getD2().then(d2 => {
            window.eventReportPlugin.url = restUtil.getUrlBase_Formatted(d2)
            window.eventReportPlugin.load([
                {
                    id: this.props.data.objId,
                    el: this.props.data.id,
                    relativePeriodDate: this.props.data.created,
                },
            ])
        })
    },

    _setEventChart() {
        getD2().then(d2 => {
            window.eventChartPlugin.url = restUtil.getUrlBase_Formatted(d2)
            window.eventChartPlugin.load([
                {
                    id: this.props.data.objId,
                    el: this.props.data.id,
                    relativePeriodDate: this.props.data.created,
                },
            ])
        })
    },

    detectRendered(divId, returnFunc) {
        const maxTimesRun = 15
        const intervalTime = 500
        let timesRun = 0

        const interval = setInterval(() => {
            timesRun++
            const panelTag = $(`#${divId}`).find('div.x-panel')

            if (timesRun >= maxTimesRun) {
                clearInterval(interval)
                returnFunc(false, panelTag)
            } else if (panelTag.length > 0) {
                clearInterval(interval)
                returnFunc(true, panelTag)
            }
        }, intervalTime)
    },

    relativePeriodKeys: [
        'THIS_MONTH',
        'LAST_MONTH',
        'monthsThisYear',
        'LAST_3_MONTHS',
        'LAST_6_MONTHS',
        'LAST_12_MONTHS',
        'THIS_YEAR',
        'LAST_YEAR',
        'LAST_5_YEARS',
    ],

    _setMap(data) {
        getD2().then(d2 => {
            const divId = this.props.data.id
            $(`#${divId}`).css('height', `${dataInfo.mapHeight}px`)
            window.mapPlugin.url = restUtil.getUrlBase_Formatted(d2)
            window.mapPlugin.load({
                id: data.id,
                el: divId,
                relativePeriodDate: this.props.data.created,
            })
        })
    },

    // Quarterly && 6-month period
    _converRelativePeriods(relativePeriodKey, createdDate) {
        let periods = []

        const created = createdDate.substring(0, 10).split('-')
        let month = Number(created[1])
        month = month - 1
        const day = Number(created[2])
        const date = new Date(created[0], month, day)

        const currentYear = date.getFullYear()

        // Yearly periods
        if (relativePeriodKey === 'THIS_YEAR') {
            periods.push({
                id: currentYear.toString(),
                name: currentYear.toString(),
            })
        } else if (relativePeriodKey === 'LAST_YEAR') {
            const lastYear = currentYear - 1
            periods.push({ id: lastYear.toString(), name: lastYear.toString() })
        } else if (relativePeriodKey === 'LAST_5_YEARS') {
            const start = currentYear - 5
            const end = currentYear - 1
            for (let year = start; year <= end; year++) {
                periods.push({ id: year.toString(), name: year.toString() })
            }
        } else if (relativePeriodKey === 'THIS_MONTH') {
            // Monthy periods
            let currentMonth = date.getMonth() + 1 // Month from Date Object starts from 0
            currentMonth = currentMonth > 10 ? currentMonth : `0${currentMonth}`
            const period = `${currentYear}${currentMonth}`
            periods.push({ id: period, name: period })
        } else if (relativePeriodKey === 'LAST_MONTH') {
            let currentMonth = date.getMonth() // Month from Date Object starts from 0
            currentMonth = currentMonth > 10 ? currentMonth : `0${currentMonth}`
            periods.push({
                id: `${currentYear}${currentMonth}`,
                name: `${currentYear}${currentMonth}`,
            })
        } else if (relativePeriodKey === 'monthsThisYear') {
            const currentMonth = date.getMonth() // Month from Date Object starts from 0
            for (let m = 1; m <= currentMonth; m++) {
                const k = m > 10 ? m : `0${m}`
                periods.push({ id: `${currentYear}${k}` })
            }
        } else if (relativePeriodKey === 'LAST_12_MONTHS') {
            periods = periods.concat(
                this._getLastNMonth(12, currentYear, date.getMonth())
            )
        } else if (relativePeriodKey === 'LAST_3_MONTHS') {
            periods = periods.concat(
                this._getLastNMonth(3, currentYear, date.getMonth())
            )
        } else if (relativePeriodKey === 'LAST_6_MONTHS') {
            periods = periods.concat(
                this._getLastNMonth(6, currentYear, date.getMonth())
            )
        }

        return periods
    },

    _quarterlyNames: ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'],

    _getLastNMonth(noNumber, year, month) {
        const currentYearPeriods = []

        let count = 0
        for (let m = month; m >= 1 && count < noNumber; m--) {
            const k = m >= 10 ? m : `0${m}`
            currentYearPeriods.push({ id: `${year}${k}`, name: `${year}${k}` })
            count++
        }

        const lastYearPeriods = []
        if (count < noNumber - 1) {
            const lastYear = year - 1
            for (let m = noNumber; m >= 1 && count < noNumber; m--) {
                const k = m >= 10 ? m : `0${m}`
                lastYearPeriods.push({
                    id: `${lastYear}${k}`,
                    name: `${lastYear}${k}`,
                })
                count++
            }
        }

        let periods = lastYearPeriods.reverse()
        periods = periods.concat(currentYearPeriods.reverse())

        return periods
    },

    _likeHandler() {
        actions
            .updateLike(this.props.data, this.props.data.id)
            .subscribe(() => {
                const likes = this.state.likes + 1
                const likedBy = this.state.likedBy
                likedBy.push({
                    name: this.props.currentUser.name,
                    id: this.props.currentUser.id,
                })

                this.setState(
                    {
                        likes,
                        likedBy,
                    },
                    function () {
                        const peopleLikeTagId = `peopleLike_${this.props.data.id}`
                        const postComentTagId = `postComent_${this.props.data.id}`
                        $(`#${peopleLikeTagId}`).show()
                        $(`#${postComentTagId}`)
                            .closest('.interpretationCommentArea')
                            .show()
                    }
                )
            })
    },

    _unlikeHandler() {
        actions
            .removeLike(this.props.data, this.props.data.id)
            .subscribe(() => {
                const likes = this.state.likes - 1
                const likedBy = this.state.likedBy
                otherUtils.removeFromList(
                    likedBy,
                    'id',
                    this.props.currentUser.id
                )

                this.setState(
                    {
                        likes,
                        likedBy,
                    },
                    function () {
                        if (likes === 0) {
                            const peopleLikeTagId = `peopleLike_${this.props.data.id}`
                            $(`#${peopleLikeTagId}`).hide()
                        }
                    }
                )
            })
    },

    _deleteHandler() {
        actions
            .deleteInterpretation(this.props.data, this.props.data.id)
            .subscribe(() => {
                this.props.deleteInterpretationSuccess(this.props.data.id)
            })
    },

    _starHandler() {
        this._switchMark(
            'star',
            'favorite',
            'marked.png',
            'unmarked.png',
            'Starred',
            'Not Starred'
        )
    },

    _subscribeHandler() {
        this._switchMark(
            'subscribe',
            'subscriber',
            'start_yes.png',
            'start_no.png',
            'Subscribed',
            'Not Subscribed'
        )
    },

    _getTopRightIconImgByType(typeStr) {
        const interpretationTagId = `interpretation_${this.props.data.id}`
        const interpDivTag = $('#' + interpretationTagId)

        return interpDivTag.find('img.' + typeStr)
    },

    _switchMark(
        typeStr,
        typeName,
        markImgSrcStr,
        unmarkImgSrcStr,
        markTitleStr,
        unmarkTitleStr
    ) {
        const dataType = dhisUtils.getMatchingApiObjTypeName(
            this.props.data.type
        )
        const queryUrl =
            _dhisLoc +
            'api/' +
            dataType +
            '/' +
            this.props.data.objId +
            '/' +
            typeName

        const imgTag = this._getTopRightIconImgByType(typeStr)
        // Do universal same sourceId icon change
        const imgTags_All = otherUtils.getSameSourceInterpIconTags(
            imgTag,
            typeStr,
            'srcObj_'
        )

        if (imgTag.hasClass('unmarked')) {
            restUtil.requestPostHelper(
                this.props.d2Api,
                queryUrl,
                '',
                () => {
                    imgTags_All.removeClass('unmarked')
                    imgTags_All.addClass('marked')
                    imgTags_All.attr('src', 'images/' + markImgSrcStr)
                    imgTags_All.attr('title', markTitleStr)
                },
                'application/json'
            )
        } else if (imgTag.hasClass('marked')) {
            restUtil.requestHelper(
                this.props.d2Api,
                queryUrl,
                '',
                () => {
                    imgTags_All.removeClass('marked')
                    imgTags_All.addClass('unmarked')
                    imgTags_All.attr('src', 'images/' + unmarkImgSrcStr)
                    imgTags_All.attr('title', unmarkTitleStr)
                },
                'DELETE',
                'application/json'
            )
        }
    },

    _showEditHandler() {
        const divEditText = `edit_${this.props.data.id}`
        const divShowText = `show_${this.props.data.id}`
        $(`#${divEditText}`).show()
        $(`#${divShowText}`).hide()
    },

    _editInterpretationTextSuccess(text) {
        this.props.data.text = text

        const divEditText = `edit_${this.props.data.id}`
        const divShowText = `show_${this.props.data.id}`
        $(`#${divEditText}`).hide()
        $(`#${divShowText}`).show()

        this.setState({ text })
    },

    _openPeopleLikedHandler() {
        this.setState({
            open: true,
        })
    },

    _closePeopleLikedHandler() {
        this.setState({
            open: false,
        })
    },

    _getPeopleLikeList() {
        const list = this.state.likedBy.slice(0, 10)
        return (
            <div>
                {list.map(likedByUserName => (
                    <span key={likedByUserName.id}>
                        {likedByUserName.name}
                        <br />
                    </span>
                ))}{' '}
                {this.state.likedBy.length > 10 ? <span>more...</span> : ''}
            </div>
        )
    },

    _getSourceInterpretationLink() {
        let link = ''
        let fullLink = ''
        if (this.props.data.type === 'REPORT_TABLE') {
            link = 'dhis-web-pivot'
        } else if (this.props.data.type === 'CHART') {
            fullLink = `${_dhisLoc}dhis-web-data-visualizer/index.html#/${this.props.data.objId}/interpretation/${this.props.data.id}`
        } else if (this.props.data.type === 'MAP') {
            fullLink = `${_dhisLoc}dhis-web-maps/index.html?id=${this.props.data.objId}&interpretationid=${this.props.data.id}`
        } else if (this.props.data.type === 'EVENT_REPORT') {
            link = 'dhis-web-event-reports'
        } else if (this.props.data.type === 'EVENT_CHART') {
            link = 'dhis-web-event-visualizer' // Event chart
        }

        return fullLink !== ''
            ? fullLink
            : link === ''
            ? ''
            : `${_dhisLoc}${link}/index.html?id=${this.props.data.objId}&interpretationId=${this.props.data.id}`
    },

    _exploreInterpretation() {
        window.location.href = this._getSourceInterpretationLink()
    },

    render() {
        const likeLinkTagId = `likeLink_${this.props.data.id}`
        const interpretationTagId = `interpretation_${this.props.data.id}`
        const peopleLikeTagId = `peopleLike_${this.props.data.id}`
        const peopleLikeLinkTagId = `peopleLikeLink_${this.props.data.id}`
        const commentAreaKey = `commentArea_${this.props.data.id}`
        const messageOwnerKey = `messageOwnerKey_${this.props.data.id}`
        const likeDialogKey = `likeDialogKey_${this.props.data.id}`
        const relativePeriodMsgId = `relativePeriodMsg_${this.props.data.id}`
        const sourceLink = this._getSourceInterpretationLink()

        const peopleLikedByDialogActions = [
            <FlatButton
                key="cancel"
                type="button"
                onClick={this._closePeopleLikedHandler}
                label="Cancel"
                primary
            />,
        ]

        return (
            <div
                id={interpretationTagId}
                key={interpretationTagId}
                className="interpretations"
            >
                <div className="interpretationContainer">
                    <div>
                        <div className="interpretationItem">
                            <div className="title">
                                <span>{this.props.data.name}</span>
                                <label className="linkArea">
                                    <span className="smallFont">|</span>
                                    <a
                                        href={sourceLink}
                                        className="userLink leftSpace smallFont"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Explore
                                    </a>
                                </label>
                                <div className="interpTopRightDiv">
                                    {this.props.data.objData ? (
                                        <div>
                                            <a
                                                onClick={this._subscribeHandler}
                                                className="topRightAnchors"
                                            >
                                                {otherUtils.findInArray(
                                                    this.props.data.objData
                                                        .subscribers,
                                                    this.props.currentUser.id
                                                ) >= 0
                                                    ? 'Subscribed'
                                                    : 'Not subscribed'}
                                            </a>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                            <div id={this.props.data.id}>Loading</div>
                        </div>
                    </div>

                    <div
                        id={relativePeriodMsgId}
                        className="relativePeriodWarming"
                    ></div>

                    <MessageOwner
                        key={messageOwnerKey}
                        data={this.props.data}
                        sourceLink={sourceLink}
                        text={this.state.text}
                        editInterpretationTextSuccess={
                            this._editInterpretationTextSuccess
                        }
                    />

                    <div className="linkTag">
                        {otherUtils.findItemFromList(
                            this.props.data.likedBy,
                            'id',
                            this.props.currentUser.id
                        ) === undefined ? (
                            <a onClick={this._likeHandler} id={likeLinkTagId}>
                                Like
                            </a>
                        ) : (
                            <a onClick={this._unlikeHandler} id={likeLinkTagId}>
                                Unlike
                            </a>
                        )}
                        <span
                            className={
                                this.props.currentUser.id ===
                                    this.props.data.userId ||
                                this.props.currentUser.superUser
                                    ? ''
                                    : 'hidden'
                            }
                        >
                            <label className="linkArea">·</label>
                            <a onClick={this._showEditHandler}>Edit</a>
                            <label className="linkArea">·</label>
                            <a onClick={this._deleteHandler}>Delete</a>
                        </span>
                    </div>

                    <div className="interpretationCommentArea">
                        <div
                            id={peopleLikeTagId}
                            className={
                                this.state.likes > 0
                                    ? 'greyBackground likeArea paddingLeft'
                                    : 'hidden greyBackground likeArea'
                            }
                        >
                            <Tooltip
                                placement="left"
                                overlay={this._getPeopleLikeList()}
                                arrowContent={
                                    <div className="rc-tooltip-arrow-inner"></div>
                                }
                            >
                                <a
                                    onClick={this._openPeopleLikedHandler}
                                    id={peopleLikeLinkTagId}
                                >
                                    {this.state.likes} people{' '}
                                </a>
                            </Tooltip>
                            <span> liked this</span>
                            <label className="linkArea">·</label>
                            <span>
                                {this.state.comments.length} people commented
                            </span>
                            <br />
                        </div>
                        <CommentArea
                            key={commentAreaKey}
                            comments={this.state.comments}
                            likes={this.state.likes}
                            interpretationId={this.props.data.id}
                            likedBy={this.state.likedBy}
                            currentUser={this.props.currentUser}
                        />

                        <Dialog
                            title="People"
                            actions={peopleLikedByDialogActions}
                            modal
                            open={this.state.open}
                            onRequestClose={this._closePeopleLikedHandler}
                        >
                            <div key={likeDialogKey}>
                                {this.state.likedBy.map(likedByUserName => (
                                    <p key={likedByUserName.id}>
                                        {likedByUserName.name}
                                    </p>
                                ))}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    },
})

export default Interpretation
