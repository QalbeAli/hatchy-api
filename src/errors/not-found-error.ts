import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}