"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const regime_module_1 = require("./regime/regime.module");
const prisma_module_1 = require("../prisma/prisma.module");
const office_module_1 = require("./bureau-sortie/office.module");
const transit_module_1 = require("./maison-transit/transit.module");
const escouade_module_1 = require("./escouade/escouade.module");
const agent_module_1 = require("./agent/agent.module");
const ordre_module_1 = require("./ordre-mission/ordre.module");
const statistics_module_1 = require("./statistique/statistics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            regime_module_1.RegimeModule,
            office_module_1.BureauSortieModule,
            transit_module_1.MaisonTransitModule,
            escouade_module_1.EscouadeModule,
            agent_module_1.AgentModule,
            ordre_module_1.OrdreMissionModule,
            statistics_module_1.StatisticsModule
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map