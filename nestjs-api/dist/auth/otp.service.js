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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const people_entity_1 = require("../people/people.entity");
let OtpService = class OtpService {
    peopleRepository;
    otpSessions = new Map();
    constructor(peopleRepository) {
        this.peopleRepository = peopleRepository;
    }
    async validateRegistrationCode(registrationCode) {
        const people = await this.peopleRepository.findOne({
            where: { registration_code: registrationCode }
        });
        if (!people) {
            return { valid: false };
        }
        return { valid: true, people };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    createOtpSession(registrationCode, peopleId) {
        const sessionId = Math.random().toString(36).substring(2, 15);
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        this.otpSessions.set(sessionId, {
            registrationCode,
            peopleId,
            otp,
            expiresAt,
        });
        return sessionId;
    }
    verifyOtp(sessionId, otp) {
        const session = this.otpSessions.get(sessionId);
        if (!session) {
            return false;
        }
        if (new Date() > session.expiresAt) {
            this.otpSessions.delete(sessionId);
            return false;
        }
        if (session.otp !== otp) {
            return false;
        }
        return true;
    }
    getSession(sessionId) {
        const session = this.otpSessions.get(sessionId);
        if (!session) {
            return null;
        }
        if (new Date() > session.expiresAt) {
            this.otpSessions.delete(sessionId);
            return null;
        }
        return session;
    }
    updateSession(sessionId, data) {
        const session = this.otpSessions.get(sessionId);
        if (!session) {
            return false;
        }
        if (new Date() > session.expiresAt) {
            this.otpSessions.delete(sessionId);
            return false;
        }
        this.otpSessions.set(sessionId, { ...session, ...data });
        return true;
    }
    deleteSession(sessionId) {
        this.otpSessions.delete(sessionId);
    }
    getOtpForTesting(sessionId) {
        const session = this.otpSessions.get(sessionId);
        return session ? session.otp : null;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(people_entity_1.People)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map