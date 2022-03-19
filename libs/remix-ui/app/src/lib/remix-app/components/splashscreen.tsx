import React from 'react'
import NearbyLogo from '../../../../../common/nearby-logo'
const RemixSplashScreen = (props) => {
  return (<>  <div style={{ display: props.hide ? 'none' : 'block' }} className='centered'>
    <NearbyLogo/>
    <div className="info-secondary splash">
      Nearby
    </div>
  </div></>)
}

export default RemixSplashScreen
