// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Components
import Stats from './stats'
import TopSitesGrid from './gridSites'
import FooterInfo from './footerInfo'
import SiteRemovalNotification from './notification'
import {
  ClockWidget as Clock,
  RewardsWidget as Rewards
} from '../../components/default'
import * as Page from '../../components/default/page'
import BrandedWallpaperLogo from '../../components/default/brandedWallpaper/logo'

// Helpers
import VisibilityTimer from '../../helpers/visibilityTimer'
import arrayMove from 'array-move'
import { isGridSitePinned } from '../../helpers/newTabUtils'

// Types
import { SortEnd } from 'react-sortable-hoc'
import * as newTabActions from '../../actions/new_tab_actions'
import * as gridSitesActions from '../../actions/grid_sites_actions'

interface Props {
  newTabData: NewTab.State
  gridSitesData: NewTab.GridSitesState
  actions: typeof newTabActions & typeof gridSitesActions
  saveShowBackgroundImage: (value: boolean) => void
  saveShowClock: (value: boolean) => void
  saveShowTopSites: (value: boolean) => void
  saveShowStats: (value: boolean) => void
  saveShowRewards: (value: boolean) => void
  saveBrandedWallpaperOptIn: (value: boolean) => void
}

interface State {
  onlyAnonWallet: boolean
  showSettingsMenu: boolean
  backgroundHasLoaded: boolean
}

function GetBackgroundImageSrc (props: Props) {
  if (!props.newTabData.showBackgroundImage) {
    return undefined
  }
  if (props.newTabData.brandedWallpaperData) {
    const wallpaperData = props.newTabData.brandedWallpaperData
    if (wallpaperData && wallpaperData.wallpaperImageUrl) {
      return wallpaperData.wallpaperImageUrl
    }
  }
  if (props.newTabData.backgroundImage && props.newTabData.backgroundImage.source) {
    return props.newTabData.backgroundImage.source
  }
  return undefined
}

function GetIsShowingBrandedWallpaper (props: Props) {
  const { newTabData } = props
  return newTabData.brandedWallpaperData ? true : false
}

function GetShouldShowBrandedWallpaperNotification (props: Props) {
  return GetIsShowingBrandedWallpaper(props) &&
  !props.newTabData.isBrandedWallpaperNotificationDismissed
}

class NewTabPage extends React.Component<Props, State> {
  state = {
    onlyAnonWallet: false,
    showSettingsMenu: false,
    backgroundHasLoaded: false
  }
  imageSource?: string = undefined
  timerIdForBrandedWallpaperNotification?: number = undefined
  onVisiblityTimerExpired = () => {
    this.dismissBrandedWallpaperNotification(false)
  }
  visibilityTimer = new VisibilityTimer(this.onVisiblityTimerExpired, 4000)

  componentDidMount () {
    // if a notification is open at component mounting time, close it
    this.props.actions.showGridSiteRemovedNotification(false)
    this.imageSource = GetBackgroundImageSrc(this.props)
    this.trackCachedImage()
    if (GetShouldShowBrandedWallpaperNotification(this.props)) {
      this.trackBrandedWallpaperNotificationAutoDismiss()
    }
  }

  componentDidUpdate (prevProps: Props) {
    const oldImageSource = GetBackgroundImageSrc(prevProps)
    const newImageSource = GetBackgroundImageSrc(this.props)
    this.imageSource = newImageSource
    if (newImageSource && oldImageSource !== newImageSource) {
      this.trackCachedImage()
    }
    if (oldImageSource &&
      !newImageSource) {
      // reset loaded state
      this.setState({ backgroundHasLoaded: false })
    }
    if (!GetShouldShowBrandedWallpaperNotification(prevProps) &&
        GetShouldShowBrandedWallpaperNotification(this.props)) {
      this.trackBrandedWallpaperNotificationAutoDismiss()
    }

    if (GetShouldShowBrandedWallpaperNotification(prevProps) &&
        !GetShouldShowBrandedWallpaperNotification(this.props)) {
      this.stopWaitingForBrandedWallpaperNotificationAutoDismiss()
    }

  }

