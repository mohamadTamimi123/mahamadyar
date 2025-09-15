"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./user.entity");
const people_entity_1 = require("../people/people.entity");
const photo_entity_1 = require("../photo/photo.entity");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs_db',
    entities: [user_entity_1.User, people_entity_1.People, photo_entity_1.Photo],
    synchronize: false,
});
async function main() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(user_entity_1.User);
    const email = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';
    const plainPassword = process.env.SUPERADMIN_PASSWORD || 'ChangeMe123!';
    let user = await repo.findOne({ where: { email } });
    const hashed = await bcrypt.hash(plainPassword, 10);
    if (!user) {
        user = repo.create({ email, name, password: hashed, role: 'admin' });
        await repo.save(user);
        console.log(`Created super admin: ${email}`);
    }
    else {
        user.name = name;
        user.password = hashed;
        user.role = 'admin';
        await repo.save(user);
        console.log(`Updated existing super admin: ${email}`);
    }
    await AppDataSource.destroy();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-super-admin.js.map