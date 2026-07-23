import { Component, effect, inject, viewChild } from '@angular/core';
import { CopilotChat, CopilotKit, injectAgentStore } from '@copilotkit/angular';

@Component({
  imports: [CopilotChat],
  selector: 'wm-root',
  template: `<copilot-chat #chat />`,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }
  `,
})
export class App {
  private readonly _copilotKit = inject(CopilotKit);
  private readonly _chat = viewChild.required<CopilotChat>('chat');
  private readonly _store = injectAgentStore('default');

  constructor() {
    effect(() => this._chat()?.inputValue.set('What are my favorite recipes?'));

    effect(() => console.log(this._store().state()));

    this._copilotKit.core.subscribe({
      onError: () => {
        alert('Oups! Something went wrong.');
      },
    });
  }
}
