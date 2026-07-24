import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth/auth-guard';
import { Chat } from './chat/chat';
import { SignIn } from './sign-in/sign-in';

export const appRoutes: Routes = [
  {
    path: 'sign-in',
    component: SignIn,
    canActivate: [guestGuard],
    title: 'Sign in · Whiskmate',
  },
  {
    path: '',
    component: Chat,
    canActivate: [authGuard],
    title: 'Whiskmate',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
