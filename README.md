# AngularSsrLocize

Project with example of broken behaviour of `i18next-locize-backend` in Angular application with SSR.

To open, please run:

```
npm run dev:ssr
```

And then go to http://localhost:4200/de, and look at page source.

Seeing translation key as content (`login.actionSubmit`) is not a desired behaviour.

```
...
<app-lazy-page _nghost-sc18=""><p _ngcontent-sc18=""> login.actionSubmit
</p></app-lazy-page>
...
```

Then, switching `USE_CUSTOM_PATCHED_BACKEND` to `true` in [./src/app/app.module.ts](./src/app/app.module.ts) we could see the desired behaviour.

```
...
<app-lazy-page _nghost-sc18=""><p _ngcontent-sc18=""> Anmelden
</p></app-lazy-page>
...
```
