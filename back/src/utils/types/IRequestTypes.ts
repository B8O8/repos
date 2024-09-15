declare global {
  namespace Express {
    interface Request {
      userId: number;
      isAdmin: boolean;
    }
  }
}

import { Request } from "express";

export interface MulterRequest extends Request {
  file?: any;
}

export type IRequestUser = {
  userId: number;
  isAdmin: boolean;
};
