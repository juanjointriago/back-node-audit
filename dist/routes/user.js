"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controller/user");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', user_1.getAllUsers);
router.get('/:id', validate_jwt_1.validateJWT, user_1.getUserById);
router.post('/', [
    (0, express_validator_1.check)('username', 'Username is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Invalid email').isEmail(),
    (0, express_validator_1.check)('profileId', 'Profile id is required').not().isEmpty(),
    (0, express_validator_1.check)('roleId', 'Role id is required').not().isEmpty(),
], validate_jwt_1.validateJWT, user_1.saveUser);
router.put('/:id', [
    (0, express_validator_1.check)('username', 'Username is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Invalid email').isEmail(),
    (0, express_validator_1.check)('profileId', 'Profile id is required').not().isEmpty(),
    (0, express_validator_1.check)('roleId', 'Role id is required').not().isEmpty(),
], validate_jwt_1.validateJWT, user_1.updateUserById);
router.delete('/:id', validate_jwt_1.validateJWT, user_1.deleteUserById);
exports.default = router;
//# sourceMappingURL=user.js.map