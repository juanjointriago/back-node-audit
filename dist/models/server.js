"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../routes/user"));
const profile_1 = __importDefault(require("../routes/profile"));
const role_1 = __importDefault(require("../routes/role"));
const auth_1 = __importDefault(require("../routes/auth"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.apiPaths = {
            users: '/api/users',
            profiles: '/api/profiles',
            roles: '/api/roles',
            auth: '/api/auth'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.users, user_1.default);
        this.app.use(this.apiPaths.profiles, profile_1.default);
        this.app.use(this.apiPaths.roles, role_1.default);
        this.app.use(this.apiPaths.auth, auth_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server iniciado: ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map