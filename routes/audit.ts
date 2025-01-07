import { Router } from "express";
import { check} from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt";
import { validateFields } from "../middlewares/validate-fields";
import { activeTrigger, inactiveTrigger } from '../controller/audit';
const router = Router();

router.post('/active-audit',
    [
        check('entity', 'Entity is required').not().isEmpty(),
        validateFields
    ],
    validateJWT,
    activeTrigger);
router.post('/inactive-audit',
    [
        check('entity', 'Entity is required').not().isEmpty(),
        validateFields
    ],
    validateJWT,
    inactiveTrigger);

export default router;