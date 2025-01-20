"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const validate_fields_1 = require("../middlewares/validate-fields");
const audit_1 = require("../controller/audit");
const router = (0, express_1.Router)();
router.get('/getEntities', validate_jwt_1.validateJWT, audit_1.getEntities);
router.post('/active-audit', [
    (0, express_validator_1.check)('entity', 'Entity is required').not().isEmpty(),
    validate_fields_1.validateFields
], validate_jwt_1.validateJWT, audit_1.activeTrigger);
router.post('/inactive-audit', [
    (0, express_validator_1.check)('entity', 'Entity is required').not().isEmpty(),
    validate_fields_1.validateFields
], validate_jwt_1.validateJWT, audit_1.inactiveTrigger);
router.post('/active-Notify', [
    (0, express_validator_1.check)('entity', 'Entity is required').not().isEmpty(),
    validate_fields_1.validateFields
], validate_jwt_1.validateJWT, audit_1.activeNotify);
router.post('/inactive-Notify', [
    (0, express_validator_1.check)('entity', 'Entity is required').not().isEmpty(),
    validate_fields_1.validateFields
], validate_jwt_1.validateJWT, audit_1.inactiveNotify);
router.post('/sendEmailLog', [
    (0, express_validator_1.check)('emails', 'Email is required').not().isEmpty(),
    validate_fields_1.validateFields
], audit_1.sendEmailLog);
exports.default = router;
//# sourceMappingURL=audit.js.map