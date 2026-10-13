import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/user/index.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// Seluruh rute manajemen pengguna hanya dapat diakses oleh Admin
router.use(authenticateToken, requireRole([Role.admin]));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;
