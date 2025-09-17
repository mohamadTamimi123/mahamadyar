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
exports.Group = void 0;
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("../notifications/notification.entity");
const event_entity_1 = require("../events/event.entity");
let Group = class Group {
    id;
    country;
    city;
    name;
    leader_user_id;
    notifications;
    events;
    createdAt;
    updatedAt;
};
exports.Group = Group;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Group.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Group.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Group.prototype, "leader_user_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (n) => n.group),
    __metadata("design:type", Array)
], Group.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => event_entity_1.Event, (e) => e.group),
    __metadata("design:type", Array)
], Group.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Group.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Group.prototype, "updatedAt", void 0);
exports.Group = Group = __decorate([
    (0, typeorm_1.Entity)('groups')
], Group);
//# sourceMappingURL=group.entity.js.map