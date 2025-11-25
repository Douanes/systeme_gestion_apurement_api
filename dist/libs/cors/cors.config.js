"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsConfig = getCorsConfig;
function getCorsConfig() {
    return {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With'
        ],
        exposedHeaders: ['Authorization'],
        maxAge: 3600
    };
}
//# sourceMappingURL=cors.config.js.map