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
exports.FamilyBranchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const family_branch_entity_1 = require("./family-branch.entity");
const people_entity_1 = require("../people/people.entity");
let FamilyBranchService = class FamilyBranchService {
    familyBranchRepository;
    peopleRepository;
    constructor(familyBranchRepository, peopleRepository) {
        this.familyBranchRepository = familyBranchRepository;
        this.peopleRepository = peopleRepository;
    }
    async create(createData) {
        const branch = this.familyBranchRepository.create(createData);
        return this.familyBranchRepository.save(branch);
    }
    async findAll() {
        return this.familyBranchRepository.find({
            relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByUser(userId) {
        return this.familyBranchRepository.find({
            where: { created_by_user_id: userId },
            relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        return this.familyBranchRepository.findOne({
            where: { id },
            relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members']
        });
    }
    async update(id, updateData) {
        await this.familyBranchRepository.update(id, updateData);
        return this.findOne(id);
    }
    async delete(id) {
        await this.familyBranchRepository.delete(id);
    }
    async addMemberToBranch(branchId, personId) {
        const branch = await this.findOne(branchId);
        const person = await this.peopleRepository.findOne({ where: { id: personId } });
        if (!branch || !person) {
            return null;
        }
        person.family_branch_id = branchId;
        await this.peopleRepository.save(person);
        return this.findOne(branchId);
    }
    async removeMemberFromBranch(branchId, personId) {
        const person = await this.peopleRepository.findOne({
            where: { id: personId, family_branch_id: branchId }
        });
        if (!person) {
            return null;
        }
        person.family_branch_id = undefined;
        await this.peopleRepository.save(person);
        return this.findOne(branchId);
    }
    async getBranchHierarchy() {
        return this.familyBranchRepository.find({
            where: { parent_branch_id: (0, typeorm_2.IsNull)() },
            relations: ['createdByUser', 'rootPerson', 'subBranches', 'members'],
            order: { generation_level: 'ASC', name: 'ASC' }
        });
    }
    async getBranchStats() {
        const totalBranches = await this.familyBranchRepository.count();
        const activeBranches = await this.familyBranchRepository.count({ where: { is_active: true } });
        const branchesWithMembers = await this.familyBranchRepository
            .createQueryBuilder('branch')
            .leftJoin('branch.members', 'members')
            .select('branch.id')
            .addSelect('COUNT(members.id)', 'memberCount')
            .groupBy('branch.id')
            .getRawMany();
        const totalMembers = branchesWithMembers.reduce((sum, branch) => sum + parseInt(branch.memberCount), 0);
        const averageMembersPerBranch = branchesWithMembers.length > 0 ? totalMembers / branchesWithMembers.length : 0;
        return {
            totalBranches,
            activeBranches,
            totalMembers,
            averageMembersPerBranch: Math.round(averageMembersPerBranch * 100) / 100
        };
    }
};
exports.FamilyBranchService = FamilyBranchService;
exports.FamilyBranchService = FamilyBranchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(family_branch_entity_1.FamilyBranch)),
    __param(1, (0, typeorm_1.InjectRepository)(people_entity_1.People)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FamilyBranchService);
//# sourceMappingURL=family-branch.service.js.map