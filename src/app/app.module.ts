import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  I18NextModule,
  I18NEXT_SERVICE,
  ITranslationService,
} from 'angular-i18next';
import I18NextLocizeBackend, {
  CustomRequestOptions,
  RequestCallback,
  RequestResponse,
} from 'i18next-locize-backend';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { AppComponent } from './app.component';
import { CustomLocizeBackend } from './custom-locize-backend';
import { LazyPageComponent } from './lazy-page/lazy-page.component';

// Lazy translations are not worked in SSR with default `i18next-locize-backend`.
// Using `true` here we could look at desired behaviour.
// It's done by patching `loadUrl` method from `i18next-locize-backend` lib.
const USE_CUSTOM_PATCHED_BACKEND = false;

export function appInit(i18next: ITranslationService, httpClient: HttpClient) {
  return () => {
    i18next.use(
      USE_CUSTOM_PATCHED_BACKEND ? CustomLocizeBackend : I18NextLocizeBackend
    );

    const locizeBackendOptions = {
      projectId: '0ce585e9-0ca9-42d4-b1a5-60cf6f31771d',
      reloadInterval: false,
      request: promisedRequestWithHttpClient(httpClient),
    };

    return i18next.init({
      fallbackLng: 'en_GB',
      debug: false,
      ns: [],
      backend: locizeBackendOptions,
    });
  };
}

export const I18N_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [I18NEXT_SERVICE, HttpClient],
    multi: true,
  },
];

export function promisedRequestWithHttpClient(
  httpClient: HttpClient
): (
  info: CustomRequestOptions,
  callback: RequestCallback
) => Promise<RequestResponse> {
  return ({ url, body, headers, method }: CustomRequestOptions) => {
    const httpHeaders = new HttpHeaders();
    Object.keys(headers).forEach((key) => httpHeaders.set(key, headers[key]));

    return lastValueFrom(
      httpClient
        .request(method, url, {
          body: body ? JSON.stringify(body) : undefined,
          headers: httpHeaders,
        })
        .pipe(
          map((data) => ({ status: 200, data })),
          catchError((error) => of({ status: error.status, data: null as any }))
        )
    );
  };
}

@NgModule({
  declarations: [AppComponent, LazyPageComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([
      {
        path: ':lang',
        component: LazyPageComponent,
      },
    ]),
    HttpClientModule,
    I18NextModule.forRoot(),
  ],
  providers: [I18N_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
