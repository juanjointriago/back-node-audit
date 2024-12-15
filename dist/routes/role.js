"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_1 = require("../controller/role");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', role_1.getAllRoles);
router.get('/:id', validate_jwt_1.validateJWT, role_1.getRoleById);
router.post('/', validate_jwt_1.validateJWT, role_1.saveRole);
router.put('/:id', validate_jwt_1.validateJWT, role_1.updateRoleById);
router.delete('/:id', validate_jwt_1.validateJWT, role_1.deleteRoleById);
exports.default = router;
//# sourceMappingURL=role.js.map