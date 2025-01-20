import { Router } from "express";
import { check} from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt";
import { validateFields } from "../middlewares/validate-fields";
import { activeTrigger, inactiveTrigger, getEntities, activeNotify, inactiveNotify, sendEmailLog } from '../controller/audit';
const router = Router();

router.get('/getEntities', 
    validateJWT,
    getEntities);
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
router.post('/active-Notify',
    [
        check('entity', 'Entity is required').not().isEmpty(),
        validateFields
    ],
    validateJWT,
    activeNotify
)
router.post('/inactive-Notify',
    [
        check('entity', 'Entity is required').not().isEmpty(),
        validateFields
    ],
    validateJWT,
    inactiveNotify
)
router.post('/sendEmailLog',
    [
        check('emails', 'Email is required').not().isEmpty(),
        validateFields
    ],
    sendEmailLog
)

export default router;