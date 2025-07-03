import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationError } from 'joi';
import { ValidationError as AppValidationError } from '../utils/error';

type RequestPart = 'body' | 'query' | 'params' | 'headers' | 'cookies';

export const validate = (
  schema: any,
  requestPart: RequestPart = 'body'
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[requestPart], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string> = {};
      
      if (error instanceof ValidationError) {
        error.details.forEach((err) => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
      }

      return next(new AppValidationError(errors));
    }

    // Don't modify the request object since req.query is read-only
    // The validated value is available in the 'value' variable if needed
    next();
  };
};
