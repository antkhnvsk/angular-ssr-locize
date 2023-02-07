import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  I18NextModule,
  I18NEXT_SERVICE,
  ITranslationService,
} from 'angular-i18next';
import I18NextLocizeBackend from 'i18next-locize-backend';

import { AppComponent } from './app.component';

export function appInit(i18next: ITranslationService) {
  return () => {
    i18next.use(I18NextLocizeBackend);

    const backendOptions = {
      projectId: '0ce585e9-0ca9-42d4-b1a5-60cf6f31771d',
      reloadInterval: false,
    };

    return i18next.init({
      fallbackLng: 'en_GB',
      debug: true,
      returnEmptyString: false,
      ns: [],
      backend: backendOptions,
    });
  };
}

export function localeIdFactory(i18next: ITranslationService) {
  return i18next.language;
}

export const I18N_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [I18NEXT_SERVICE],
    multi: true,
  },
  {
    provide: LOCALE_ID,
    deps: [I18NEXT_SERVICE],
    useFactory: localeIdFactory,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    I18NextModule.forRoot(),
  ],
  providers: [I18N_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
