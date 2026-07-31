/** HTTP / fake TutorEngine adapters (stubs — Day 4). */

import type { SendTutorMessageInput, SendTutorMessageResult } from '../application';
import type { TutorEngine } from './ports';

export class FakeTutorEngine implements TutorEngine {
  async sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    return {
      reply: {
        id: `fake-${Date.now()}`,
        role: 'assistant',
        content: `Echo (fake): ${input.message}`,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export class HttpTutorEngine implements TutorEngine {
  constructor(private readonly baseUrl: string) {}

  async sendMessage(_input: SendTutorMessageInput): Promise<SendTutorMessageResult> {
    void this.baseUrl;
    throw new Error('HttpTutorEngine is not implemented yet (Day 4)');
  }
}
