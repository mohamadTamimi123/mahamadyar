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
exports.FamilyTreeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const people_entity_1 = require("./people.entity");
let FamilyTreeService = class FamilyTreeService {
    peopleRepository;
    constructor(peopleRepository) {
        this.peopleRepository = peopleRepository;
    }
    async createFamilyTreeForPerson(personId) {
        const person = await this.peopleRepository.findOne({
            where: { id: personId },
            relations: ['father', 'spouse', 'children', 'photos']
        });
        if (!person) {
            return null;
        }
        return this.buildFamilyTreeNode(person);
    }
    async createFamilyTreeForAllPeople() {
        const rootPeople = await this.peopleRepository.find({
            where: { father_id: null },
            relations: ['father', 'spouse', 'children', 'photos']
        });
        return Promise.all(rootPeople.map(person => this.buildFamilyTreeNode(person)));
    }
    async buildFamilyTreeNode(person) {
        const node = {
            id: person.id,
            name: person.name,
            last_name: person.last_name,
            birth_date: person.birth_date,
            birth_place: person.birth_place,
            job: person.job,
            current_location: person.current_location,
            profile_photo: person.profile_photo,
            profile_completed: person.profile_completed,
            children: [],
            spouse: undefined,
            father: undefined
        };
        if (person.spouse) {
            node.spouse = {
                id: person.spouse.id,
                name: person.spouse.name,
                last_name: person.spouse.last_name,
                birth_date: person.spouse.birth_date,
                birth_place: person.spouse.birth_place,
                job: person.spouse.job,
                current_location: person.spouse.current_location,
                profile_photo: person.spouse.profile_photo,
                profile_completed: person.spouse.profile_completed,
                children: [],
                spouse: undefined,
                father: undefined
            };
        }
        if (person.father) {
            node.father = {
                id: person.father.id,
                name: person.father.name,
                last_name: person.father.last_name,
                birth_date: person.father.birth_date,
                birth_place: person.father.birth_place,
                job: person.father.job,
                current_location: person.father.current_location,
                profile_photo: person.father.profile_photo,
                profile_completed: person.father.profile_completed,
                children: [],
                spouse: undefined,
                father: undefined
            };
        }
        if (person.children && person.children.length > 0) {
            node.children = await Promise.all(person.children.map(child => this.buildFamilyTreeNode(child)));
        }
        return node;
    }
    async getFamilyTreeStats() {
        const totalPeople = await this.peopleRepository.count();
        const rootPeople = await this.peopleRepository.count({ where: { father_id: null } });
        const completedProfiles = await this.peopleRepository.count({ where: { profile_completed: true } });
        const familiesWithChildren = await this.peopleRepository
            .createQueryBuilder('person')
            .leftJoin('person.children', 'children')
            .select('person.id')
            .addSelect('COUNT(children.id)', 'childrenCount')
            .where('person.father_id IS NULL')
            .groupBy('person.id')
            .having('COUNT(children.id) > 0')
            .getRawMany();
        const totalChildren = familiesWithChildren.reduce((sum, family) => sum + parseInt(family.childrenCount), 0);
        const averageChildrenPerFamily = familiesWithChildren.length > 0 ? totalChildren / familiesWithChildren.length : 0;
        return {
            totalPeople,
            totalFamilies: rootPeople,
            averageChildrenPerFamily: Math.round(averageChildrenPerFamily * 100) / 100,
            completedProfiles
        };
    }
    async searchInFamilyTree(searchTerm) {
        const people = await this.peopleRepository
            .createQueryBuilder('person')
            .leftJoinAndSelect('person.father', 'father')
            .leftJoinAndSelect('person.spouse', 'spouse')
            .leftJoinAndSelect('person.children', 'children')
            .leftJoinAndSelect('person.photos', 'photos')
            .where('person.name ILIKE :search OR person.last_name ILIKE :search OR person.job ILIKE :search OR person.current_location ILIKE :search', {
            search: `%${searchTerm}%`
        })
            .getMany();
        return Promise.all(people.map(person => this.buildFamilyTreeNode(person)));
    }
};
exports.FamilyTreeService = FamilyTreeService;
exports.FamilyTreeService = FamilyTreeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(people_entity_1.People)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FamilyTreeService);
//# sourceMappingURL=family-tree.service.js.map