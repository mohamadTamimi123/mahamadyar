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
exports.FamilyBranch = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const people_entity_1 = require("../people/people.entity");
let FamilyBranch = class FamilyBranch {
    id;
    name;
    description;
    generation_level;
    branch_color;
    is_active;
    created_by_user_id;
    root_person_id;
    parent_branch_id;
    createdByUser;
    rootPerson;
    parentBranch;
    subBranches;
    members;
    createdAt;
    updatedAt;
};
exports.FamilyBranch = FamilyBranch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FamilyBranch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FamilyBranch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FamilyBranch.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FamilyBranch.prototype, "generation_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FamilyBranch.prototype, "branch_color", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], FamilyBranch.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FamilyBranch.prototype, "created_by_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FamilyBranch.prototype, "root_person_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FamilyBranch.prototype, "parent_branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.familyBranches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_user_id' }),
    __metadata("design:type", user_entity_1.User)
], FamilyBranch.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => people_entity_1.People, people => people.familyBranches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'root_person_id' }),
    __metadata("design:type", people_entity_1.People)
], FamilyBranch.prototype, "rootPerson", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyBranch, branch => branch.subBranches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_branch_id' }),
    __metadata("design:type", FamilyBranch)
], FamilyBranch.prototype, "parentBranch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FamilyBranch, branch => branch.parentBranch),
    __metadata("design:type", Array)
], FamilyBranch.prototype, "subBranches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => people_entity_1.People, people => people.familyBranch),
    __metadata("design:type", Array)
], FamilyBranch.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FamilyBranch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FamilyBranch.prototype, "updatedAt", void 0);
exports.FamilyBranch = FamilyBranch = __decorate([
    (0, typeorm_1.Entity)('family_branches')
], FamilyBranch);
//# sourceMappingURL=family-branch.entity.js.map