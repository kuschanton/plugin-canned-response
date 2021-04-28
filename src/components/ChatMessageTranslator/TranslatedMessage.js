import * as React from "react";
import styled from '@emotion/styled'

import { TranslateHelper } from "./TranslateHelper";

const TranslatedContainer = styled("div")`
  background-color: #f00;
  color: #fff;
`;

export class TranslatedMessage extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      sourceLanguage: "",
      translation: null
    };
  }

  async translateMessage(message, lang) {
    const { body } = message.source;



    if (lang === "") {

      // TODO if message.isFromMe, we store origText instead and display that
      this.setState({ translation: null });
    } else {
      try {
        const resp = await TranslateHelper.getTranslation(this.props.runtimeDomain, body, lang);
        if (this.props.targetLanguage() === resp.sourceLanguage) {
          this.setState({
            sourceLanguage: resp.sourceLanguage,
            translation: null
          });
        } else {
          this.setState({
            sourceLanguage: resp.sourceLanguage,
            translation: resp.translatedText
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  getSourceLanguage() {
    return this.state.sourceLanguage;
  }

  componentDidMount() {
    if (!this.state.translation) {
      this.translateMessage(this.props.message, this.props.targetLanguage());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.message.source.body !== prevProps.message.source.body) {
      this.translateMessage(this.props.message, this.props.targetLanguage());
    }
  }

  componentWillUnmount() {
    this.props.onUnmount(this);
  }

  async changeTargetLanguage(lang) {
   // console.log('LANGUAGE CHANGED!!!')
    this.translateMessage(this.props.message, lang);
  }

  isoCountryCodeToFlag(code) {
    return code
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
  }
  //
  // flagToCountryCode(flagEmoji){
  //   flagEmoji.replace(/../g, cp => String.fromCharCode(cp.codePointAt(0)-127397) );
  // }

  render() {
   // console.log(' FORCED RENDERING')
    if (!this.state.translation || this.props.message.isFromMe) {
      return null;
    } else {
    //  const background = this.props.message.isFromMe ? "blue" : "red";
      //const emojiFlag = this.isoCountryCodeToFlag(this.state.targetLanguage);
      // backgroundColor: 'rgb(5, 125, 158)'
      return (
        <TranslatedContainer style={{ backgroundColor: '#dd0d14', padding: '3px', borderRadius: '3px' }}>
          <span>
            <b>[{this.state.sourceLanguage} {'=>'} {this.props.targetLanguage()}]</b>:
            {this.state.translation}
          </span>
        </TranslatedContainer>
      );
    }
  }
}