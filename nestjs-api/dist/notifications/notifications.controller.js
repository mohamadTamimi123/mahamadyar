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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const groups_service_1 = require("../groups/groups.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NotificationsController = class NotificationsController {
    notifications;
    groups;
    constructor(notifications, groups) {
        this.notifications = notifications;
        this.groups = groups;
    }
    async list(group_id) {
        if (group_id) {
            return this.notifications.listByGroup(+group_id);
        }
        return [];
    }
    async create(body) {
        return this.notifications.create({
            group_id: body.group_id ?? null,
            type: body.type,
            title: body.title,
            body: body.body ?? null,
            metadata: body.metadata ?? null,
        });
    }
    async createForMyGroup(req, body) {
        const user = req.user;
        if (!(user.role === 'branch_manager' || user.role === 'admin')) {
            throw new common_1.ForbiddenException('Only group leaders or admins can send notifications');
        }
        const country = body.country || 'IR';
        const city = body.city || 'Tehran';
        const group = await this.groups.findOrCreate(country, city, user.role === 'branch_manager' ? user.id : null);
        if (user.role === 'branch_manager' && group.leader_user_id && group.leader_user_id !== user.id) {
            throw new common_1.ForbiddenException('You are not the leader of this group');
        }
        return this.notifications.create({
            group_id: group.id,
            type: body.type,
            title: body.title,
            body: body.body ?? null,
            metadata: body.metadata ?? null,
        });
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('group_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createForMyGroup", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        groups_service_1.GroupsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map