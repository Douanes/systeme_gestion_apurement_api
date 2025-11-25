"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundResponseDto = exports.ConflictResponseDto = exports.ErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400, description: 'HTTP status code' }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Validation failed', description: 'Error message summary' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            field1: ['Field1 is required.'],
            field2: ['Field2 must be a valid email.'],
        },
        description: 'Detailed validation errors',
    }),
    __metadata("design:type", Object)
], ErrorResponseDto.prototype, "errors", void 0);
class ConflictResponseDto {
}
exports.ConflictResponseDto = ConflictResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 409, description: 'HTTP status code' }),
    __metadata("design:type", Number)
], ConflictResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ce nom existe déjà', description: 'Error message summary' }),
    __metadata("design:type", String)
], ConflictResponseDto.prototype, "message", void 0);
class NotFoundResponseDto {
}
exports.NotFoundResponseDto = NotFoundResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 404, description: 'HTTP status code' }),
    __metadata("design:type", Number)
], NotFoundResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Not found', description: 'Error message summary' }),
    __metadata("design:type", String)
], NotFoundResponseDto.prototype, "message", void 0);
//# sourceMappingURL=error-response.dto.js.map