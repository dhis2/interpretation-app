
import React from 'react';
import { IntlProvider, FormattedDate } from 'react-intl';

import actions from './actions/Interpretation.action';

const MessageOwner = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        text: React.PropTypes.string,
        editInterpretationTextSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return this.setValues(this.props.data.text, this.props.data.text);
    },

    setValues(content, oldText) {
        const maxWords = 50;
        let hiddenContent = '';
        const noWords = content.split(/\s+/).length;
        if (noWords >= maxWords) {
            hiddenContent = this.getWords(content, maxWords, noWords);
        }

        return {
            text: content,
            showContent: this.getWords(content, 0, maxWords),
            hiddenContent,
            oldText,
        };
    },

    getWords(str, start, end) {
        return str.split(/\s+/).slice(start, end).join(' ');
    },

    _onChange(e) {
        this.setState(this.setValues(e.target.value, this.state.oldText));
    },

    handleClick(e) {
        const linkTag = $(e.target);
        linkTag.closest('.interpretationText').find('.hiddenContent').show();
        linkTag.hide();
    },

    _editInterpretationText() {
        const text = this.state.text;
        actions.editInterpretation(this.props.data, this.props.data.id, text)
			.subscribe(() => {
    this.setState(this.setValues(this.state.text, this.state.text));
    this.props.editInterpretationTextSuccess(text);
		});
    },

    _cancelInterpretationText(){
        this.setState(this.setValues(this.state.oldText, this.state.oldText));

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;

        $(`#${divEditText}`).hide();
        $(`#${divShowText}`).show();
    },

    render() {
        const created = this.props.data.created.substring(0, 10).split('-');
        let date = new Date(created[0], created[1], created[2]);

        let clazzName = 'moreLink';
        if (this.state.hiddenContent.length === 0) {
            clazzName += ' hidden';
        }

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        return (

			<div className="interpretationName">
				<div className="interpretationUser">
					<a className="bold userLink">{this.props.data.user} </a>
					<span className="tipText">
					<IntlProvider>
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
					<div id={divShowText} >
                        {this.state.showContent}
                        <span className={clazzName} onClick={this.handleClick}> ... more</span>
                        <span className="hiddenContent hidden">{this.state.hiddenContent}</span>
                    </div>
                    <div id={divEditText} className="hidden" >
                        <textarea className="commentArea" value={this.state.text} onChange={this._onChange} />
                        <br />
                        <a onClick={this._editInterpretationText}>  OK </a> | <a onClick={this._cancelInterpretationText}>  Cancel</a>
                    </div>
				</div>

			</div>
			);
    },
});

export default MessageOwner;
