import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AndvoteAngularAppComponent, environment } from './app/';
import { HTTP_BINDINGS } from '@angular/http';

import { ROUTER_PROVIDERS } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrap(
  AndvoteAngularAppComponent,
 [HTTP_BINDINGS, ROUTER_PROVIDERS]
 );
