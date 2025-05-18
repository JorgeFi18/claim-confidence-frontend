import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Mostrar la configuración actual
console.log('Environment:', environment);
console.log('API URL:', environment.apiUrl);
console.log('Production mode:', environment.production);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
