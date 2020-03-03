/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <utility>
#include <vector>

#include "bat/ledger/internal/common/bind_util.h"
#include "bat/ledger/internal/ledger_impl.h"
#include "bat/ledger/internal/report/report.h"

using std::placeholders::_1;
using std::placeholders::_2;

namespace braveledger_report {

Report::Report(bat_ledger::LedgerImpl* ledger):
    ledger_(ledger) {
  DCHECK(ledger_);
}

Report::~Report() = default;

void Report::GetMonthlyReport(
      const ledger::ActivityMonth month,
      const int year,
      ledger::GetMonthlyReportCallback callback) {
  auto balance_callback = std::bind(&Report::OnBalanceReport,
      this,
      _1,
      _2,
      month,
      year,
      callback);

  ledger_->GetBalanceReport(month, year, balance_callback);
}

void Report::OnBalanceReport(
    const ledger::Result result,
    ledger::BalanceReportInfoPtr balance_report,
    const ledger::ActivityMonth month,
    const uint32_t year,
    ledger::GetMonthlyReportCallback callback) {
  if (result != ledger::Result::LEDGER_OK || !balance_report) {
    callback(result, nullptr);
    return;
  }

  auto monthly_report = ledger::MonthlyReportInfo::New();
  monthly_report->balance = std::move(balance_report);

  const std::string monthly_report_string =
      braveledger_bind_util::FromMonthlyReportToString(
          std::move(monthly_report));

  auto transaction_callback = std::bind(&Report::OnTransactionReport,
      this,
      _1,
      month,
      year,
      monthly_report_string,
      callback);

  ledger_->GetTransactionReport(month, year, transaction_callback);
}

void Report::OnTransactionReport(
    ledger::TransactionReportInfoList transaction_report,
    const ledger::ActivityMonth month,
    const uint32_t year,
    const std::string& monthly_report_string,
    ledger::GetMonthlyReportCallback callback) {

  auto monthly_report = braveledger_bind_util::FromStringToMonthlyReport(
      monthly_report_string);

  if (!monthly_report) {
    callback(ledger::Result::LEDGER_ERROR, nullptr);
    return;
  }

  monthly_report->transactions = std::move(transaction_report);

  const std::string callback_monthly_string =
      braveledger_bind_util::FromMonthlyReportToString(
          std::move(monthly_report));

  auto contribution_callback = std::bind(&Report::OnContributionReport,
      this,
      _1,
      callback_monthly_string,
      callback);

  ledger_->GetContributionReport(month, year, contribution_callback);
}

void Report::OnContributionReport(
    ledger::ContributionReportInfoList contribution_report,
    const std::string& monthly_report_string,
    ledger::GetMonthlyReportCallback callback) {

  auto monthly_report = braveledger_bind_util::FromStringToMonthlyReport(
      monthly_report_string);

  if (!monthly_report) {
    callback(ledger::Result::LEDGER_ERROR, nullptr);
    return;
  }

  monthly_report->contributions = std::move(contribution_report);

  callback(ledger::Result::LEDGER_OK, std::move(monthly_report));
}

}  // namespace braveledger_report
