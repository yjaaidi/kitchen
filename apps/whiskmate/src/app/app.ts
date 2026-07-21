import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

@Component({
  imports: [CopilotChat],
  selector: 'wm-root',
  template: `<copilot-chat />`,
})
export class App {}
