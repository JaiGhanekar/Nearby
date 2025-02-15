import React, { useState, useRef, useEffect, useReducer } from 'react' // eslint-disable-line

import './remix-ui-home-tab.css'
import JSZip from 'jszip'
import { ModalDialog } from '@remix-ui/modal-dialog' // eslint-disable-line
import { Toaster } from '@remix-ui/toaster' // eslint-disable-line
import PluginButton from './components/pluginButton' // eslint-disable-line
import { QueryParams } from '@remix-project/remix-lib'
import { ThemeContext, themes } from './themeContext'
import NearbyLogo from '../../../common/nearby-logo'

declare global {
  interface Window {
    _paq: any
  }
}
const _paq = window._paq = window._paq || [] //eslint-disable-line

/* eslint-disable-next-line */
export interface RemixUiHomeTabProps {
  plugin: any
}

const loadingInitialState = {
  tooltip: '',
  showModalDialog: false,
  importSource: ''
}

const loadingReducer = (state = loadingInitialState, action) => {
  return { ...state, tooltip: action.tooltip, showModalDialog: false, importSource: '' }
}

export const RemixUiHomeTab = (props: RemixUiHomeTabProps) => {
  const { plugin } = props
  const fileManager = plugin.fileManager

  const [state, setState] = useState<{
    themeQuality: { filter: string, name: string },
    showMediaPanel: 'none' | 'twitter' | 'medium',
    showModalDialog: boolean,
    modalInfo: { title: string, loadItem: string, examples: Array<string> },
    importSource: string,
    toasterMsg: string
  }>({
    themeQuality: themes.light,
    showMediaPanel: 'none',
    showModalDialog: false,
    modalInfo: { title: '', loadItem: '', examples: [] },
    importSource: '',
    toasterMsg: ''
  })

  const processLoading = () => {
    const contentImport = plugin.contentImport
    const workspace = fileManager.getProvider('workspace')
    contentImport.import(
      state.importSource,
      (loadingMsg) => dispatch({ tooltip: loadingMsg }),
      (error, content, cleanUrl, type, url) => {
        if (error) {
          toast(error.message || error)
        } else {
          try {
            workspace.addExternal(type + '/' + cleanUrl, content, url)
            plugin.call('menuicons', 'select', 'filePanel')
          } catch (e) {
            toast(e.message)
          }
        }
      }
    )
    setState(prevState => {
      return { ...prevState, showModalDialog: false, importSource: '' }
    })
  }

  const [, dispatch] = useReducer(loadingReducer, loadingInitialState)

  const playRemi = async () => {
    remiAudioEl.current.play()
  }

  const remiAudioEl = useRef(null)
  const inputValue = useRef(null)
  const rightPanel = useRef(null)

  useEffect(() => {
    plugin.call('theme', 'currentTheme').then((theme) => {
      // update theme quality. To be used for for images
      setState(prevState => {
        return { ...prevState, themeQuality: theme.quality === 'dark' ? themes.dark : themes.light }
      })
    })
    plugin.on('theme', 'themeChanged', (theme) => {
      // update theme quality. To be used for for images
      setState(prevState => {
        return { ...prevState, themeQuality: theme.quality === 'dark' ? themes.dark : themes.light }
      })
    })
    window.addEventListener('click', (event) => {
      const target = event.target as Element
      const id = target.id
      if (id !== 'remixIDEHomeTwitterbtn' && id !== 'remixIDEHomeMediumbtn' && !rightPanel.current.contains(event.target)) {
        // todo check event.target
        setState(prevState => { return { ...prevState, showMediaPanel: 'none' } })
      }
    })

    return () => {

    }
  }, [])

  const toast = (message: string) => {
    setState(prevState => {
      return { ...prevState, toasterMsg: message }
    })
  }

  const createNewFile = async () => {
    plugin.verticalIcons.select('filePanel')
    await plugin.call('filePanel', 'createNewFile')
  }

  const uploadFile = async (target) => {
    await plugin.call('filePanel', 'uploadFile', target)
  }

  const connectToLocalhost = () => {
    plugin.appManager.activatePlugin('remixd')
  }
  const importFromGist = () => {
    plugin.call('gistHandler', 'load', '')
    plugin.verticalIcons.select('filePanel')
  }
  const switchToPreviousVersion = () => {
    const query = new QueryParams()
    query.update({ appVersion: '0.7.7' })
    _paq.push(['trackEvent', 'LoadingType', 'oldExperience_0.7.7'])
    document.location.reload()
  }
  const startSolidity = async () => {
    await plugin.appManager.activatePlugin(['solidity', 'udapp', 'solidityStaticAnalysis', 'solidityUnitTesting'])
    plugin.verticalIcons.select('solidity')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'solidity'])
  }
  const startStarkNet = async () => {
    await plugin.appManager.activatePlugin('starkNet_compiler')
    plugin.verticalIcons.select('starkNet_compiler')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'starkNet_compiler'])
  }
  const startSolhint = async () => {
    await plugin.appManager.activatePlugin(['solidity', 'solhint'])
    plugin.verticalIcons.select('solhint')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'solhint'])
  }
  const startLearnEth = async () => {
    await plugin.appManager.activatePlugin(['solidity', 'LearnEth', 'solidityUnitTesting'])
    plugin.verticalIcons.select('LearnEth')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'learnEth'])
  }
  const startSourceVerify = async () => {
    await plugin.appManager.activatePlugin(['solidity', 'sourcify'])
    plugin.verticalIcons.select('sourcify')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'sourcify'])
  }
  const startPluginManager = async () => {
    plugin.verticalIcons.select('pluginManager')
  }
  const saveAs = (blob, name) => {
    const node = document.createElement('a')
    node.download = name
    node.rel = 'noopener'
    node.href = URL.createObjectURL(blob)
    setTimeout(function () { URL.revokeObjectURL(node.href) }, 4E4) // 40s
    setTimeout(function () {
      try {
        node.dispatchEvent(new MouseEvent('click'))
      } catch (e) {
        const evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
          20, false, false, false, false, 0, null)
        node.dispatchEvent(evt)
      }
    }, 0) // 40s
  }
  const downloadFiles = async () => {
    try {
      plugin.call('notification', 'toast', 'preparing files for download, please wait..')
      const zip = new JSZip()
      const browserProvider = fileManager.getProvider('browser')
      await browserProvider.copyFolderToJson('/', ({ path, content }) => {
        zip.file(path, content)
      })
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        const today = new Date()
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        const time = today.getHours() + 'h' + today.getMinutes() + 'min'
        saveAs(blob, `remix-backup-at-${time}-${date}.zip`)
      }).catch((e) => {
        plugin.call('notification', 'toast', e.message)
      })
    } catch (e) {
      plugin.call('notification', 'toast', e.message)
    }
  }

  const restoreBackupZip = async () => {
    await plugin.appManager.activatePlugin(['restorebackupzip'])
    plugin.verticalIcons.select('restorebackupzip')
    _paq.push(['trackEvent', 'pluginManager', 'userActivate', 'restorebackupzip'])
  }

  const showFullMessage = (title: string, loadItem: string, examples: Array<string>) => {
    setState(prevState => {
      return { ...prevState, showModalDialog: true, modalInfo: { title: title, loadItem: loadItem, examples: examples } }
    })
  }

  const hideFullMessage = () => { //eslint-disable-line
    setState(prevState => {
      return { ...prevState, showModalDialog: false, importSource: '' }
    })
  }

  const maxHeight = Math.max(window.innerHeight - 150, 250) + 'px'
  const examples = state.modalInfo.examples.map((urlEl, key) => (<div key={key} className="p-1 user-select-auto"><a>{urlEl}</a></div>))
  const elHeight = '4000px'
  return (
    <>
      <ModalDialog
        id='homeTab'
        title={ 'Import from ' + state.modalInfo.title }
        okLabel='Import'
        hide={ !state.showModalDialog }
        handleHide={ () => hideFullMessage() }
        okFn={ () => processLoading() }
      >
        <div className="p-2 user-select-auto">
          { state.modalInfo.loadItem !== '' && <span>Enter the { state.modalInfo.loadItem } you would like to load.</span> }
          { state.modalInfo.examples.length !== 0 &&
          <>
            <div>e.g</div>
            <div>
              { examples }
            </div>
          </> }
          <input
            ref={inputValue}
            type='text'
            name='prompt_text'
            id='inputPrompt_text'
            className="w-100 mt-1 form-control"
            data-id="homeTabModalDialogCustomPromptText"
            value={state.importSource}
            onInput={(e) => {
              setState(prevState => {
                return { ...prevState, importSource: inputValue.current.value }
              })
            }}
          />
        </div>
      </ModalDialog>
      <Toaster message={state.toasterMsg} />
      <div className="d-flex flex-column ml-4" id="remixUiRightPanel">
        <div className="border-bottom d-flex flex-column mr-4 pb-3 mb-3">
          <div className="d-flex justify-content-between ">
          <NearbyLogo/>
          </div>
          <div>
          </div>
        </div>
        <div className="row mx-2 mr-4" data-id="landingPageHpSections">
          <div className="ml-3">
            <div className="d-flex">
              <div className="file">
                <h4>File</h4>
                <p className="mb-1">
                  <i className="mr-2 far fa-file"></i>
                  <label className="ml-1 mb-1 remixui_home_text" onClick={() => createNewFile()}>New File</label>
                </p>
                <p className="mb-1">
                  <i className="mr-2 far fa-file-alt"></i>
                  <label className="ml-1 remixui_home_labelIt remixui_home_bigLabelSize remixui_home_text" htmlFor="openFileInput">
                    Open Files
                  </label>
                  <input title="open file" type="file" id="openFileInput" onChange={(event) => {
                    event.stopPropagation()
                    plugin.verticalIcons.select('filePanel')
                    uploadFile(event.target)
                  }} multiple />
                </p>
                <p className="mb-1">
                  <i className="mr-1 far fa-hdd"></i>
                  <label className="ml-1 remixui_home_text" onClick={() => connectToLocalhost()}>Connect to Localhost</label>
                </p>
                <p className="mb-1">
                  <i className="mr-1 far fa-download"></i>
                  <label className="ml-1 remixui_home_text" onClick={() => downloadFiles()}>Download Backup</label>
                </p>
                <p className="mb-1">
                  <i className="mr-1 far fa-upload"></i>
                  <label className="ml-1 remixui_home_text" onClick={() => restoreBackupZip()}>Restore Backup</label>
                </p>
                <p className="mt-3 mb-0"><label>LOAD FROM:</label></p>
                <div className="btn-group">
                  <button className="btn mr-1 btn-secondary" data-id="landingPageImportFromGistButton" onClick={() => importFromGist()}>Gist</button>
                  <button className="btn mx-1 btn-secondary" data-id="landingPageImportFromGitHubButton" onClick={() => showFullMessage('Github', 'github URL', ['https://github.com/near-examples/guest-book/blob/master/assembly/main.ts', 'https://github.com/near-examples/counter/blob/master/assembly/main.ts'])}>GitHub</button>
                  <button className="btn mx-1 btn-secondary" onClick={() => showFullMessage('Ipfs', 'ipfs URL', ['ipfs://<ipfs-hash>'])}>Ipfs</button>
                  <button className="btn mx-1 btn-secondary" onClick={() => showFullMessage('Https', 'http/https raw content', ['https://raw.githubusercontent.com/near-examples/counter/master/assembly/main.ts'])}>https</button>
                </div>
              </div>
              <div className="ml-4 pl-4">
                <h4>Resources</h4>
                <p className="mb-1">
                  <i className="mr-2 fas fa-book"></i>
                  <a className="remixui_home_text" target="__blank" href="https://docs.near.org/docs/develop/basics/getting-started">Documentation</a>
                </p>
                <p className="mb-1">
                  <img id='remixHhomeWebsite' className="mr-2 remixui_home_image" src={ plugin.profile.icon } style={ { filter: state.themeQuality.filter } } alt=''></img>
                  <a className="remixui_home_text" target="__blank" href="https://awesomenear.com">Featuring website</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column remixui_home_rightPanel">
          <div className="d-flex pr-3 py-2 align-self-end" id="remixIDEMediaPanelsTitle">
          </div>
          <div
            className="mr-3 d-flex bg-light remixui_home_panels"
            style={ { visibility: state.showMediaPanel === 'none' ? 'hidden' : 'visible' } }
            id="remixIDEMediaPanels"
            ref={rightPanel}
          >
            <div id="remixIDE_MediumBlock" className="p-2 mx-1 mt-3 mb-0 remixui_home_remixHomeMedia" style={ { maxHeight: maxHeight } }>
              <div id="medium-widget" className="px-3 remixui_home_media" hidden={state.showMediaPanel !== 'medium'} style={ { maxHeight: '10000px' } }>
                <div
                  id="retainable-rss-embed"
                  data-rss="https://medium.com/feed/remix-ide"
                  data-maxcols="1"
                  data-layout="grid"
                  data-poststyle="external"
                  data-readmore="More..."
                  data-buttonclass="btn mb-3"
                  data-offset="-100"
                >
                </div>
              </div>
            </div>
            <div id="remixIDE_TwitterBlock" className="p-2 mx-1 mt-3 mb-0 remixui_home_remixHomeMedia" hidden={state.showMediaPanel !== 'twitter'} style={ { maxHeight: maxHeight, marginRight: '28px' } } >
              <div className="remixui_home_media" style={ { minHeight: elHeight } } >
                <a className="twitter-timeline"
                  data-width="375"
                  data-theme={ state.themeQuality.name }
                  data-chrome="nofooter noheader transparent"
                  data-tweet-limit="18"
                  href="https://twitter.com/EthereumRemix"
                >
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RemixUiHomeTab
