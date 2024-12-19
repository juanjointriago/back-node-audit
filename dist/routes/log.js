"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_1 = require("../controller/log");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', validate_jwt_1.validateJWT, log_1.getLogs);
exports.default = router;
//# sourceMappingURL=log.js.map