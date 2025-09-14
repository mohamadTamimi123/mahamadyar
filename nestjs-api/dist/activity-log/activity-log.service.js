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
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("./activity-log.entity");
let ActivityLogService = class ActivityLogService {
    activityLogRepository;
    constructor(activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }
    async createActivityLog(data) {
        const activityLog = this.activityLogRepository.create(data);
        return this.activityLogRepository.save(activityLog);
    }
    async getActivityLogsByPersonId(peopleId, limit = 50, offset = 0) {
        return this.activityLogRepository.find({
            where: { people_id: peopleId },
            order: { created_at: 'DESC' },
            take: limit,
            skip: offset,
        });
    }
    async getActivityLogsByPersonIdAndType(peopleId, activityType, limit = 50, offset = 0) {
        return this.activityLogRepository.find({
            where: {
                people_id: peopleId,
                activity_type: activityType,
            },
            order: { created_at: 'DESC' },
            take: limit,
            skip: offset,
        });
    }
    async getActivityLogsCount(peopleId) {
        return this.activityLogRepository.count({
            where: { people_id: peopleId },
        });
    }
    async deleteActivityLog(id) {
        await this.activityLogRepository.delete(id);
    }
    async deleteActivityLogsByPersonId(peopleId) {
        await this.activityLogRepository.delete({ people_id: peopleId });
    }
    async logProfileCompletion(peopleId, profileData, ipAddress, userAgent) {
        return this.createActivityLog({
            people_id: peopleId,
            activity_type: activity_log_entity_1.ActivityType.PROFILE_COMPLETED,
            description: 'پروفایل کاربری تکمیل شد',
            metadata: {
                fields_completed: Object.keys(profileData).filter(key => profileData[key]),
                completion_data: profileData,
            },
            ip_address: ipAddress,
            user_agent: userAgent,
        });
    }
    async logPhotoUpload(peopleId, photoData, ipAddress, userAgent) {
        return this.createActivityLog({
            people_id: peopleId,
            activity_type: activity_log_entity_1.ActivityType.PHOTO_UPLOADED,
            description: 'عکس جدید آپلود شد',
            metadata: {
                photo_id: photoData.id,
                filename: photoData.filename,
                original_name: photoData.original_name,
            },
            ip_address: ipAddress,
            user_agent: userAgent,
        });
    }
    async logProfilePhotoSet(peopleId, photoId, ipAddress, userAgent) {
        return this.createActivityLog({
            people_id: peopleId,
            activity_type: activity_log_entity_1.ActivityType.PROFILE_PHOTO_SET,
            description: 'عکس پروفایل تنظیم شد',
            metadata: {
                photo_id: photoId,
            },
            ip_address: ipAddress,
            user_agent: userAgent,
        });
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map