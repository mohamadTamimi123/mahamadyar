import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-member.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createFamilyMemberDto: { name: string; family_name: string; father_id?: number }): Promise<FamilyMember> {
    const familyMember = this.familyMemberRepository.create(createFamilyMemberDto);
    familyMember.invite_code = this.generateInviteCode();
    return this.familyMemberRepository.save(familyMember);
  }

  // تولید کد دعوت منحصر به فرد
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async findAll(): Promise<FamilyMember[]> {
    const members = await this.familyMemberRepository.find({
      relations: ['father', 'children']
    });
    
    // برای هر عضو، اگر پدر دارد، نام پدر را از relation پر کن
    members.forEach(member => {
      if (member.father) {
        member.father_name = member.father.name;
      }
    });
    
    return members;
  }

  async findOne(id: number): Promise<FamilyMember | null> {
    return this.familyMemberRepository.findOne({ where: { id } });
  }

  async update(id: number, updateFamilyMemberDto: { name?: string; family_name?: string; father_id?: number }): Promise<FamilyMember | null> {
    await this.familyMemberRepository.update(id, updateFamilyMemberDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.familyMemberRepository.delete(id);
  }

  // ایمپورت فقط نام‌ها از JSON
  async importNamesFromJson(jsonData: any[]): Promise<{ imported: number; errors: any[] }> {
    let imported = 0;
    const errors: any[] = [];

    for (const item of jsonData) {
      try {
        if (!item.personName) {
          errors.push({ blockId: item.blockId, error: 'Missing person name', item });
          continue;
        }

        const familyMember = this.familyMemberRepository.create({
          name: item.personName,
        });

        await this.familyMemberRepository.save(familyMember);
        imported++;
      } catch (error) {
        errors.push({
          blockId: item.blockId,
          error: error.message,
          item,
        });
      }
    }

    return { imported, errors };
  }

  // دریافت تعداد کل اعضا
  async getTotalCount(): Promise<number> {
    return this.familyMemberRepository.count();
  }

  // جستجو بر اساس نام
  async searchByName(searchTerm: string): Promise<FamilyMember[]> {
    return this.familyMemberRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.father', 'father')
      .leftJoinAndSelect('family.children', 'children')
      .where('family.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();
  }

  // دریافت درخت خانوادگی کامل
  async getFamilyTree(): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      relations: ['father', 'children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // دریافت فقط ریشه‌های درخت (کسانی که پدر ندارند)
  async getRootMembers(): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      where: { father_id: undefined },
      relations: ['children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // دریافت فرزندان یک شخص
  async getChildren(parentId: number): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      where: { father_id: parentId },
      relations: ['children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // ایجاد رابطه پدر-فرزندی
  async setParent(childId: number, parentId: number): Promise<FamilyMember | null> {
    const child = await this.findOne(childId);
    const parent = await this.findOne(parentId);
    
    if (!child || !parent) {
      return null;
    }

    child.father_id = parentId;
    child.father_name = parent.name;
    
    return this.familyMemberRepository.save(child);
  }

  // ویرایش نام پدر برای یک عضو
  async updateFatherName(memberId: number, fatherName: string): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.father_name = fatherName;
    
    return this.familyMemberRepository.save(member);
  }

  // حذف رابطه پدر-فرزندی
  async removeParent(memberId: number): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.father_id = null;
    member.father_name = null;
    
    return this.familyMemberRepository.save(member);
  }

  // تولید کد دعوت جدید برای یک عضو
  async generateNewInviteCode(memberId: number): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.invite_code = this.generateInviteCode();
    return this.familyMemberRepository.save(member);
  }

  // پیدا کردن عضو بر اساس کد دعوت
  async findByInviteCode(inviteCode: string): Promise<FamilyMember | null> {
    const member = await this.familyMemberRepository.findOne({ 
      where: { invite_code: inviteCode },
      relations: ['father', 'children']
    });
    
    // اگر عضو پیدا شد و پدر دارد، نام پدر را از relation پر کن
    if (member && member.father) {
      member.father_name = member.father.name;
    }
    
    return member;
  }

  // ادیت کامل عضو
  async editMember(memberId: number, editData: { name?: string; family_name?: string; father_id?: number | null }): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    // بروزرسانی نام
    if (editData.name !== undefined) {
      member.name = editData.name;
    }

    // بروزرسانی نام خانوادگی
    if (editData.family_name !== undefined) {
      member.family_name = editData.family_name;
    }

    // بروزرسانی رابطه پدر-فرزندی
    if (editData.father_id !== undefined) {
      if (editData.father_id === null) {
        // حذف رابطه پدر-فرزندی
        member.father_id = null;
        member.father_name = null;
      } else {
        // تنظیم پدر جدید
        const father = await this.findOne(editData.father_id);
        if (father) {
          member.father_id = editData.father_id;
          member.father_name = father.name;
        }
      }
    }

    return this.familyMemberRepository.save(member);
  }

  // ============= Users management (Admin) =============
  async listUsers(): Promise<Array<User & { member?: FamilyMember }>> {
    return this.userRepository.find({ relations: ['member'] });
  }

  async getUserById(id: number): Promise<(User & { member?: FamilyMember }) | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['member'] });
  }

  async setUserVerified(id: number, isVerified: boolean): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    user.is_verified = isVerified;
    await this.userRepository.save(user);
    return { success: true, message: isVerified ? 'کاربر فعال شد' : 'کاربر غیرفعال شد' };
  }

  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    await this.userRepository.delete(id);
    return { success: true, message: 'کاربر حذف شد' };
  }

  // جستجوی اعضا
  async searchMembers(query: string): Promise<FamilyMember[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const members = await this.familyMemberRepository
        .createQueryBuilder('member')
        .where('member.name ILIKE :query', { query: `%${query}%` })
        .orWhere('member.father_name ILIKE :query', { query: `%${query}%` })
        .orderBy('member.name', 'ASC')
        .limit(20)
        .getMany();

      return members;
    } catch (error) {
      console.error('خطا در جستجوی اعضا:', error);
      return [];
    }
  }

  // Profile management methods
  async updateProfileImage(id: number, profileImage: string): Promise<{ success: boolean; message: string }> {
    try {
      const member = await this.familyMemberRepository.findOne({ where: { id } });
      if (!member) {
        return { success: false, message: 'عضو خانواده یافت نشد' };
      }

      member.profile_image = profileImage;
      await this.familyMemberRepository.save(member);

      // Also update user profile if exists
      const user = await this.userRepository.findOne({ where: { member: { id } } });
      if (user) {
        user.profile_image = profileImage;
        await this.userRepository.save(user);
      }

      return { success: true, message: 'عکس پروفایل با موفقیت به‌روزرسانی شد' };
    } catch (error) {
      console.error('خطا در به‌روزرسانی عکس پروفایل:', error);
      return { success: false, message: 'خطا در به‌روزرسانی عکس پروفایل' };
    }
  }

  async updateNationalId(id: number, nationalId: string): Promise<{ success: boolean; message: string }> {
    try {
      const member = await this.familyMemberRepository.findOne({ where: { id } });
      if (!member) {
        return { success: false, message: 'عضو خانواده یافت نشد' };
      }

      // Check if national ID already exists
      const existingMember = await this.familyMemberRepository.findOne({ 
        where: { national_id: nationalId } 
      });
      if (existingMember && existingMember.id !== id) {
        return { success: false, message: 'کد ملی قبلاً استفاده شده است' };
      }

      member.national_id = nationalId;
      await this.familyMemberRepository.save(member);

      // Also update user national ID if exists
      const user = await this.userRepository.findOne({ where: { member: { id } } });
      if (user) {
        user.national_id = nationalId;
        await this.userRepository.save(user);
      }

      return { success: true, message: 'کد ملی با موفقیت به‌روزرسانی شد' };
    } catch (error) {
      console.error('خطا در به‌روزرسانی کد ملی:', error);
      return { success: false, message: 'خطا در به‌روزرسانی کد ملی' };
    }
  }

  async updateProfile(id: number, profileData: { 
    profile_image?: string; 
    national_id?: string; 
  }): Promise<{ success: boolean; message: string }> {
    try {
      const member = await this.familyMemberRepository.findOne({ where: { id } });
      if (!member) {
        return { success: false, message: 'عضو خانواده یافت نشد' };
      }

      // Check national ID uniqueness if provided
      if (profileData.national_id) {
        const existingMember = await this.familyMemberRepository.findOne({ 
          where: { national_id: profileData.national_id } 
        });
        if (existingMember && existingMember.id !== id) {
          return { success: false, message: 'کد ملی قبلاً استفاده شده است' };
        }
      }

      // Update member profile
      if (profileData.profile_image !== undefined) {
        member.profile_image = profileData.profile_image;
      }
      if (profileData.national_id !== undefined) {
        member.national_id = profileData.national_id;
      }
      await this.familyMemberRepository.save(member);

      // Also update user profile if exists
      const user = await this.userRepository.findOne({ where: { member: { id } } });
      if (user) {
        if (profileData.profile_image !== undefined) {
          user.profile_image = profileData.profile_image;
        }
        if (profileData.national_id !== undefined) {
          user.national_id = profileData.national_id;
        }
        await this.userRepository.save(user);
      }

      return { success: true, message: 'پروفایل با موفقیت به‌روزرسانی شد' };
    } catch (error) {
      console.error('خطا در به‌روزرسانی پروفایل:', error);
      return { success: false, message: 'خطا در به‌روزرسانی پروفایل' };
    }
  }
}
