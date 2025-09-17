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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const group_entity_1 = require("../groups/group.entity");
let Event = class Event {
    id;
    group_id;
    group;
    type;
    title;
    date;
    location;
    description;
    createdAt;
    updatedAt;
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "group_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_entity_1.Group, (g) => g.events, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", Object)
], Event.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], Event.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256, nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map