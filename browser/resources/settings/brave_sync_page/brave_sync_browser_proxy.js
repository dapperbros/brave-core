/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

 cr.define('settings', function() {
  /** @interface */
  class DefaultBraveSyncBrowserProxy {
    /**
     * Function to invoke when the sync page has been navigated to. This
     * registers the UI as the "active" sync UI so that if the user tries to
     * open another sync UI, this one will be shown instead.
     */
    didNavigateToSyncPage() {}
    /**
     * Sets which types of data to sync.
     * @param {!settings.SyncPrefs} syncPrefs
     * @return {!Promise<!settings.PageStatus>}
     */
    setSyncDatatypes(syncPrefs) {}
  }

  /**
   * @implements {settings.DefaultBraveSyncBrowserProxy}
   */
  class DefaultBraveSyncBrowserProxyImpl {
    /** @override */
    didNavigateToSyncPage() {
      chrome.send('SyncSetupShowSetupUI');
    }
    /** @override */
    setSyncDatatypes(syncPrefs) {
      return cr.sendWithPromise(
          'SyncSetupSetDatatypes', JSON.stringify(syncPrefs));
    }
  }

  cr.addSingletonGetter(DefaultBraveSyncBrowserProxyImpl);

  return {
    DefaultBraveSyncBrowserProxy,
    DefaultBraveSyncBrowserProxyImpl
  };
});
