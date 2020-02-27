/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'

import { OrderSummary } from './orderSummary'
import { UseWalletPanel } from './useWalletPanel'

export interface PaymentMethodProps {}

export function PaymentMethodPanel (props: PaymentMethodProps) {
  // TODO: props
  const itemName =
    'Title of the selected item long title long ' +
    'long title wrapped into second line'
  const orderPrice = 45
  const exchangePrice = '$9.00'

  return (
    <>
      <h1>Payment Method</h1>
      <OrderSummary
        itemName={itemName}
        orderPrice={orderPrice}
        exchangePrice={exchangePrice}
      />
      <UseWalletPanel />
    </>
  )
}
