import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../errors/http-error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  next();
};