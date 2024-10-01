import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionService } from './app/services/session.service';

import { Capacitor } from '@capacitor/core';
import { Stripe } from '@capacitor-community/stripe';
import { environment } from './environments/environment';

if (Capacitor.isNativePlatform()) {
  Stripe.initialize({
    publishableKey: environment.stripe.publishableKey,
  });
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      IonicModule.forRoot({}),
      BrowserAnimationsModule,
    ),
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    Storage, // Proveedor para el almacenamiento
    SessionService, // Proveedor para el servicio de sesión
  ],
});
