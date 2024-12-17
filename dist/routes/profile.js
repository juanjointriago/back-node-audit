"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_1 = require("../controller/profile");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', profile_1.getAllProfiles);
router.get('/:id', validate_jwt_1.validateJWT, profile_1.getProfileById);
router.post('/', validate_jwt_1.validateJWT, profile_1.saveProfile);
router.put('/:id', validate_jwt_1.validateJWT, profile_1.updateProfileById);
router.delete('/:id', validate_jwt_1.validateJWT, profile_1.deleteProfileById);
exports.default = router;
//# sourceMappingURL=profile.js.map