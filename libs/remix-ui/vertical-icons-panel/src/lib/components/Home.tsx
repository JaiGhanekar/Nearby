import React from 'react'
import NearbyBricks from '../../../../common/nearby-bricks'
interface HomeProps {
  verticalIconPlugin: any
}

function Home ({ verticalIconPlugin }: HomeProps) {
  return (
    <div
      className="mt-2 my-1 remixui_homeIcon"
      onClick={async () => await verticalIconPlugin.activateHome()}
      {...{ plugin: 'home'}}
      title="Home"
      data-id="verticalIconsHomeIcon"
      id="verticalIconsHomeIcon"
    >
      <NearbyBricks viewBox="0 0 105 100"/>
    </div>
  )
}

export default Home
