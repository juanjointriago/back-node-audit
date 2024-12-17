import { Router } from "express";
import { login } from "../controller/auth";
import { check} from "express-validator";
const router = Router();

router.post('/login', 
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    login);

export default router;
