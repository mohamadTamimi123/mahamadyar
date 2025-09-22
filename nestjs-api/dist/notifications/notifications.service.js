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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
let NotificationsService = class NotificationsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async listByGroup(group_id) {
        return this.repo.find({
            where: { group_id },
            relations: ['requestedByUser', 'approvedByUser'],
            order: { createdAt: 'DESC' }
        });
    }
    async listApprovedByGroup(group_id) {
        return this.repo.find({
            where: {
                group_id,
                is_approved: true
            },
            relations: ['requestedByUser', 'approvedByUser'],
            order: { createdAt: 'DESC' }
        });
    }
    async create(data) {
        const n = this.repo.create(data);
        return this.repo.save(n);
    }
    async getPendingApprovals() {
        return this.repo.find({
            where: {
                requires_approval: true,
                is_approved: false
            },
            relations: ['requestedByUser', 'group'],
            order: { createdAt: 'DESC' }
        });
    }
    async getUserGroupNotifications(userId) {
        const query = this.repo
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.group', 'group')
            .leftJoinAndSelect('notification.requestedByUser', 'requestedByUser')
            .leftJoinAndSelect('notification.approvedByUser', 'approvedByUser')
            .leftJoin('group_members', 'gm', 'gm.group_id = group.id')
            .where('notification.is_approved = :isApproved', { isApproved: true })
            .andWhere('gm.user_id = :userId', { userId })
            .orderBy('notification.createdAt', 'DESC');
        return query.getMany();
    }
    async approveNotification(notificationId, approverId, approved, notes) {
        const notification = await this.repo.findOne({
            where: { id: notificationId },
            relations: ['requestedByUser']
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (!notification.requires_approval) {
            throw new common_1.NotFoundException('This notification does not require approval');
        }
        if (notification.is_approved) {
            throw new common_1.NotFoundException('This notification has already been processed');
        }
        notification.is_approved = approved;
        notification.approved_by_user_id = approverId;
        notification.approval_notes = notes || null;
        notification.approved_at = new Date();
        return this.repo.save(notification);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map