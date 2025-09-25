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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invite_request_entity_1 = require("./invite-request.entity");
const auth_service_1 = require("./auth.service");
const otp_service_1 = require("./otp.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    otpService;
    inviteRepo;
    constructor(authService, otpService, inviteRepo) {
        this.authService = authService;
        this.otpService = otpService;
        this.inviteRepo = inviteRepo;
    }
    async validateRegistrationCode(body) {
        const result = await this.otpService.validateRegistrationCode(body.registrationCode);
        if (!result.valid || !result.people) {
            return { valid: false, message: 'کد ثبت نام نامعتبر است' };
        }
        const sessionId = this.otpService.createOtpSession(body.registrationCode, result.people.id);
        return {
            valid: true,
            sessionId,
            people: {
                name: result.people.name,
                last_name: result.people.last_name,
            },
            otp: this.otpService.getOtpForTesting(sessionId),
        };
    }
    async verifyOtp(body) {
        const isValid = this.otpService.verifyOtp(body.sessionId, body.otp);
        if (!isValid) {
            return { valid: false, message: 'کد OTP نامعتبر یا منقضی شده است' };
        }
        return { valid: true };
    }
    async completeRegistration(body) {
        const session = this.otpService.getSession(body.sessionId);
        if (!session) {
            return { success: false, message: 'جلسه منقضی شده است' };
        }
        this.otpService.updateSession(body.sessionId, { email: body.email });
        const registerDto = {
            email: body.email,
            name: session.name || '',
            password: body.password,
            phone: session.phone,
            registrationCode: session.registrationCode,
            country_id: body.country_id,
            city_id: body.city_id,
        };
        const result = await this.authService.register(registerDto);
        this.otpService.deleteSession(body.sessionId);
        return result;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async requestInvite(body) {
        const req = this.inviteRepo.create({
            name: body?.name,
            email: body?.email,
            message: body?.message ?? null,
            status: 'pending',
        });
        await this.inviteRepo.save(req);
        return { success: true, id: req.id };
    }
    async listInviteRequests() {
        const items = await this.inviteRepo.find({ order: { createdAt: 'DESC' } });
        return { items };
    }
    async getProfile(req) {
        return req.user;
    }
    async updateProfile(req, body) {
        const userId = req.user.id;
        const updatedUser = await this.authService.updateProfile(userId, body);
        return { success: true, user: updatedUser };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('validate-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateRegistrationCode", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('complete-registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeRegistration", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('request-invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestInvite", null);
__decorate([
    (0, common_1.Get)('invite-requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "listInviteRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update-profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(2, (0, typeorm_1.InjectRepository)(invite_request_entity_1.InviteRequest)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        otp_service_1.OtpService,
        typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map