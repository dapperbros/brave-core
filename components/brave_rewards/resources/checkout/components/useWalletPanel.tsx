/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import styled from 'brave-ui/theme'
import { BatColorIcon } from 'brave-ui/components/icons'
import { Button } from 'brave-ui/components'

const Container = styled<{}, 'div'>('div')`
  border-radius: 8px;
  background: #F7F9FB;
  box-shadow: 1px -1px 6px 0 rgba(12, 23, 33, 0.20);
  padding: 16px;

  h2 {
    font-weight: 500;
    font-family: ${p => p.theme.fontFamily.heading};
    font-size: 14px;
    color: ${p => p.theme.palette.blurple600};
    margin: 0 0 12px 0;
  }
`

const Content = styled<{}, 'div'>('div')`
  display: flex;
`

const WalletInfoPanel = styled<{}, 'div'>('div')`
  flex-grow: 1;
`

// TODO: hover and active styles
const ActionPanel = styled<{}, 'div'>('div')`
  flex-grow: 0;
  padding-right: 4px;

  button {
    background: ${p => p.theme.color.brandBat};
    border-color: ${p => p.theme.color.brandBat};
  }
`

const BatAmount = styled<{}, 'span'>('span')`
  font-size: 22px;
  padding-left: 26px;
  position: relative;
  top: 0;
  left: 0;

  &::after {
    content: "BAT";
    padding-left: 5px;
    font-size: 18px;
  }

  svg {
    height: 22px;
    width: 22px;
    position: absolute;
    top: 4px;
    left: 0;
  }
`

const ExchangeAmount = styled<{}, 'span'>('span')`
  color: #999;
  padding-left: 10px;
`

const LastUpdated = styled<{}, 'div'>('div')`
  font-family: ${p => p.theme.fontFamily.body};
  font-size: 12px;
  color: #666;
  padding-top: 10px;
`

export interface UseWalletPanelProps {}

export function UseWalletPanel (props: UseWalletPanelProps) {
  // TODO: Conver to props
  const balance = 100
  const balanceExchange = '$20.00'
  const lastUpdated = 'Today at 11:32 am'

  return (
    <Container>
      <h2>Use your token balance</h2>
      <Content>
        <WalletInfoPanel>
          <BatAmount><BatColorIcon />{balance.toFixed(1)}</BatAmount>
          <ExchangeAmount>{balanceExchange}</ExchangeAmount>
          <LastUpdated>Updated {lastUpdated}</LastUpdated>
        </WalletInfoPanel>
        <ActionPanel>
          <Button
              text={'Pay with BAT'}
              size={'medium'}
          />
        </ActionPanel>
      </Content>
    </Container>
  )
}
