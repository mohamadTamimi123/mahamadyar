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
exports.PeopleController = void 0;
const common_1 = require("@nestjs/common");
const people_service_1 = require("./people.service");
let PeopleController = class PeopleController {
    peopleService;
    constructor(peopleService) {
        this.peopleService = peopleService;
    }
    async findAll(withParam) {
        if (withParam === 'fathers') {
            return this.peopleService.findAllWithFathers();
        }
        else if (withParam === 'children') {
            return this.peopleService.findAllWithChildren();
        }
        else if (withParam === 'root') {
            return this.peopleService.findRootPeople();
        }
        return this.peopleService.findAll();
    }
    async findOne(id) {
        const people = await this.peopleService.findOne(id);
        if (!people) {
            throw new common_1.NotFoundException(`People with ID ${id} not found`);
        }
        return people;
    }
    async findByFatherId(fatherId) {
        return this.peopleService.findByFatherId(fatherId);
    }
    async create(peopleData) {
        return this.peopleService.create(peopleData);
    }
    async update(id, peopleData) {
        return this.peopleService.update(id, peopleData);
    }
    async remove(id) {
        return this.peopleService.remove(id);
    }
};
exports.PeopleController = PeopleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('with')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('father/:fatherId'),
    __param(0, (0, common_1.Param)('fatherId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "findByFatherId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "remove", null);
exports.PeopleController = PeopleController = __decorate([
    (0, common_1.Controller)('people'),
    __metadata("design:paramtypes", [people_service_1.PeopleService])
], PeopleController);
//# sourceMappingURL=people.controller.js.map