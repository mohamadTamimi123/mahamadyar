"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyBranchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const family_branch_controller_1 = require("./family-branch.controller");
const family_branch_service_1 = require("./family-branch.service");
const family_branch_entity_1 = require("./family-branch.entity");
const people_entity_1 = require("../people/people.entity");
let FamilyBranchModule = class FamilyBranchModule {
};
exports.FamilyBranchModule = FamilyBranchModule;
exports.FamilyBranchModule = FamilyBranchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([family_branch_entity_1.FamilyBranch, people_entity_1.People]),
        ],
        controllers: [family_branch_controller_1.FamilyBranchController],
        providers: [family_branch_service_1.FamilyBranchService],
        exports: [family_branch_service_1.FamilyBranchService],
    })
], FamilyBranchModule);
//# sourceMappingURL=family-branch.module.js.map