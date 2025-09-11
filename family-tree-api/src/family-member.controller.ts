import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';

@Controller('family-members')
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

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
    return this.familyMemberService.getChildren(+id);
  }

  @Post(':id/set-parent/:parentId')
  setParent(@Param('id') id: string, @Param('parentId') parentId: string) {
    return this.familyMemberService.setParent(+id, +parentId);
  }

  @Patch(':id/father-name')
  updateFatherName(@Param('id') id: string, @Body() body: { fatherName: string }) {
    return this.familyMemberService.updateFatherName(+id, body.fatherName);
  }

  @Delete(':id/parent')
  removeParent(@Param('id') id: string) {
    return this.familyMemberService.removeParent(+id);
  }

  @Post(':id/generate-invite-code')
  generateNewInviteCode(@Param('id') id: string) {
    return this.familyMemberService.generateNewInviteCode(+id);
  }

  // ============= Users management (Admin) =============
  @Get('/users')
  listUsers() {
    return this.familyMemberService.listUsers();
  }

  @Get('/users/:id')
  getUser(@Param('id') id: string) {
    return this.familyMemberService.getUserById(+id);
  }

  @Patch('/users/:id/verify')
  setUserVerified(@Param('id') id: string, @Body() body: { is_verified: boolean }) {
    return this.familyMemberService.setUserVerified(+id, body.is_verified);
  }

  @Delete('/users/:id')
  removeUser(@Param('id') id: string) {
    return this.familyMemberService.deleteUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyMemberService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamilyMemberDto: { name?: string; family_name?: string; father_id?: number }) {
    return this.familyMemberService.update(Number(id), updateFamilyMemberDto);
  }

  @Patch(':id/edit')
  editMember(@Param('id') id: string, @Body() editData: { name?: string; family_name?: string; father_id?: number | null }) {
    return this.familyMemberService.editMember(Number(id), editData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyMemberService.remove(Number(id));
  }

  // Profile management endpoints
  @Patch(':id/profile-image')
  updateProfileImage(@Param('id') id: string, @Body() body: { profile_image: string }) {
    return this.familyMemberService.updateProfileImage(+id, body.profile_image);
  }

  @Patch(':id/national-id')
  updateNationalId(@Param('id') id: string, @Body() body: { national_id: string }) {
    return this.familyMemberService.updateNationalId(+id, body.national_id);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() body: { 
    profile_image?: string; 
    national_id?: string; 
  }) {
    return this.familyMemberService.updateProfile(+id, body);
  }
}
