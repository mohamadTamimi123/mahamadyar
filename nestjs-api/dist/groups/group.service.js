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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const group_entity_1 = require("./group.entity");
const user_entity_1 = require("../user/user.entity");
const notification_entity_1 = require("../notifications/notification.entity");
let GroupService = class GroupService {
    groupRepository;
    userRepository;
    notificationRepository;
    constructor(groupRepository, userRepository, notificationRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }
    async findAll() {
        return this.groupRepository.find({
            relations: ['createdByUser', 'members', 'notifications'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        return this.groupRepository.findOne({
            where: { id },
            relations: ['createdByUser', 'members', 'notifications'],
        });
    }
    async findByUser(userId) {
        return this.groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.createdByUser', 'createdByUser')
            .leftJoinAndSelect('group.members', 'members')
            .leftJoinAndSelect('group.notifications', 'notifications')
            .where('group.created_by_user_id = :userId', { userId })
            .orWhere('members.id = :userId', { userId })
            .orderBy('group.createdAt', 'DESC')
            .getMany();
    }
    async create(groupData) {
        let inviteCode;
        if (groupData.is_private) {
            inviteCode = await this.generateUniqueInviteCode();
        }
        const group = this.groupRepository.create({
            ...groupData,
            invite_code: inviteCode,
        });
        const savedGroup = await this.groupRepository.save(group);
        await this.addMember(savedGroup.id, groupData.created_by_user_id);
        const result = await this.findOne(savedGroup.id);
        if (!result) {
            throw new Error('Failed to retrieve created group');
        }
        return result;
    }
    async update(id, groupData, userId) {
        const group = await this.findOne(id);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${id} not found`);
        }
        if (group.created_by_user_id !== userId) {
            throw new common_1.ForbiddenException('Only the group creator can update the group');
        }
        await this.groupRepository.update(id, groupData);
        const result = await this.findOne(id);
        if (!result) {
            throw new common_1.NotFoundException(`Group with ID ${id} not found`);
        }
        return result;
    }
    async delete(id, userId) {
        const group = await this.findOne(id);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${id} not found`);
        }
        if (group.created_by_user_id !== userId) {
            throw new common_1.ForbiddenException('Only the group creator can delete the group');
        }
        await this.groupRepository.delete(id);
    }
    async addMember(groupId, userId, requesterId, requesterRole) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['members'],
        });
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const isGroupCreator = group.created_by_user_id === requesterId;
        const isBranchManager = requesterRole === 'branch_manager';
        const isAdmin = requesterRole === 'admin';
        if (!isGroupCreator && !isBranchManager && !isAdmin) {
            throw new common_1.ForbiddenException('Only group creators, branch managers, or admins can add members');
        }
        const isAlreadyMember = group.members.some(member => member.id === userId);
        if (isAlreadyMember) {
            const result = await this.findOne(groupId);
            if (!result) {
                throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
            }
            return result;
        }
        group.members.push(user);
        await this.groupRepository.save(group);
        const result = await this.findOne(groupId);
        if (!result) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return result;
    }
    async removeMember(groupId, userId, requesterId) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['members'],
        });
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        if (group.created_by_user_id !== requesterId && userId !== requesterId) {
            throw new common_1.ForbiddenException('Only the group creator or the member themselves can remove members');
        }
        group.members = group.members.filter(member => member.id !== userId);
        await this.groupRepository.save(group);
        const result = await this.findOne(groupId);
        if (!result) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return result;
    }
    async joinByInviteCode(inviteCode, userId) {
        const group = await this.groupRepository.findOne({
            where: { invite_code: inviteCode, is_private: true },
            relations: ['members'],
        });
        if (!group) {
            throw new common_1.NotFoundException('Invalid invite code');
        }
        return this.addMember(group.id, userId);
    }
    async sendNotification(groupId, notificationData, senderId) {
        const group = await this.findOne(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        const isMember = group.members.some(member => member.id === senderId);
        if (!isMember && group.created_by_user_id !== senderId) {
            throw new common_1.ForbiddenException('Only group members can send notifications');
        }
        const notification = this.notificationRepository.create({
            ...notificationData,
            group_id: groupId,
        });
        return this.notificationRepository.save(notification);
    }
    async getGroupNotifications(groupId, userId) {
        const group = await this.findOne(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        const isMember = group.members.some(member => member.id === userId);
        if (!isMember && group.created_by_user_id !== userId) {
            throw new common_1.ForbiddenException('Only group members can view notifications');
        }
        return this.notificationRepository.find({
            where: { group_id: groupId },
            order: { createdAt: 'DESC' }
        });
    }
    async generateUniqueInviteCode() {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const existingGroup = await this.groupRepository.findOne({
                where: { invite_code: code }
            });
            if (!existingGroup) {
                isUnique = true;
            }
        }
        return code;
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GroupService);
//# sourceMappingURL=group.service.js.map