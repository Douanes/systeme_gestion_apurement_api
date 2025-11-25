"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscouadeModule = void 0;
const common_1 = require("@nestjs/common");
const escouade_controller_1 = require("./escouade.controller");
const escouade_service_1 = require("./escouade.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let EscouadeModule = class EscouadeModule {
};
exports.EscouadeModule = EscouadeModule;
exports.EscouadeModule = EscouadeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [escouade_controller_1.EscouadeController],
        providers: [escouade_service_1.EscouadeService],
        exports: [escouade_service_1.EscouadeService],
    })
], EscouadeModule);
//# sourceMappingURL=escouade.module.js.map