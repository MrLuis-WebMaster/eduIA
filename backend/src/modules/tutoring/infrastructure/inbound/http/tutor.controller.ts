import type { NextFunction, Request, Response } from 'express';

import type { GenerateTutorResponse } from '../../../application/use-cases/generate-tutor-response.js';
import { tutorMessageBodySchema } from './tutor.schema.js';

export function createTutorController(useCase: GenerateTutorResponse) {
  return {
    async postMessage(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const body = tutorMessageBodySchema.parse(req.body);
        const result = await useCase.execute({
          message: body.message,
          subject: body.subject,
          difficulty: body.difficulty,
          userRole: body.userRole,
          explanationStyle: body.explanationStyle,
          tutorPersonality: body.tutorPersonality,
          conversation: body.conversation,
        });

        res.status(200).json({
          reply: result.reply,
          provider: result.provider,
          model: result.model ?? null,
          requestId: req.requestId,
        });
      } catch (error) {
        next(error);
      }
    },
  };
}
