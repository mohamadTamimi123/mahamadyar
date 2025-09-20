"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function dropTables() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        console.log('🗑️ Dropping existing tables...');
        await dataSource.dropDatabase();
        await dataSource.synchronize();
        console.log('✅ Tables dropped and recreated successfully!');
    }
    catch (error) {
        console.error('❌ Error dropping tables:', error);
    }
    finally {
        await app.close();
    }
}
dropTables();
//# sourceMappingURL=drop-tables.js.map