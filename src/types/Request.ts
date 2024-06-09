/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

import { User } from '../models/user'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}