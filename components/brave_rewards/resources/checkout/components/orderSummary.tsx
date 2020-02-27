/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import styled from 'brave-ui/theme'

const Container = styled<{}, 'div'>('div')`
  padding: 10px 14px 30px;
  border-top: solid 1px ${p => p.theme.color.separatorLine};
  border-bottom: solid 1px ${p => p.theme.color.separatorLine};

  table {
    border-collapse: collapse;
    width: 100%;

    td, th {
      padding: 0;
      text-align: left;
      vertical-align: top;
      line-height: 22px;
    }

    th {
      color: ${p => p.theme.palette.blurple600};
      font-weight: 500;
      padding-top: 4px;
    }

    td {
      padding-top: 14px;
    }

    td:nth-child(2) {
      width: 6.5em;
    }

    td:nth-child(1) {
      padding-right: 4em;
    }
  }
`

const ItemName = styled<{}, 'span'>('span')``

const BatAmount = styled<{}, 'span'>('span')`
  font-size: 18px;
  font-weight: 500;

  &::after {
    content: "BAT";
    padding-left: 5px;
    font-size: 16px;
    font-weight: normal;
  }
`

const ExchangeAmount = styled<{}, 'span'>('span')`
  display: block;
  color: #999;
`

export interface OrderSummaryProps {
  itemName: string
  orderPrice: number
  exchangePrice: string
}

export function OrderSummary (props: OrderSummaryProps) {
  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Item Selected</th>
            <th>Order Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ItemName>{props.itemName}</ItemName>
            </td>
            <td>
              <BatAmount>{props.orderPrice.toFixed(1)}</BatAmount>
              <ExchangeAmount>{props.exchangePrice}</ExchangeAmount>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  )
}
