"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BureauSortieModule = void 0;
const common_1 = require("@nestjs/common");
const office_service_1 = require("./office.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const office_controller_1 = require("./office.controller");
let BureauSortieModule = class BureauSortieModule {
};
exports.BureauSortieModule = BureauSortieModule;
exports.BureauSortieModule = BureauSortieModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [office_controller_1.BureauSortieController],
        providers: [office_service_1.BureauSortieService],
        exports: [office_service_1.BureauSortieService],
    })
], BureauSortieModule);
//# sourceMappingURL=office.module.js.map