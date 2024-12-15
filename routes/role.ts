import { Router } from "express";
import {getAllRoles, getRoleById, saveRole, updateRoleById, deleteRoleById} from "../controller/role";
import { validateJWT } from "../middlewares/validate-jwt";

const router = Router();

router.get('/', getAllRoles);
router.get('/:id',
    validateJWT,
    getRoleById);
router.post('/', 
    validateJWT,
    saveRole);
router.put('/:id', 
    validateJWT,
    updateRoleById);
router.delete('/:id', 
    validateJWT,
    deleteRoleById);

export default router;