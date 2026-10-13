import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
