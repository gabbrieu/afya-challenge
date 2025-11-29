export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details: unknown;

  constructor({
    message,
    statusCode,
    details,
  }: {
    message: string;
    statusCode: number;
    details?: unknown;
  }) {
    super(message);
    this.name = 'AppError';
    this.details = details;
    this.statusCode = statusCode;
  }
}
