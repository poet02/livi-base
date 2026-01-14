import Joi, { Schema } from "joi";

import { Request, Response, NextFunction } from "express";
const validateRequest = (schema: Schema, source: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = source === 'query' ? req.query : req.body;
    const { error } = schema.validate(dataToValidate);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details, message } = error;
      const messages = details.map(i => i.message).join(",");

      console.log("error", messages);
      res.status(400).json({ error: messages, msg: message });
    }
  };
};
export default validateRequest;
