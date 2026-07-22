import { Component, inject } from '@angular/core';
import { CopilotChat, CopilotKit } from '@copilotkit/angular';

@Component({
  imports: [CopilotChat],
  selector: 'wm-root',
  template: `<copilot-chat />`,
})
export class App {
  private readonly copilotKit = inject(CopilotKit);

  constructor() {
    this.copilotKit.core.subscribe({
      onError: () => {
        alert('Oups! Something went wrong.');
      },
    });
  }
}
