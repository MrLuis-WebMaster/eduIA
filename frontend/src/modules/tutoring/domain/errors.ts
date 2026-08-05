/** Domain-layer validation / invariant errors (mapped to AppError at the edge). */

export class DomainError extends Error {
  readonly code: 'VALIDATION';

  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = 'VALIDATION';
  }
}
