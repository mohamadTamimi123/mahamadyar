"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const people_module_1 = require("./people/people.module");
const auth_module_1 = require("./auth/auth.module");
const photo_module_1 = require("./photo/photo.module");
const activity_log_module_1 = require("./activity-log/activity-log.module");
const groups_module_1 = require("./groups/groups.module");
const notifications_module_1 = require("./notifications/notifications.module");
const events_module_1 = require("./events/events.module");
const country_module_1 = require("./country/country.module");
const city_module_1 = require("./city/city.module");
const family_branch_module_1 = require("./family-branch/family-branch.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', ''),
                    database: configService.get('DB_DATABASE', 'nestjs_db'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                }),
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            people_module_1.PeopleModule,
            auth_module_1.AuthModule,
            photo_module_1.PhotoModule,
            activity_log_module_1.ActivityLogModule,
            groups_module_1.GroupsModule,
            notifications_module_1.NotificationsModule,
            events_module_1.EventsModule,
            country_module_1.CountryModule,
            city_module_1.CityModule,
            family_branch_module_1.FamilyBranchModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map