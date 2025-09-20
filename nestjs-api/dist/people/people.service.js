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
            relations: ['father', 'children', 'country', 'city', 'familyBranch'],
        });
    }
    async findOne(id) {
        return this.peopleRepository.findOne({
            where: { id },
            relations: ['father', 'children', 'country', 'city', 'familyBranch'],
        });
    }
    async create(peopleData, ipAddress, userAgent) {
        const registrationCode = await this.generateUniqueRegistrationCode();
        console.log('=== PEOPLE CREATE DEBUG ===');
        console.log('Received peopleData:', peopleData);
        console.log('country_id:', peopleData.country_id);
        console.log('city_id:', peopleData.city_id);
        const people = this.peopleRepository.create({
            ...peopleData,
            registration_code: registrationCode,
        });
        console.log('Created people object:', people);
        const savedPeople = await this.peopleRepository.save(people);
        console.log('Saved people:', savedPeople);
        console.log('=== END DEBUG ===');
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
        console.log('=== PEOPLE UPDATE DEBUG ===');
        console.log('Updating person ID:', id);
        console.log('Received peopleData:', peopleData);
        console.log('country_id:', peopleData.country_id);
        console.log('city_id:', peopleData.city_id);
        await this.peopleRepository.update(id, peopleData);
        console.log('Update completed, fetching updated person...');
        const updatedPeople = await this.findOne(id);
        if (!updatedPeople) {
            throw new common_1.NotFoundException(`People with ID ${id} not found`);
        }
        console.log('Updated people:', updatedPeople);
        console.log('=== END UPDATE DEBUG ===');
        return updatedPeople;
    }
    async remove(id) {
        await this.peopleRepository.delete(id);
    }
    async findAllWithFathers() {
        return this.peopleRepository.find({
            relations: ['father', 'country', 'city', 'familyBranch'],
        });
    }
    async findAllWithChildren() {
        return this.peopleRepository.find({
            relations: ['children', 'country', 'city', 'familyBranch'],
        });
    }
    async findByFatherId(fatherId) {
        return this.peopleRepository.find({
            where: { father_id: fatherId },
            relations: ['father', 'children', 'country', 'city', 'familyBranch'],
        });
    }
    async findRootPeople() {
        return this.peopleRepository.find({
            where: { father_id: (0, typeorm_2.IsNull)() },
            relations: ['children', 'country', 'city', 'familyBranch'],
        });
    }
    async findByRegistrationCode(registrationCode) {
        return this.peopleRepository.findOne({
            where: { registration_code: registrationCode },
            relations: ['father', 'children', 'country', 'city', 'familyBranch'],
        });
    }
    async getImmediateFamily(personId) {
        const person = await this.peopleRepository.findOne({
            where: { id: personId },
            relations: ['father', 'spouse', 'children', 'country', 'city', 'familyBranch'],
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
            relations: ['father', 'spouse', 'children', 'country', 'city', 'familyBranch'],
            cache: false,
        });
        console.log('=== FAMILY TREE DEBUG ===');
        console.log('All people from database:', allPeople.length);
        console.log('All people details:', allPeople.map(p => ({
            id: p.id,
            name: p.name,
            last_name: p.last_name,
            father_id: p.father_id,
            spouse_id: p.spouse_id,
            has_father: !!p.father,
            has_spouse: !!p.spouse,
            children_count: p.children?.length || 0
        })));
        const person = allPeople.find(p => p.id === personId);
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${personId} not found`);
        }
        console.log('Main person:', {
            id: person.id,
            name: person.name,
            last_name: person.last_name,
            father_id: person.father_id,
            spouse_id: person.spouse_id
        });
        const familyMembers = [];
        const processedIds = new Set();
        familyMembers.push(person);
        processedIds.add(person.id);
        for (const p of allPeople) {
            if (processedIds.has(p.id))
                continue;
            let isConnected = false;
            for (const familyMember of familyMembers) {
                if (p.id === familyMember.father_id) {
                    isConnected = true;
                    break;
                }
                if (p.id === familyMember.spouse_id) {
                    isConnected = true;
                    break;
                }
                if (familyMember.children?.some(child => child.id === p.id)) {
                    isConnected = true;
                    break;
                }
                if (p.father_id && familyMembers.some(fm => fm.id === p.father_id)) {
                    isConnected = true;
                    break;
                }
                if (p.spouse_id && familyMembers.some(fm => fm.id === p.spouse_id)) {
                    isConnected = true;
                    break;
                }
            }
            if (isConnected) {
                familyMembers.push(p);
                processedIds.add(p.id);
                console.log(`Added connected person: ${p.name} ${p.last_name} (ID: ${p.id})`);
            }
        }
        console.log('=== FINAL RESULT ===');
        console.log('Final family members count:', familyMembers.length);
        console.log('Final family members:', familyMembers.map(f => ({
            id: f.id,
            name: f.name,
            last_name: f.last_name,
            father_id: f.father_id,
            spouse_id: f.spouse_id
        })));
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