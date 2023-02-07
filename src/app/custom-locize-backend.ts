import { ReadCallback } from 'i18next';
import LocizeBackend from 'i18next-locize-backend';

const EMPTY_INTERVAL_MS = 100;

export class CustomLocizeBackend extends LocizeBackend {
  override loadUrl(url: string, options: any, cb: ReadCallback) {
    //
    // This is to fix bug with empty localizations in SSR.
    //
    // Angular zone doesn't know about `i18next-locize-backend` requests,
    // because `i18next-locize-backend` doesn't use Angular httpClient.
    // SSR render ends when ApplicationRef.IsStable emits true,
    // and that is happenes before Locize backend response.
    // To wait for it's response we're adding setInterval here.
    // ApplicationRef.IsStable will always be false, while we have unfinished setInterval.
    //
    const intervalId = setInterval(() => {}, EMPTY_INTERVAL_MS);

    const customCallback: ReadCallback = (...cbArguments) => {
      clearInterval(intervalId);
      cb(...cbArguments);
    };

    return super.loadUrl(url, options, customCallback);
  }
}
