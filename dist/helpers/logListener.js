"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const axios_1 = __importDefault(require("axios"));
class LogListener {
    constructor() {
        this.client = new pg_1.Client({
            connectionString: process.env.DATABASE_URL,
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                console.log('Connected to DATABASE');
                // Escuchamos el canal 'log_inserted'
                this.client.query('LISTEN log_inserted');
                this.client.on('notification', this.handleNotification.bind(this));
            }
            catch (error) {
                console.error('Error connecting to DATABASE:', error);
                yield this.reconnect();
            }
        });
    }
    handleNotification(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (msg.payload) {
                    const logEntry = JSON.parse(msg.payload);
                    console.log('New log entry received:', logEntry);
                    yield this.callSendEmailEndpoint(logEntry);
                }
            }
            catch (error) {
                console.error('Error handling notification:', error);
            }
        });
    }
    callSendEmailEndpoint(logEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = process.env.NOTIFY_EMAIL || ''; // Email de destino
                const htmlEmail = `<p>${logEntry.long_msg}</p>`;
                const subject = `Audit Registered on ${logEntry.entity}`;
                const response = yield axios_1.default.post(`${process.env.BASE_URL}/api/audit/sendEmailLog`, {
                    email,
                    textEmail: logEntry.long_msg,
                    htmlEmail,
                    subject,
                });
                console.log('Email sent successfully:', response.data);
            }
            catch (error) {
                // Manejamos cualquier error en la solicitud HTTP
                console.error('Error calling sendEmail endpoint:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            }
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Attempting to reconnect to PostgreSQL...');
            try {
                // Reintentamos la conexión
                yield this.start();
            }
            catch (error) {
                console.error('Reconnection failed:', error);
                setTimeout(() => this.reconnect(), 5000); // Reintentar después de 5 segundos
            }
        });
    }
}
exports.default = LogListener;
//# sourceMappingURL=logListener.js.map