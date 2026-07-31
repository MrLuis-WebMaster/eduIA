/** Tutoring ports (stubs — Day 4). */

import type { SendTutorMessageInput, SendTutorMessageResult } from '../application';

export interface TutorEngine {
  sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult>;
}
