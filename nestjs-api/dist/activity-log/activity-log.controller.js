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
exports.ActivityLogController = void 0;
const common_1 = require("@nestjs/common");
const activity_log_service_1 = require("./activity-log.service");
const activity_log_entity_1 = require("./activity-log.entity");
let ActivityLogController = class ActivityLogController {
    activityLogService;
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async getActivityLogsByPersonId(peopleId, limit, offset) {
        return this.activityLogService.getActivityLogsByPersonId(peopleId, limit || 50, offset || 0);
    }
    async getActivityLogsCount(peopleId) {
        const count = await this.activityLogService.getActivityLogsCount(peopleId);
        return { count };
    }
    async getActivityLogsByPersonIdAndType(peopleId, activityType, limit, offset) {
        return this.activityLogService.getActivityLogsByPersonIdAndType(peopleId, activityType, limit || 50, offset || 0);
    }
    async createActivityLog(data) {
        return this.activityLogService.createActivityLog(data);
    }
    async deleteActivityLog(id) {
        return this.activityLogService.deleteActivityLog(id);
    }
    async deleteActivityLogsByPersonId(peopleId) {
        return this.activityLogService.deleteActivityLogsByPersonId(peopleId);
    }
};
exports.ActivityLogController = ActivityLogController;
__decorate([
    (0, common_1.Get)('person/:peopleId'),
    __param(0, (0, common_1.Param)('peopleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getActivityLogsByPersonId", null);
__decorate([
    (0, common_1.Get)('person/:peopleId/count'),
    __param(0, (0, common_1.Param)('peopleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getActivityLogsCount", null);
__decorate([
    (0, common_1.Get)('person/:peopleId/type/:activityType'),
    __param(0, (0, common_1.Param)('peopleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('activityType')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getActivityLogsByPersonIdAndType", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "createActivityLog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "deleteActivityLog", null);
__decorate([
    (0, common_1.Delete)('person/:peopleId'),
    __param(0, (0, common_1.Param)('peopleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "deleteActivityLogsByPersonId", null);
exports.ActivityLogController = ActivityLogController = __decorate([
    (0, common_1.Controller)('activity-logs'),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map