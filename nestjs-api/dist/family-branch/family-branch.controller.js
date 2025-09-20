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
exports.FamilyBranchController = void 0;
const common_1 = require("@nestjs/common");
const family_branch_service_1 = require("./family-branch.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let FamilyBranchController = class FamilyBranchController {
    familyBranchService;
    constructor(familyBranchService) {
        this.familyBranchService = familyBranchService;
    }
    async create(createData) {
        return this.familyBranchService.create(createData);
    }
    async findAll() {
        return this.familyBranchService.findAll();
    }
    async findByUser(userId) {
        return this.familyBranchService.findByUser(userId);
    }
    async getHierarchy() {
        return this.familyBranchService.getBranchHierarchy();
    }
    async getStats() {
        return this.familyBranchService.getBranchStats();
    }
    async findOne(id) {
        return this.familyBranchService.findOne(id);
    }
    async update(id, updateData) {
        return this.familyBranchService.update(id, updateData);
    }
    async delete(id) {
        await this.familyBranchService.delete(id);
        return { message: 'شاخه خانوادگی با موفقیت حذف شد' };
    }
    async addMember(branchId, personId) {
        return this.familyBranchService.addMemberToBranch(branchId, personId);
    }
    async removeMember(branchId, personId) {
        return this.familyBranchService.removeMemberFromBranch(branchId, personId);
    }
};
exports.FamilyBranchController = FamilyBranchController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('hierarchy'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "getHierarchy", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/members/:personId'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('personId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:personId'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('personId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FamilyBranchController.prototype, "removeMember", null);
exports.FamilyBranchController = FamilyBranchController = __decorate([
    (0, common_1.Controller)('family-branches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [family_branch_service_1.FamilyBranchService])
], FamilyBranchController);
//# sourceMappingURL=family-branch.controller.js.map