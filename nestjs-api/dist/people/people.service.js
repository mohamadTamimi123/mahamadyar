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
const activity_log_service_1 = require("../activity-log/activity-log.service");
let PeopleService = class PeopleService {
    peopleRepository;
    activityLogService;
    constructor(peopleRepository, activityLogService) {
        this.peopleRepository = peopleRepository;
        this.activityLogService = activityLogService;
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
    async create(peopleData, ipAddress, userAgent) {
        const registrationCode = await this.generateUniqueRegistrationCode();
        const people = this.peopleRepository.create({
            ...peopleData,
            registration_code: registrationCode,
        });
        const savedPeople = await this.peopleRepository.save(people);
        if (peopleData.spouse_id) {
            await this.peopleRepository.update(peopleData.spouse_id, {
                spouse_id: savedPeople.id,
            });
            await this.activityLogService.logFamilyMemberAdded(peopleData.spouse_id, savedPeople, ipAddress, userAgent);
        }
        if (peopleData.father_id) {
            await this.activityLogService.logFamilyMemberAdded(peopleData.father_id, savedPeople, ipAddress, userAgent);
        }
        return savedPeople;
    }
    async generateUniqueRegistrationCode() {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            code = `REG${randomNumber}`;
            const existingPerson = await this.peopleRepository.findOne({
                where: { registration_code: code }
            });
            if (!existingPerson) {
                isUnique = true;
            }
        }
        return code;
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
    async findByRegistrationCode(registrationCode) {
        return this.peopleRepository.findOne({
            where: { registration_code: registrationCode },
            relations: ['father', 'children'],
        });
    }
    async getImmediateFamily(personId) {
        const person = await this.peopleRepository.findOne({
            where: { id: personId },
            relations: ['father', 'spouse', 'children'],
        });
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${personId} not found`);
        }
        return {
            person,
            father: person.father,
            spouse: person.spouse,
            children: person.children || [],
        };
    }
    async getFamilyTree(personId) {
        const allPeople = await this.peopleRepository.find({
            relations: ['father', 'spouse', 'children'],
        });
        const person = allPeople.find(p => p.id === personId);
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${personId} not found`);
        }
        const familyMembers = [person];
        const processedIds = new Set([personId]);
        if (person.father && !processedIds.has(person.father.id)) {
            familyMembers.push(person.father);
            processedIds.add(person.father.id);
            if (person.father.spouse && !processedIds.has(person.father.spouse.id)) {
                familyMembers.push(person.father.spouse);
                processedIds.add(person.father.spouse.id);
            }
        }
        if (person.spouse && !processedIds.has(person.spouse.id)) {
            familyMembers.push(person.spouse);
            processedIds.add(person.spouse.id);
            if (person.spouse.father && !processedIds.has(person.spouse.father.id)) {
                familyMembers.push(person.spouse.father);
                processedIds.add(person.spouse.father.id);
            }
        }
        if (person.children && person.children.length > 0) {
            for (const child of person.children) {
                if (!processedIds.has(child.id)) {
                    familyMembers.push(child);
                    processedIds.add(child.id);
                    if (child.spouse && !processedIds.has(child.spouse.id)) {
                        familyMembers.push(child.spouse);
                        processedIds.add(child.spouse.id);
                    }
                }
            }
        }
        return familyMembers;
    }
    async addSpouse(personId, spouseData, ipAddress, userAgent) {
        const person = await this.findOne(personId);
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${personId} not found`);
        }
        const spouse = await this.create({
            name: spouseData.name,
            last_name: spouseData.last_name,
            spouse_id: personId,
        }, ipAddress, userAgent);
        await this.peopleRepository.update(personId, {
            spouse_id: spouse.id,
        });
        await this.activityLogService.logFamilyMemberAdded(personId, spouse, ipAddress, userAgent);
        return spouse;
    }
    async completeProfile(personId, profileData, ipAddress, userAgent) {
        const person = await this.findOne(personId);
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${personId} not found`);
        }
        const updatedData = {
            ...profileData,
            profile_completed: true,
        };
        const updatedPerson = await this.update(personId, updatedData);
        await this.activityLogService.logProfileCompletion(personId, profileData, ipAddress, userAgent);
        return updatedPerson;
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(people_entity_1.People)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], PeopleService);
//# sourceMappingURL=people.service.js.map