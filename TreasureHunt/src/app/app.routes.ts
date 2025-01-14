import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BoxesComponent } from './boxes/boxes.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "game", component: BoxesComponent},
    { path: "settings", component: SettingsComponent},
];
