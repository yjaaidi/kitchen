import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormField,
  FormRoot,
  form,
  required,
  submit,
} from '@angular/forms/signals';
import { Auth } from '../auth/auth';

@Component({
  selector: 'wm-sign-in',
  imports: [FormField, FormRoot],
  template: `
    <section class="sign-in">
      <h1>Whiskmate</h1>
      <p>Choose a username to start cooking.</p>
      <form
        class="sign-in-form"
        [formRoot]="signInForm"
        (submit)="signIn($event)"
      >
        <label>
          Username
          <input id="username" type="text" [formField]="signInForm.username" />
        </label>
        @if (
          signInForm.username().touched() &&
          signInForm.username().errors().length
        ) {
          <span class="error">{{
            signInForm.username().errors()[0].message
          }}</span>
        }
        <button type="submit" [disabled]="signInForm().invalid()">
          Continue
        </button>
      </form>
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .sign-in {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background:
        radial-gradient(circle at top, rgb(255 255 255 / 72%), transparent 55%),
        #faf8f6;
      color: #3f2f2a;
      font-family: system-ui, sans-serif;
    }

    .sign-in h1 {
      margin: 0;
      font-size: 2rem;
      letter-spacing: 0.02em;
    }

    .sign-in p {
      margin: 0 0 0.5rem;
      color: #6b5b55;
    }

    .sign-in-form {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      width: min(100%, 20rem);
    }

    .sign-in-form label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font:
        600 0.8125rem/1.2 system-ui,
        sans-serif;
      letter-spacing: 0.04em;
      color: #6b5b55;
    }

    .sign-in-form input {
      appearance: none;
      border: 1px solid rgb(63 47 42 / 16%);
      border-radius: 0.625rem;
      padding: 0.7rem 0.85rem;
      font:
        400 0.9375rem/1.3 system-ui,
        sans-serif;
      color: #3f2f2a;
      background: #fff;
    }

    .sign-in-form input:focus {
      outline: 2px solid rgb(36 133 88 / 35%);
      outline-offset: 1px;
    }

    .sign-in-form .error {
      font:
        500 0.75rem/1.3 system-ui,
        sans-serif;
      color: #8a3b3b;
    }

    .sign-in-form button {
      appearance: none;
      border: none;
      border-radius: 0.625rem;
      padding: 0.7rem 1.1rem;
      font:
        600 0.8125rem/1.2 system-ui,
        sans-serif;
      letter-spacing: 0.04em;
      cursor: pointer;
      background: linear-gradient(180deg, #2f9d6a 0%, #248558 100%);
      color: #fff;
      box-shadow:
        0 1px 0 rgb(255 255 255 / 18%) inset,
        0 1px 2px rgb(20 80 50 / 28%);
    }

    .sign-in-form button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class SignIn {
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);

  readonly signInModel = signal({ username: '' });
  readonly signInForm = form(this.signInModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });
  });

  protected signIn(event: Event) {
    event.preventDefault();
    submit(this.signInForm, async () => {
      this._auth.signIn(this.signInModel().username);
      await this._router.navigateByUrl('/');
    });
  }
}
