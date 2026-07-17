"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = requireUser;
exports.requireAdminOrStaff = requireAdminOrStaff;
function requireUser(req, res, next) {
    if (!req.session.userId)
        return res.status(401).json({ error: 'Login required' });
    next();
}
function requireAdminOrStaff(req, res, next) {
    const type = req.session.userType;
    if (type !== 'admin' && type !== 'staff')
        return res.status(403).json({ error: 'Forbidden' });
    next();
}
