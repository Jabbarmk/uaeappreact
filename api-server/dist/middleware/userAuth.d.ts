import { Request, Response, NextFunction } from 'express';
export declare function requireUser(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireAdminOrStaff(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
