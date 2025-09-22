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
const group_service_1 = require("../groups/group.service");
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
            return this.notifications.listApprovedByGroup(+group_id);
        }
        return [];
    }
    async create(req, body) {
        const user = req.user;
        if (!(user.role === 'admin' || user.role === 'branch_manager')) {
            throw new common_1.ForbiddenException('Only admins and branch managers can create notifications directly. Regular users should use request-approval endpoint.');
        }
        return this.notifications.create({
            group_id: body.group_id ?? null,
            type: body.type,
            title: body.title,
            body: body.body ?? null,
            metadata: body.metadata ?? null,
            requires_approval: false,
            is_approved: true,
            requested_by_user_id: user.id,
        });
    }
    async createForMyGroup(req, body) {
        const user = req.user;
        if (!(user.role === 'branch_manager' || user.role === 'admin')) {
            throw new common_1.ForbiddenException('Only group leaders or admins can send notifications');
        }
        return this.notifications.create({
            group_id: null,
            type: body.type,
            title: body.title,
            body: body.body ?? null,
            metadata: body.metadata ?? null,
            requires_approval: false,
            is_approved: true,
            requested_by_user_id: user.id,
        });
    }
    async requestNotificationApproval(req, body) {
        const user = req.user;
        if (user.role === 'admin' || user.role === 'branch_manager') {
            throw new common_1.ForbiddenException('Admins and branch managers do not need approval');
        }
        const group = await this.groups.findOne(body.group_id);
        if (!group) {
            throw new common_1.ForbiddenException('Group not found');
        }
        const isMember = group.members.some(member => member.id === user.id);
        if (!isMember && group.created_by_user_id !== user.id) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
        return this.notifications.create({
            group_id: body.group_id,
            type: body.type,
            title: body.title,
            body: body.body ?? null,
            metadata: body.metadata ?? null,
            requires_approval: true,
            is_approved: false,
            requested_by_user_id: user.id,
        });
    }
    async getPendingApprovals(req) {
        const user = req.user;
        if (!(user.role === 'branch_manager' || user.role === 'admin')) {
            throw new common_1.ForbiddenException('Only branch managers and admins can view pending approvals');
        }
        return this.notifications.getPendingApprovals();
    }
    async getMyGroupNotifications(req) {
        const user = req.user;
        return this.notifications.getUserGroupNotifications(user.id);
    }
    async approveNotification(id, req, body) {
        const user = req.user;
        if (!(user.role === 'branch_manager' || user.role === 'admin')) {
            throw new common_1.ForbiddenException('Only branch managers and admins can approve notifications');
        }
        return this.notifications.approveNotification(id, user.id, body.approved, body.notes);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('request-approval'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "requestNotificationApproval", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pending-approvals'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-group'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMyGroupNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "approveNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        group_service_1.GroupService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map