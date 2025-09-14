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
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const photo_entity_1 = require("./photo.entity");
const user_entity_1 = require("../user/user.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let PhotoService = class PhotoService {
    photoRepository;
    userRepository;
    constructor(photoRepository, userRepository) {
        this.photoRepository = photoRepository;
        this.userRepository = userRepository;
    }
    async create(createPhotoDto, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('کاربر یافت نشد');
        }
        if (createPhotoDto.is_profile_picture) {
            await this.photoRepository.update({ user_id: userId, is_profile_picture: true }, { is_profile_picture: false });
        }
        const photo = this.photoRepository.create({
            ...createPhotoDto,
            user_id: userId,
        });
        return this.photoRepository.save(photo);
    }
    async findAllByUser(userId) {
        return this.photoRepository.find({
            where: { user_id: userId, is_active: true },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const photo = await this.photoRepository.findOne({
            where: { id, user_id: userId },
        });
        if (!photo) {
            throw new common_1.NotFoundException('عکس یافت نشد');
        }
        return photo;
    }
    async update(id, updatePhotoDto, userId) {
        const photo = await this.findOne(id, userId);
        if (updatePhotoDto.is_profile_picture) {
            await this.photoRepository.update({ user_id: userId, is_profile_picture: true }, { is_profile_picture: false });
        }
        Object.assign(photo, updatePhotoDto);
        return this.photoRepository.save(photo);
    }
    async remove(id, userId) {
        const photo = await this.findOne(id, userId);
        try {
            if (fs.existsSync(photo.file_path)) {
                fs.unlinkSync(photo.file_path);
            }
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
        await this.photoRepository.remove(photo);
    }
    async getProfilePicture(userId) {
        return this.photoRepository.findOne({
            where: { user_id: userId, is_profile_picture: true, is_active: true },
        });
    }
    async getAllPhotos() {
        return this.photoRepository.find({
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async getPhotosByUser(userId) {
        return this.photoRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }
    async ensureUploadDir() {
        const uploadDir = path.join(process.cwd(), 'uploads', 'photos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        return uploadDir;
    }
    generateUniqueFilename(originalName) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(originalName);
        return `${timestamp}_${randomString}${extension}`;
    }
};
exports.PhotoService = PhotoService;
exports.PhotoService = PhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PhotoService);
//# sourceMappingURL=photo.service.js.map