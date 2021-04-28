import * as React from "react";
import { TranslateHelper } from "./TranslateHelper";

export class LanguageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      sourceLanguage: "",
      targetLanguage: ""
    };
  }

  async componentDidMount() {
    let supported = await TranslateHelper.getSupportedLanguages(
      this.props.runtimeDomain,
      this.state.selectedLanguage
    );
    supported.push({ value: "", name: "-- INACTIVE --" });
    this.setState({ languages: supported });
  }

  changeTargetLanguage = event => {
    this.setState({ targetLanguage: event.target.value });
    this.props.updateTargetLanguage(event.target.value);
  };

  changeSourceLanguage = event => {
    this.setState({ sourceLanguage: event.target.value });
    this.props.updateSourceLanguage(event.target.value);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0.5rem"
        }}
      >
        <div style={{ flexDirection: "column" }}>
          <label htmlFor="target-lang">Translate to: </label>
          <select
            id="target-lang"
            onChange={this.changeTargetLanguage}
            value={this.state.targetLanguage}
          >
            {this.state.languages.map((e, key) => {
              return (
                <option key={key} value={e.value}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>
        <div style={{ flexDirection: "column" }}>
          <label htmlFor="source-lang">Send as: </label>
          <select
            id="source-lang"
            onChange={this.changeSourceLanguage}
            value={this.state.sourceLanguage}
          >
            {this.state.languages.map((e, key) => {
              return (
                <option key={key} value={e.value}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}