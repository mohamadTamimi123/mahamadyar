'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'invite' | 'credentials' | 'otp' | 'success'>('invite');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [inviteData, setInviteData] = useState({
    inviteCode: '',
  });

  const [inviterData, setInviterData] = useState<{name: string; family_name: string; father_name?: string} | null>(null);

  const [credentialsData, setCredentialsData] = useState({
    name: '',
    family_name: '',
    fatherName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [otpCode, setOtpCode] = useState('');
  const [resending, setResending] = useState(false);

  const handleCheckInviteCode = async () => {
    if (!inviteData.inviteCode.trim()) {
      setError('لطفاً کد دعوت را وارد کنید');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/family-members/invite/${inviteData.inviteCode}`);
      

      console.log(response.data);
      if (response.data) {
        // ذخیره اطلاعات دعوت‌کننده
        setInviterData(response.data);
        
        // پر کردن خودکار فرم با اطلاعات دعوت‌کننده
        setCredentialsData(prev => ({
          ...prev,
          name: response.data.name,
          family_name: response.data.family_name,
          fatherName: response.data.father_name || '',
        }));
        
        setStep('credentials');
        setSuccess(`کد دعوت معتبر است. اطلاعات دعوت‌کننده: ${response.data.name} ${response.data.family_name}. لطفاً اطلاعات خود را تکمیل کنید.`);
      }
    } catch {
      setError('کد دعوت نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // اعتبارسنجی - فقط فیلدهای قابل ویرایش
    if (!credentialsData.email.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید');
      return;
    }
    if (!credentialsData.password.trim()) {
      setError('لطفاً رمز عبور را وارد کنید');
      return;
    }
    if (credentialsData.password !== credentialsData.confirmPassword) {
      setError('رمز عبور و تأیید رمز عبور مطابقت ندارند');
      return;
    }
    if (credentialsData.password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/family-members/register-with-credentials', {
        inviteCode: inviteData.inviteCode,
        name: credentialsData.name,
        family_name: credentialsData.family_name,
        fatherName: credentialsData.fatherName,
        email: credentialsData.email,
        password: credentialsData.password,
        phone: credentialsData.phone || undefined,
      });

      if (response.data.success) {
        setStep('otp');
        setSuccess('کد تأیید به ایمیل شما ارسال شد. لطفاً OTP را وارد کنید.');
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (step === 'invite') {
      setInviteData(prev => ({ ...prev, [field]: value }));
    } else {
      setCredentialsData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleVerifyOtp = async () => {
    if (!credentialsData.email || !otpCode.trim()) {
      setError('ایمیل و کد تأیید را وارد کنید');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const resp = await api.post('/family-members/verify-otp', {
        email: credentialsData.email,
        otp: otpCode.trim(),
      });
      if (resp.data.success) {
        if (resp.data.token) {
          localStorage.setItem('token', resp.data.token);
          router.push('/dashboard');
        } else {
          setStep('success');
          setSuccess('حساب شما با موفقیت فعال شد.');
        }
      } else {
        setError(resp.data.message || 'کد تأیید نامعتبر است');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'خطا در تأیید کد');
    } finally {
      setLoading(false);
    }



  };

  const handleResendOtp = async () => {
    if (!credentialsData.email) {
      setError('ایمیل نامعتبر است');
      return;
    }
    try {
      setResending(true);
      setError(null);
      const resp = await api.post('/family-members/resend-otp', {
        email: credentialsData.email,
      });
      if (resp.data.success) {
        setSuccess('کد تأیید دوباره ارسال شد.');
      } else {
        setError(resp.data.message || 'خطا در ارسال مجدد کد');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'خطا در ارسال مجدد کد');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🎫</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'invite' && 'ورود کد دعوت'}
            {step === 'credentials' && 'تکمیل اطلاعات'}
            {step === 'otp' && 'تأیید با کد OTP'}
            {step === 'success' && 'ثبت‌نام موفق'}
          </h1>
          <p className="text-gray-600">
            {step === 'invite' && 'کد دعوت خود را وارد کنید'}
            {step === 'credentials' && 'اطلاعات حساب کاربری خود را تکمیل کنید'}
            {step === 'otp' && 'کد ارسال‌شده به ایمیل خود را وارد کنید'}
            {step === 'success' && 'حساب کاربری شما با موفقیت ایجاد شد'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'invite' ? 'bg-blue-500 text-white' : 
              step === 'credentials' || step === 'success' ? 'bg-green-500 text-white' : 
              'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${
              step === 'credentials' || step === 'success' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'credentials' ? 'bg-blue-500 text-white' : 
              step === 'success' ? 'bg-green-500 text-white' : 
              'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 mx-2 ${
              step === 'success' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'otp' ? 'bg-blue-500 text-white' : step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'invite' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  کد دعوت
                </label>
                <input
                  type="text"
                  value={inviteData.inviteCode}
                  onChange={(e) => handleInputChange('inviteCode', e.target.value)}
                  placeholder="کد دعوت خود را وارد کنید"
                  className="w-full p-4 border border-gray-300 rounded-xl text-center text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              <button
                onClick={handleCheckInviteCode}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    در حال بررسی...
                  </div>
                ) : (
                  'بررسی کد دعوت'
                )}
              </button>
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-6">
              {/* اطلاعات دعوت‌کننده */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-800 mb-2">اطلاعات دعوت‌کننده</h3>
                <div className="text-sm text-blue-700">
                  <p><strong>نام:</strong> {inviterData?.name}</p>
                  <p><strong>نام خانوادگی:</strong> {inviterData?.family_name}</p>
                  <p><strong>نام پدر:</strong> {inviterData?.father_name || 'ندارد'}</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  فیلدهای نام، نام خانوادگی و نام پدر بر اساس اطلاعات دعوت‌کننده پر شده‌اند.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نام شما
                  </label>
                  <input
                    type="text"
                    value={credentialsData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="نام خود را وارد کنید"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                    dir="rtl"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">این فیلد بر اساس کد دعوت پر شده است</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نام خانوادگی شما
                  </label>
                  <input
                    type="text"
                    value={credentialsData.family_name}
                    onChange={(e) => handleInputChange('family_name', e.target.value)}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                    dir="rtl"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">این فیلد بر اساس کد دعوت پر شده است</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نام پدر شما
                </label>
                <input
                  type="text"
                  value={credentialsData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="نام پدر خود را وارد کنید"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  dir="rtl"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">این فیلد بر اساس کد دعوت پر شده است</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={credentialsData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  شماره تماس (اختیاری)
                </label>
                <input
                  type="tel"
                  value={credentialsData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="09123456789"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={credentialsData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="حداقل 6 کاراکتر"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تأیید رمز عبور
                  </label>
                  <input
                    type="password"
                    value={credentialsData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="تکرار رمز عبور"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('invite')}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  بازگشت
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      در حال ثبت‌نام...
                    </div>
                  ) : (
                    'ثبت‌نام'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  کد تأیید به ایمیل <span className="font-bold">{credentialsData.email}</span> ارسال شد.
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">کد OTP</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center tracking-widest font-mono"
                  dir="ltr"
                  placeholder="مثلاً 123456"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {resending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'در حال بررسی...' : 'تأیید کد'}
                </button>
              </div>
              <button
                onClick={() => setStep('credentials')}
                className="w-full py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                بازگشت
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-500 text-3xl">✅</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ثبت‌نام موفقیت‌آمیز!
                </h3>
                <p className="text-gray-600">
                  حساب کاربری شما با موفقیت ایجاد شد. لطفاً ایمیل خود را بررسی کنید تا حساب کاربری خود را تأیید کنید.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  ورود به حساب کاربری
                </button>
                <button
                  onClick={() => router.push('/index')}
                  className="w-full py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  بازگشت به صفحه اصلی
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-2">❌</span>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && step !== 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-2">✅</span>
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            قبلاً حساب کاربری دارید؟{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              وارد شوید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;