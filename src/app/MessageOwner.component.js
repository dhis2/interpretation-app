import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import createReactClass from 'create-react-class'
import $ from 'jquery'
import PropTypes from 'prop-types'
import React from 'react'
import { IntlProvider, FormattedDate } from 'react-intl'
import actions from './actions/Interpretation.action'

const MessageOwner = createReactClass({
    propTypes: {
        data: PropTypes.object,
        editInterpretationTextSuccess: PropTypes.func,
        sourceLink: PropTypes.string,
        text: PropTypes.string,
    },

    getInitialState() {
        return this.setValues(this.props.data.text, this.props.data.text)
    },

    setValues(content, oldText) {
        const maxWords = 50
        let hiddenContent = ''
        const noWords = content.split(/\s+/).length
        if (noWords >= maxWords) {
            hiddenContent = this.getWords(content, maxWords, noWords)
        }

        return {
            text: content,
            showContent: this.getWords(content, 0, maxWords),
            hiddenContent,
            oldText,
        }
    },

    getWords(str, start, end) {
        return str.split(/\s+/).slice(start, end).join(' ')
    },

    _getTagId() {
        return {
            divEditText: `edit_${this.props.data.id}`,
            divShowText: `show_${this.props.data.id}`,
            divShowTag: `showHtmlText_${this.props.data.id}`,
            divHideTag: `hideHtmlText_${this.props.data.id}`,
        }
    },

    _onChange(e) {
        this.setState(this.setValues(e.target.value, this.state.oldText))
    },

    handleClick(e) {
        const linkTag = $(e.target)
        linkTag.closest('.interpretationText').find('.hiddenContent').show()
        linkTag.hide()
    },

    _editInterpretationText() {
        const text = this.state.text
        actions
            .editInterpretation(this.props.data, this.props.data.id, text)
            .subscribe(() => {
                this.setState(this.setValues(this.state.text, this.state.text))
                this.props.editInterpretationTextSuccess(text)
            })
    },

    _cancelInterpretationText() {
        this.setState(this.setValues(this.state.oldText, this.state.oldText))

        $(`#${this._getTagId().divEditText}`).hide()
        $(`#${this._getTagId().divShowText}`).show()
    },

    _convertToNumber(n) {
        return n.startsWith('0') ? eval(n[1]) : eval(n)
    },

    render() {
        const created = this.props.data.created.substring(0, 10).split('-')

        let month = this._convertToNumber(created[1])
        month = month - 1
        const day = this._convertToNumber(created[2])
        const date = new Date(created[0], month, day)

        let clazzName = 'moreLink'
        if (this.state.hiddenContent.length === 0) {
            clazzName += ' hidden'
        }

        return (
            <div className="interpretationDescSection">
                <div className="interpretationName">
                    <a
                        href={this.props.sourceLink}
                        className="bold userLink"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {this.props.data.user}
                    </a>
                    <span className="tipText leftSpace">
                        <IntlProvider locale="en">
                            <FormattedDate
                                value={date}
                                day="2-digit"
                                month="short"
                                year="numeric"
                            />
                        </IntlProvider>
                    </span>
                </div>
                <div className="interpretationText">
                    <div id={this._getTagId().divShowText}>
                        <span id={this._getTagId().divShowTag}>
                            <RichTextParser>
                                {this.state.showContent}
                            </RichTextParser>
                        </span>
                        <span className={clazzName} onClick={this.handleClick}>
                            {' '}
                            ... more
                        </span>
                        <span
                            id={this._getTagId().divHideTag}
                            className="hiddenContent hidden"
                        >
                            <RichTextParser>
                                {this.state.hiddenContent}
                            </RichTextParser>
                        </span>
                    </div>
                    <div id={this._getTagId().divEditText} className="hidden">
                        <textarea
                            className="commentArea"
                            value={this.state.text}
                            onChange={this._onChange}
                        />
                        <br />
                        <a onClick={this._editInterpretationText}>
                            {' '}
                            OK{' '}
                        </a> |{' '}
                        <a onClick={this._cancelInterpretationText}> Cancel</a>
                    </div>
                </div>
            </div>
        )
    },
})

export default MessageOwner
