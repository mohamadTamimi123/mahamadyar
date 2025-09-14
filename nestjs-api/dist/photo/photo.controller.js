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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPhotoController = exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photo_service_1 = require("./photo.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let PhotoController = class PhotoController {
    photoService;
    constructor(photoService) {
        this.photoService = photoService;
    }
    async uploadPhoto(file, body, req) {
        if (!file) {
            throw new common_1.BadRequestException('فایل انتخاب نشده است');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('نوع فایل پشتیبانی نمی‌شود');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('حجم فایل بیش از حد مجاز است (5MB)');
        }
        const uploadDir = await this.photoService.ensureUploadDir();
        const filename = this.photoService.generateUniqueFilename(file.originalname);
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        const createPhotoDto = {
            filename,
            original_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            file_path: filePath,
            description: body.description,
            is_profile_picture: body.is_profile_picture === 'true',
        };
        return this.photoService.create(createPhotoDto, req.user.id);
    }
    async findAll(req) {
        return this.photoService.findAllByUser(req.user.id);
    }
    async getProfilePicture(req) {
        return this.photoService.getProfilePicture(req.user.id);
    }
    async findOne(id, req) {
        return this.photoService.findOne(+id, req.user.id);
    }
    async update(id, updatePhotoDto, req) {
        return this.photoService.update(+id, updatePhotoDto, req.user.id);
    }
    async remove(id, req) {
        await this.photoService.remove(+id, req.user.id);
        return { message: 'عکس با موفقیت حذف شد' };
    }
    async getPhotoFile(id, req, res) {
        const photo = await this.photoService.findOne(+id, req.user.id);
        if (!fs.existsSync(photo.file_path)) {
            throw new common_1.BadRequestException('فایل یافت نشد');
        }
        res.setHeader('Content-Type', photo.mime_type);
        res.setHeader('Content-Disposition', `inline; filename="${photo.original_name}"`);
        const fileStream = fs.createReadStream(photo.file_path);
        fileStream.pipe(res);
    }
    async getPublicPhotoFile(id, res) {
        const photo = await this.photoService.findPublicPhoto(+id);
        if (!photo) {
            throw new common_1.BadRequestException('عکس یافت نشد');
        }
        if (!fs.existsSync(photo.file_path)) {
            throw new common_1.BadRequestException('فایل یافت نشد');
        }
        res.setHeader('Content-Type', photo.mime_type);
        res.setHeader('Content-Disposition', `inline; filename="${photo.original_name}"`);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        const fileStream = fs.createReadStream(photo.file_path);
        fileStream.pipe(res);
    }
};
exports.PhotoController = PhotoController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getProfilePicture", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('file/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPhotoFile", null);
__decorate([
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPublicPhotoFile", null);
exports.PhotoController = PhotoController = __decorate([
    (0, common_1.Controller)('photos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], PhotoController);
let AdminPhotoController = class AdminPhotoController {
    photoService;
    constructor(photoService) {
        this.photoService = photoService;
    }
    async findAll() {
        return this.photoService.getAllPhotos();
    }
    async findByUser(userId) {
        return this.photoService.getPhotosByUser(+userId);
    }
    async uploadPhotoForUser(file, body, req) {
        if (!file) {
            throw new common_1.BadRequestException('فایل انتخاب نشده است');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('نوع فایل پشتیبانی نمی‌شود');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('حجم فایل بیش از حد مجاز است (5MB)');
        }
        const uploadDir = await this.photoService.ensureUploadDir();
        const filename = this.photoService.generateUniqueFilename(file.originalname);
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        const createPhotoDto = {
            filename,
            original_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            file_path: filePath,
            description: body.description,
            is_profile_picture: body.is_profile_picture === 'true',
        };
        return this.photoService.create(createPhotoDto, +body.user_id);
    }
};
exports.AdminPhotoController = AdminPhotoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPhotoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPhotoController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPhotoController.prototype, "uploadPhotoForUser", null);
exports.AdminPhotoController = AdminPhotoController = __decorate([
    (0, common_1.Controller)('admin/photos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], AdminPhotoController);
//# sourceMappingURL=photo.controller.js.map