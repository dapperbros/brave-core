/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVELEDGER_REPORT_REPORT_H_
#define BRAVELEDGER_REPORT_REPORT_H_

#include <string>
#include <map>
#include <memory>
#include <vector>

#include "bat/ledger/ledger.h"

namespace braveledger_report {

class Report {
 public:
  explicit Report(bat_ledger::LedgerImpl* ledger);

  ~Report();

  void GetMonthlyReport(
      const ledger::ActivityMonth month,
      const int year,
      ledger::GetMonthlyReportCallback callback);

 private:
  void OnBalanceReport(
      const ledger::Result result,
      ledger::BalanceReportInfoPtr balance_report,
      const ledger::ActivityMonth month,
      const uint32_t year,
      ledger::GetMonthlyReportCallback callback);

  void OnTransactionReport(
      ledger::TransactionReportInfoList transaction_report,
      const ledger::ActivityMonth month,
      const uint32_t year,
      const std::string& monthly_report_string,
      ledger::GetMonthlyReportCallback callback);

  void OnContributionReport(
      ledger::ContributionReportInfoList contribution_report,
      const std::string& monthly_report_string,
      ledger::GetMonthlyReportCallback callback);

  bat_ledger::LedgerImpl* ledger_;  // NOT OWNED
};

}  // namespace braveledger_report

#endif  // BRAVELEDGER_REPORT_REPORT_H_
