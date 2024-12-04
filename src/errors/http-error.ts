export class HttpError extends Error {
  status: number;

  constructor(message: string = "HTTPError") {
    super(message);
    this.name = "HTTPError";
    this.status = 404;
  }
}