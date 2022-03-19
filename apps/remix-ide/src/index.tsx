// eslint-disable-next-line no-use-before-define
import React from 'react'
import { render } from 'react-dom'
// eslint-disable-next-line no-unused-vars
import { RemixApp } from '@remix-ui/app'
import * as packageJson from '../../../package.json'
import './index.css'
import NearbyLogo from './common/nearby-logo'
(function () {
  render(
    <React.StrictMode>
        <div style={{ display: 'block' }} className='left'>
        <NearbyLogo/>
        </div>
        <div style={{ display: 'block' }} className='centered'>
          <div className="info-secondary splash">
            Nearby
            <br />
            <span className='version'> v{ packageJson.version }</span>
          </div>
          <div style={{ marginTop: '55%', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        </div>
    </React.StrictMode>,
    document.getElementById('root')
  )
})()

import ('./app').then((AppComponent) => {
  const appComponent = new AppComponent.default()
  appComponent.run().then(() => {
    render(
      <React.StrictMode>
          <RemixApp app={appComponent} />
      </React.StrictMode>,
      document.getElementById('root')
    )
  })
}).catch(err => {
  console.log('Error on loading Remix:', err)
})
