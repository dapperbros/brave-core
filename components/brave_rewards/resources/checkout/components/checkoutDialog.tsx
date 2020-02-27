/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import styled from 'brave-ui/theme'
import { CloseStrokeIcon, BatColorIcon } from 'brave-ui/components/icons'

const MainPanel = styled<{}, 'div'>('div')`
  position:relative;
  top: 0;
  left: 0;
  min-height: 500px;
  max-width: 548px;
  background: #fff;
  font-weight: normal;
  font-family: ${p => p.theme.fontFamily.heading};
  font-size: 14px;
`

const Content = styled<{}, 'div'>('div')`
  padding: 51px 49px 20px;

  h1 {
    margin: 0 0 20px 0;
    text-align: center;
    font-weight: 500;
    font-family: ${p => p.theme.fontFamily.heading};
    font-size: 22px;
    color: ${p => p.theme.color.gray800};
  }
`

const TopBar = styled<{}, 'div'>('div')`
  padding: 15px 18px 15px 32px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: ${p => p.theme.color.gray600};
  font-weight: 500;
  font-family: ${p => p.theme.fontFamily.heading};
  font-size: 12px;
  text-transform: uppercase;

  > svg {
    position: absolute;
    top: 14px;
    left: 14px;
    height: 14px;
    width: auto;
  }
`

const CloseButton = styled<{}, 'button'>('button')`
  top: 22px;
  right: 22px;
  position: absolute;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 14px;
  height: 14px;
  color: #999;
`

function DialogTitle (props: { visible: boolean }) {
  // TODO: Icon should not be full color
  return !props.visible ? null : (
    <>
      <BatColorIcon />
      BAT Checkout
    </>
  )
}

export interface CheckoutDialogProps {
  onClose: () => void
  children: React.ReactNode
  titleHidden?: boolean
}

export function CheckoutDialog (props: CheckoutDialogProps) {
  return (
    <MainPanel>
      <TopBar>
        <DialogTitle visible={!props.titleHidden} />
        <CloseButton onClick={props.onClose}>
          <CloseStrokeIcon />
        </CloseButton>
      </TopBar>
      <Content>
        {props.children}
      </Content>
    </MainPanel>
  )
}
