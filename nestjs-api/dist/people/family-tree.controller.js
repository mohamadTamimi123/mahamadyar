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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyTreeController = void 0;
const common_1 = require("@nestjs/common");
const family_tree_service_1 = require("./family-tree.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let FamilyTreeController = class FamilyTreeController {
    familyTreeService;
    constructor(familyTreeService) {
        this.familyTreeService = familyTreeService;
    }
    async getAllFamilyTrees() {
        return this.familyTreeService.createFamilyTreeForAllPeople();
    }
    async getFamilyTreeForPerson(id) {
        return this.familyTreeService.createFamilyTreeForPerson(id);
    }
    async getFamilyTreeStats() {
        return this.familyTreeService.getFamilyTreeStats();
    }
    async searchInFamilyTree(searchTerm) {
        if (!searchTerm) {
            return [];
        }
        return this.familyTreeService.searchInFamilyTree(searchTerm);
    }
};
exports.FamilyTreeController = FamilyTreeController;
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyTreeController.prototype, "getAllFamilyTrees", null);
__decorate([
    (0, common_1.Get)('person/:id'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FamilyTreeController.prototype, "getFamilyTreeForPerson", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyTreeController.prototype, "getFamilyTreeStats", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FamilyTreeController.prototype, "searchInFamilyTree", null);
exports.FamilyTreeController = FamilyTreeController = __decorate([
    (0, common_1.Controller)('family-tree'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [family_tree_service_1.FamilyTreeService])
], FamilyTreeController);
//# sourceMappingURL=family-tree.controller.js.map