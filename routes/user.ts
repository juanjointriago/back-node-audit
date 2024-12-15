import { Router } from "express";
import {  getAllUsers, getUserById, saveUser, updateUserById, deleteUserById} from "../controller/user";
import { validateJWT } from "../middlewares/validate-jwt";

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', 
    validateJWT,
    getUserById);
router.post('/', 
    validateJWT,
    saveUser);
router.put('/:id', 
    validateJWT,
    updateUserById);
router.delete('/:id', 
    validateJWT,
    deleteUserById);

export default router;