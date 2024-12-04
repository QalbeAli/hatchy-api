import { HttpError } from "./http-error";

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}