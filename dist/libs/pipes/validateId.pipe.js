"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUUIDPipe = void 0;
const common_1 = require("@nestjs/common");
let ValidateUUIDPipe = class ValidateUUIDPipe {
    transform(value) {
        if (!this.isValidUUID(value)) {
            throw new common_1.BadRequestException('Validation failed (UUID is expected)');
        }
        return value;
    }
    isValidUUID(value) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
};
exports.ValidateUUIDPipe = ValidateUUIDPipe;
exports.ValidateUUIDPipe = ValidateUUIDPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateUUIDPipe);
//# sourceMappingURL=validateId.pipe.js.map