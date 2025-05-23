import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).send({
    message: "Not Found",
  });
};