  trackCachedImage () {
    if (this.imageSource) {
      const imgCache = new Image()
      imgCache.src = this.imageSource
      console.timeStamp('image start loading...')
      imgCache.onload = () => {
        console.timeStamp('image loaded')
        this.setState({
          backgroundHasLoaded: true
        })
      }
    }
  }

  trackBrandedWallpaperNotificationAutoDismiss () {
    // Wait until page has been visible for an uninterupted Y seconds and then
    // dismiss the notification.
    this.visibilityTimer.startTracking()
  }

  stopWaitingForBrandedWallpaperNotificationAutoDismiss () {
    this.visibilityTimer.stopTracking()
  }

  onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const { gridSitesData } = this.props
    // Do not update topsites order if the drag
    // destination is a pinned tile
    const gridSite = gridSitesData.gridSites[newIndex]
    if (!gridSite || isGridSitePinned(gridSite)) {
      return
    }
    const items = arrayMove(gridSitesData.gridSites, oldIndex, newIndex)
    this.props.actions.gridSitesDataUpdated(items)
  }

  toggleShowBackgroundImage = () => {
    this.props.saveShowBackgroundImage(
      !this.props.newTabData.showBackgroundImage
    )
  }

  toggleShowClock = () => {
    this.props.saveShowClock(
      !this.props.newTabData.showClock
    )
  }

  toggleShowStats = () => {
    this.props.saveShowStats(
      !this.props.newTabData.showStats
    )
  }

  toggleShowTopSites = () => {
    this.props.saveShowTopSites(
      !this.props.newTabData.showTopSites
    )
  }

  toggleShowRewards = () => {
    this.props.saveShowRewards(
      !this.props.newTabData.showRewards
    )
  }

  disableBrandedWallpaper = () => {
    this.props.saveBrandedWallpaperOptIn(false)
  }

  toggleShowBrandedWallpaper = () => {
    this.props.saveBrandedWallpaperOptIn(
      !this.props.newTabData.brandedWallpaperOptIn
    )
  }

  enableAds = () => {
    chrome.braveRewards.saveAdsSetting('adsEnabled', 'true')
  }

  enableRewards = () => {
    chrome.braveRewards.saveSetting('enabledMain', '1')
  }

  createWallet = () => {
    this.props.actions.createWallet()
  }

  dismissBrandedWallpaperNotification = (isUserAction: boolean) => {
    this.props.actions.dismissBrandedWallpaperNotification(isUserAction)
  }

  dismissNotification = (id: string) => {
    this.props.actions.dismissNotification(id)
  }

  closeSettings = () => {
    this.setState({ showSettingsMenu: false })
  }

  toggleSettings = () => {
    this.setState({ showSettingsMenu: !this.state.showSettingsMenu })
  }

  renderRewardsContent () {
    const { newTabData } = this.props
    const {
      rewardsState,
      showRewards: rewardsWidgetOn
    } = newTabData
    const isShowingBrandedWallpaper = GetIsShowingBrandedWallpaper(this.props)
    const shouldShowBrandedWallpaperNotification = GetShouldShowBrandedWallpaperNotification(this.props)
    const shouldShowRewardsWidget = rewardsWidgetOn || shouldShowBrandedWallpaperNotification
    return shouldShowRewardsWidget && (
      <Page.GridItemRewards>
        <Rewards
          {...rewardsState}
          preventFocus={!rewardsWidgetOn}
          onCreateWallet={this.createWallet}
          onEnableAds={this.enableAds}
          onEnableRewards={this.enableRewards}
          isShowingBrandedWallpaper={isShowingBrandedWallpaper}
          showBrandedWallpaperNotification={shouldShowBrandedWallpaperNotification}
          onDisableBrandedWallpaper={this.disableBrandedWallpaper}
          brandedWallpaperData={newTabData.brandedWallpaperData}
          textDirection={newTabData.textDirection}
          hideWidget={this.toggleShowRewards}
          isNotification={!rewardsWidgetOn}
          onDismissNotification={this.dismissNotification}
          onDismissBrandedWallpaperNotification={this.dismissBrandedWallpaperNotification}
          menuPosition={'left'}
        />
      </Page.GridItemRewards>
    )
  }

  render () {
    const { newTabData, gridSitesData, actions } = this.props
    const { showSettingsMenu } = this.state

    if (!newTabData) {
      return null
    }

    const hasImage = this.imageSource !== undefined
    const isShowingBrandedWallpaper = newTabData.brandedWallpaperData ? true : false
    const showTopSites = !!this.props.gridSitesData.gridSites.length && newTabData.showTopSites
    const rewardsContent = this.renderRewardsContent()

    return (
      <Page.App dataIsReady={newTabData.initialDataLoaded}>
        <Page.PosterBackground
          hasImage={hasImage}
          imageHasLoaded={this.state.backgroundHasLoaded}
        >
          {hasImage &&
            <img src={this.imageSource} />
          }
        </Page.PosterBackground>
        {hasImage &&
          <Page.Gradient
            imageHasLoaded={this.state.backgroundHasLoaded}
          />
        }
        <Page.Page
            showClock={newTabData.showClock}
            showStats={newTabData.showStats}
            showRewards={!!rewardsContent}
            showTopSites={showTopSites}
            showBrandedWallpaper={isShowingBrandedWallpaper}
        >
          {newTabData.showStats &&
          <Page.GridItemStats>
            <Stats
              textDirection={newTabData.textDirection}
              stats={newTabData.stats}
              hideWidget={this.toggleShowStats}
              menuPosition={'right'}
            />
          </Page.GridItemStats>
          }
          {newTabData.showClock &&
          <Page.GridItemClock>
            <Clock
              textDirection={newTabData.textDirection}
              hideWidget={this.toggleShowClock}
              menuPosition={'left'}
            />
          </Page.GridItemClock>
          }
          {
            showTopSites
              ? (
              <Page.GridItemTopSites>
                <TopSitesGrid
                  actions={actions}
                  gridSites={gridSitesData.gridSites}
                  menuPosition={'right'}
                  hideWidget={this.toggleShowTopSites}
                  textDirection={newTabData.textDirection}
                />
              </Page.GridItemTopSites>
              ) : null
          }
          {
            gridSitesData.shouldShowSiteRemovedNotification
            ? (
            <Page.GridItemNotification>
              <SiteRemovalNotification actions={actions} />
            </Page.GridItemNotification>
            ) : null
          }
            {rewardsContent}
          <Page.Footer>
            <Page.FooterContent>
            {isShowingBrandedWallpaper && newTabData.brandedWallpaperData &&
             newTabData.brandedWallpaperData.logo &&
             <Page.GridItemBrandedLogo>
              <BrandedWallpaperLogo
                menuPosition={'right'}
                textDirection={newTabData.textDirection}
                data={newTabData.brandedWallpaperData.logo}
              />
            </Page.GridItemBrandedLogo>}
            <FooterInfo
              textDirection={newTabData.textDirection}
              onClickOutside={this.closeSettings}
              backgroundImageInfo={newTabData.backgroundImage}
              onClickSettings={this.toggleSettings}
              showSettingsMenu={showSettingsMenu}
              showPhotoInfo={!isShowingBrandedWallpaper && newTabData.showBackgroundImage}
              toggleShowBackgroundImage={this.toggleShowBackgroundImage}
              toggleShowClock={this.toggleShowClock}
              toggleShowStats={this.toggleShowStats}
              toggleShowTopSites={this.toggleShowTopSites}
              toggleBrandedWallpaperOptIn={this.toggleShowBrandedWallpaper}
              showBackgroundImage={newTabData.showBackgroundImage}
              showClock={newTabData.showClock}
              showStats={newTabData.showStats}
              showTopSites={newTabData.showTopSites}
              showRewards={newTabData.showRewards}
              brandedWallpaperOptIn={newTabData.brandedWallpaperOptIn}
              allowBrandedWallpaperUI={newTabData.featureFlagBraveNTPBrandedWallpaper}
              toggleShowRewards={this.toggleShowRewards}
            />
            </Page.FooterContent>
          </Page.Footer>
        </Page.Page>
      </Page.App>
    )
  }
}

export default NewTabPage
