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
exports.People = void 0;
const typeorm_1 = require("typeorm");
let People = class People {
    id;
    name;
    last_name;
    registration_code;
    father_id;
    spouse_id;
    father;
    children;
    spouse;
    spouseOf;
    createdAt;
    updatedAt;
};
exports.People = People;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], People.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], People.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], People.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], People.prototype, "registration_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], People.prototype, "father_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], People.prototype, "spouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => People, (people) => people.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'father_id' }),
    __metadata("design:type", People)
], People.prototype, "father", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => People, (people) => people.father),
    __metadata("design:type", Array)
], People.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => People, (people) => people.spouse, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'spouse_id' }),
    __metadata("design:type", People)
], People.prototype, "spouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => People, (people) => people.spouse),
    __metadata("design:type", Array)
], People.prototype, "spouseOf", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], People.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], People.prototype, "updatedAt", void 0);
exports.People = People = __decorate([
    (0, typeorm_1.Entity)('people')
], People);
//# sourceMappingURL=people.entity.js.map