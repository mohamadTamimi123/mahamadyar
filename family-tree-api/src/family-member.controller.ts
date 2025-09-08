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

  // NOTE: search endpoint defined below (unified)

  // moved id-param routes below the users routes to avoid conflicts

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

  // کد دعوت endpoints
  @Post(':id/generate-invite-code')
  generateNewInviteCode(@Param('id') id: string) {
    return this.familyMemberService.generateNewInviteCode(+id);
  }

  @Get('invite/:inviteCode')
  findByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.familyMemberService.findByInviteCode(inviteCode);
  }

  @Post('register/:inviteCode')
  registerWithInviteCode(
    @Param('inviteCode') inviteCode: string,
    @Body() newMemberData: { name: string; family_name: string }
  ) {
    return this.familyMemberService.registerWithInviteCode(inviteCode, newMemberData);
  }

  @Post('request-invite')
  requestInviteCode(@Body() requestData: { 
    name: string; 
    fatherName: string; 
    email: string; 
    phone?: string; 
    message?: string; 
  }) {
    return this.familyMemberService.requestInviteCode(requestData);
  }

  @Post('register-with-credentials') // New endpoint for registration with email and password
  registerWithCredentials(@Body() registrationData: {
    inviteCode: string;
    name: string;
    family_name: string;
    fatherName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.familyMemberService.registerWithInviteCodeAndCredentials(registrationData);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.familyMemberService.verifyOtp(body);
  }

  @Post('resend-otp')
  resendOtp(@Body() body: { email: string }) {
    return this.familyMemberService.resendOtp(body);
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

  @Post('login') // New endpoint for login with email and password
  login(@Body() loginData: {
    email: string;
    password: string;
  }) {
    return this.familyMemberService.loginWithCredentials(loginData);
  }

  @Post('verify-email/:id') // New endpoint for email verification
  verifyEmail(@Param('id') id: string) {
    return this.familyMemberService.verifyEmail(+id);
  }

  @Get('search') // New endpoint for searching members
  searchMembers(@Query('q') query: string) {
    return this.familyMemberService.searchMembers(query);
  }
}
