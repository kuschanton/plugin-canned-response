import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import { TranslatedMessage } from './components/ChatMessageTranslator/TranslatedMessage';
import { LanguageSelector } from './components/ChatMessageTranslator/LanguageSelector'
import { TranslateHelper } from './components/ChatMessageTranslator/TranslateHelper'

const PLUGIN_NAME = 'ChatMessageTranslator';

export default class ChatMessageTranslator extends FlexPlugin {

  constructor() {
    super(PLUGIN_NAME);

    this.targetLanguage = '';
    this.sourceLanguage = '';
    this.children = [];
    
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    console.log(manager.serviceConfiguration.runtime_domain)

    flex.MessageBubble.Content.add(
      <TranslatedMessage
        key="translated-message"
        runtimeDomain={manager.serviceConfiguration.runtime_domain} 
        onUnmount={this.removeChild}
        targetLanguage={this.getTargetLanguage}
        ref={this.addChild}
      />
    );
      
    flex.MessagingCanvas.Content.add(
      <LanguageSelector
        key="language-selector" 
        runtimeDomain={manager.serviceConfiguration.runtime_domain} 
        sourceLanguage={this.getSourceLanguage}
        updateTargetLanguage={this.updateTargetLanguage}
        updateSourceLanguage={this.updateSourceLanguage}
      />
    );

    flex.Actions.replaceAction("SendMessage", (payload, original) => {
      return new Promise((resolve, reject) => {
        if (this.getSourceLanguage() === "") {
          resolve(payload.body);
        } else {
          TranslateHelper.getTranslation(
            manager.serviceConfiguration.runtime_domain,
            payload.body,
            this.getSourceLanguage()
          ).then(result => {
            console.log("translated: " + result.translatedText);
            resolve(result.translatedText);
          });
        }
      }).then(text => original({ ...payload, body: text }));
    });
  }

  removeChild = (child) => {
    this.children = this.children.filter(el => el && el !== child);
  }

  addChild = (child) => {
    if (child !== null) {
      this.children.push(child);
    }
  }

  getTargetLanguage = () => {
    return this.targetLanguage;
  }

  getSourceLanguage = () => {
    return this.sourceLanguage;
  }

  updateSourceLanguage = (lang) =>{
    this.sourceLanguage = lang;
    console.log("updated source language: " + lang);
    // return this.children.length > 0
    //   ? this.children
    //       .filter(el => el !== null)
    //       .slice(-1)[0]
    //       .getSourceLanguage()
    //   : "";
  }

  updateTargetLanguage = (lang) => {
    this.targetLanguage = lang;
    console.log("updated target language: " + lang);
    this.children.forEach(async child => {
      if (child) {
        child.changeTargetLanguage(lang);
      }
    });
  }

}
