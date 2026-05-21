import { Request, Response, NextFunction } from 'express';

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) return res.status(401).json({ error: 'Login required' });
  next();
}

export function requireAdminOrStaff(req: Request, res: Response, next: NextFunction) {
  const type = (req.session as any).userType;
  if (type !== 'admin' && type !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  next();
}
