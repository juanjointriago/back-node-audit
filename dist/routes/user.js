"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controller/user");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', user_1.getAllUsers);
router.get('/:id', validate_jwt_1.validateJWT, user_1.getUserById);
router.post('/', validate_jwt_1.validateJWT, user_1.saveUser);
router.put('/:id', validate_jwt_1.validateJWT, user_1.updateUserById);
router.delete('/:id', validate_jwt_1.validateJWT, user_1.deleteUserById);
exports.default = router;
//# sourceMappingURL=user.js.map