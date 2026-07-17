"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
function requireAdmin(req, res, next) {
    const session = req.session;
    if (!session.adminId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
