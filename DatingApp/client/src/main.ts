import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


// import { bootstrapApplication } from '@angular/platform-browser';
// import { importProvidersFrom } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { App } from './app/app';
// import { appConfig } from './app/app.config';

// bootstrapApplication(App, {
//   ...appConfig,
//   providers: [
//     ...(appConfig.providers || []),
//     importProvidersFrom(BrowserAnimationsModule)
//   ]
// }).catch((err) => console.error(err));
