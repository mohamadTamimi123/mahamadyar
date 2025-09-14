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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = exports.ActivityType = void 0;
const typeorm_1 = require("typeorm");
const people_entity_1 = require("../people/people.entity");
var ActivityType;
(function (ActivityType) {
    ActivityType["PROFILE_CREATED"] = "profile_created";
    ActivityType["PROFILE_UPDATED"] = "profile_updated";
    ActivityType["PROFILE_COMPLETED"] = "profile_completed";
    ActivityType["PHOTO_UPLOADED"] = "photo_uploaded";
    ActivityType["PHOTO_DELETED"] = "photo_deleted";
    ActivityType["PROFILE_PHOTO_SET"] = "profile_photo_set";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
let ActivityLog = class ActivityLog {
    id;
    people_id;
    activity_type;
    description;
    metadata;
    ip_address;
    user_agent;
    people;
    created_at;
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ActivityLog.prototype, "people_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityType,
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "activity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ip_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "user_agent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => people_entity_1.People, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'people_id' }),
    __metadata("design:type", people_entity_1.People)
], ActivityLog.prototype, "people", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "created_at", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs')
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map