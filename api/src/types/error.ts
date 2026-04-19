export class BaseError extends Error {
  public StatusCode: number;
  public message: string;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.StatusCode = statusCode;
  }
}

export class AccessError extends BaseError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class InputError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}
