import { verifyToken } from './verifyUser.js';
import { errorHandler } from './error.js';


export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        
        if (!req.user || !req.user.isAdmin) {
            return next(errorHandler(403, 'Access denied. Admins only.'));
        }
        
        next();
    });
};