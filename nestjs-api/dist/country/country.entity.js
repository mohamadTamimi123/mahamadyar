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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("../city/city.entity");
let Country = class Country {
    id;
    name;
    iso_code;
    capital;
    population;
    area;
    region;
    subregion;
    flag_url;
    currency_code;
    currency_name;
    language_code;
    language_name;
    cities;
    createdAt;
    updatedAt;
};
exports.Country = Country;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Country.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 3 }),
    __metadata("design:type", String)
], Country.prototype, "iso_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "capital", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'bigint' }),
    __metadata("design:type", Number)
], Country.prototype, "population", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Country.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "subregion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "flag_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "currency_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "currency_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "language_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Country.prototype, "language_name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => city_entity_1.City, city => city.country),
    __metadata("design:type", Array)
], Country.prototype, "cities", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Country.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Country.prototype, "updatedAt", void 0);
exports.Country = Country = __decorate([
    (0, typeorm_1.Entity)('countries')
], Country);
//# sourceMappingURL=country.entity.js.map