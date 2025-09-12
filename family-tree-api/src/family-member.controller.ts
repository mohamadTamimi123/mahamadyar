import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';

@Controller('family-members')
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

  // Helper method to validate and convert ID parameter
  private validateId(id: string): number {
    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      throw new BadRequestException('Invalid ID parameter. ID must be a positive integer.');
    }
    return numericId;
  }

  @Post()
  create(@Body() createFamilyMemberDto: { name: string; family_name: string; father_id?: number }) {
    return this.familyMemberService.create(createFamilyMemberDto);
  }

  @Get()
  findAll() {
    return this.familyMemberService.findAll();
  }

  @Get('count')
  getTotalCount() {
    return this.familyMemberService.getTotalCount();
  }

  @Post('import')
  importData(@Body() jsonData: any[]) {
    return this.familyMemberService.importNamesFromJson(jsonData);
  }

  @Get('tree/all')
  getFamilyTree() {
    return this.familyMemberService.getFamilyTree();
  }

  @Get('tree/roots')
  getRootMembers() {
    return this.familyMemberService.getRootMembers();
  }

  @Get('search')
  searchMembers(@Query('q') query: string) {
    return this.familyMemberService.searchMembers(query);
  }

  @Get(':id/children')
  getChildren(@Param('id') id: string) {
    return this.familyMemberService.getChildren(this.validateId(id));
  }

  @Post(':id/set-parent/:parentId')
  setParent(@Param('id') id: string, @Param('parentId') parentId: string) {
    return this.familyMemberService.setParent(this.validateId(id), this.validateId(parentId));
  }

  @Patch(':id/father-name')
  updateFatherName(@Param('id') id: string, @Body() body: { fatherName: string }) {
    return this.familyMemberService.updateFatherName(this.validateId(id), body.fatherName);
  }

  @Delete(':id/parent')
  removeParent(@Param('id') id: string) {
    return this.familyMemberService.removeParent(this.validateId(id));
  }

  @Post(':id/generate-invite-code')
  generateNewInviteCode(@Param('id') id: string) {
    return this.familyMemberService.generateNewInviteCode(this.validateId(id));
  }

  // ============= Users management (Admin) =============
  @Get('/users')
  listUsers() {
    return this.familyMemberService.listUsers();
  }

  @Get('/users/:id')
  getUser(@Param('id') id: string) {
    return this.familyMemberService.getUserById(this.validateId(id));
  }

  @Patch('/users/:id/verify')
  setUserVerified(@Param('id') id: string, @Body() body: { is_verified: boolean }) {
    return this.familyMemberService.setUserVerified(this.validateId(id), body.is_verified);
  }

  @Delete('/users/:id')
  removeUser(@Param('id') id: string) {
    return this.familyMemberService.deleteUser(this.validateId(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyMemberService.findOne(this.validateId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamilyMemberDto: { name?: string; family_name?: string; father_id?: number }) {
    return this.familyMemberService.update(this.validateId(id), updateFamilyMemberDto);
  }

  @Patch(':id/edit')
  editMember(@Param('id') id: string, @Body() editData: { name?: string; family_name?: string; father_id?: number | null }) {
    return this.familyMemberService.editMember(this.validateId(id), editData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyMemberService.remove(this.validateId(id));
  }

  // Profile management endpoints
  @Patch(':id/profile-image')
  updateProfileImage(@Param('id') id: string, @Body() body: { profile_image: string }) {
    return this.familyMemberService.updateProfileImage(this.validateId(id), body.profile_image);
  }

  @Patch(':id/national-id')
  updateNationalId(@Param('id') id: string, @Body() body: { national_id: string }) {
    return this.familyMemberService.updateNationalId(this.validateId(id), body.national_id);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() body: { 
    profile_image?: string; 
    national_id?: string; 
  }) {
    return this.familyMemberService.updateProfile(this.validateId(id), body);
  }
}
