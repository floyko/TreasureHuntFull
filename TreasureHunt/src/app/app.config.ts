import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './service/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}]
};
