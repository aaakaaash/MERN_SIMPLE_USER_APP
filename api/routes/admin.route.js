import express from 'express';
import { getDashboard,blockUser,deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', getDashboard);
router.put("/block/:id", blockUser);
router.delete("/delete/:id", deleteUser);

export default router;

