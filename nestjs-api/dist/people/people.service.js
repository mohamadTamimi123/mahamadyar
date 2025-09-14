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
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const people_entity_1 = require("./people.entity");
let PeopleService = class PeopleService {
    peopleRepository;
    constructor(peopleRepository) {
        this.peopleRepository = peopleRepository;
    }
    async findAll() {
        return this.peopleRepository.find({
            relations: ['father', 'children'],
        });
    }
    async findOne(id) {
        return this.peopleRepository.findOne({
            where: { id },
            relations: ['father', 'children'],
        });
    }
    async create(peopleData) {
        const people = this.peopleRepository.create(peopleData);
        return this.peopleRepository.save(people);
    }
    async update(id, peopleData) {
        await this.peopleRepository.update(id, peopleData);
        const updatedPeople = await this.findOne(id);
        if (!updatedPeople) {
            throw new common_1.NotFoundException(`People with ID ${id} not found`);
        }
        return updatedPeople;
    }
    async remove(id) {
        await this.peopleRepository.delete(id);
    }
    async findAllWithFathers() {
        return this.peopleRepository.find({
            relations: ['father'],
        });
    }
    async findAllWithChildren() {
        return this.peopleRepository.find({
            relations: ['children'],
        });
    }
    async findByFatherId(fatherId) {
        return this.peopleRepository.find({
            where: { father_id: fatherId },
            relations: ['father', 'children'],
        });
    }
    async findRootPeople() {
        return this.peopleRepository.find({
            where: { father_id: (0, typeorm_2.IsNull)() },
            relations: ['children'],
        });
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(people_entity_1.People)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PeopleService);
//# sourceMappingURL=people.service.js.map