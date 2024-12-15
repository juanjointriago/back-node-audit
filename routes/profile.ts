import { Router } from "express";
import {getAllProfiles, getProfileById, saveProfile, updateProfileById, deleteProfileById} from "../controller/profile";
import { validateJWT } from "../middlewares/validate-jwt";

const router = Router();

router.get('/', getAllProfiles);
router.get('/:id', 
    validateJWT,
    getProfileById);
router.post('/', 
    validateJWT,
    saveProfile);
router.put('/:id', 
    validateJWT,
    updateProfileById);
router.delete('/:id', 
    validateJWT,
    deleteProfileById);

export default router;