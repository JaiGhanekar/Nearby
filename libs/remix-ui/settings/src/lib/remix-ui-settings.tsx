import React, { useState, useReducer, useEffect, useCallback } from 'react' // eslint-disable-line
import { CopyToClipboard } from '@remix-ui/clipboard' // eslint-disable-line

import { gitAccessTokenLink, gitAccessTokenText, gitAccessTokenText2, gitAccessTokenTitle,  textDark } from './constants'

import './remix-ui-settings.css'
import {saveTokenToast, removeTokenToast } from './settingsAction'
import { initialState, toastInitialState, toastReducer, settingReducer } from './settingsReducer'
import { Toaster } from '@remix-ui/toaster'// eslint-disable-line
import { RemixUiThemeModule, ThemeModule} from '@remix-ui/theme-module'

/* eslint-disable-next-line */
export interface RemixUiSettingsProps {
  config: any,
  editor: any,
   _deps: any,
   useMatomoAnalytics: boolean
   themeModule: ThemeModule
}

export const RemixUiSettings = (props: RemixUiSettingsProps) => {
  const [, dispatch] = useReducer(settingReducer, initialState)
  const [state, dispatchToast] = useReducer(toastReducer, toastInitialState)
  const [tokenValue, setTokenValue] = useState('')

  useEffect(() => {
    const token = props.config.get('settings/gist-access-token')
    if (token === undefined) {
      props.config.set('settings/generate-contract-metadata', true)
      dispatch({ type: 'contractMetadata', payload: { name: 'contractMetadata', isChecked: true, textClass: textDark } })
    }
    if (token) {
      setTokenValue(token)
    }
  }, [state.message])




  const saveToken = () => {
    saveTokenToast(props.config, dispatchToast, tokenValue)
  }

  const removeToken = () => {
    setTokenValue('')
    removeTokenToast(props.config, dispatchToast)
  }

  const handleSaveTokenState = useCallback(
    (event) => {
      setTokenValue(event.target.value)
    },
    [tokenValue]
  )

  const gistToken = () => (
    <div className="border-top">
      <div className="card-body pt-3 pb-2">
        <h6 className="card-title">{ gitAccessTokenTitle }</h6>
        <p className="mb-1">{ gitAccessTokenText }</p>
        <p className="">{ gitAccessTokenText2 }</p>
        <p className="mb-1"><a className="text-primary" target="_blank" href="https://github.com/settings/tokens">{ gitAccessTokenLink }</a></p>
        <div className=""><label>TOKEN:</label>
          <div className="text-secondary mb-0 h6">
            <input id="gistaccesstoken" data-id="settingsTabGistAccessToken" type="password" className="form-control" onChange={handleSaveTokenState} value={ tokenValue } />
            <div className="d-flex justify-content-end pt-2">
              <CopyToClipboard content={tokenValue} data-id='copyToClipboardCopyIcon' />
              <input className="btn btn-sm btn-primary ml-2" id="savegisttoken" data-id="settingsTabSaveGistToken" onClick={() => saveToken()} value="Save" type="button" disabled={tokenValue === ''}></input>
              <button className="btn btn-sm btn-secondary ml-2" id="removegisttoken" data-id="settingsTabRemoveGistToken" title="Delete Github access token" onClick={() => removeToken()}>Remove</button>
            </div>
          </div></div>
      </div>
    </div>
  )

  return (
    <div>
      {state.message ? <Toaster message= {state.message}/> : null}
      {gistToken()}
      <RemixUiThemeModule themeModule={props._deps.themeModule} />
    </div>
  )
}
