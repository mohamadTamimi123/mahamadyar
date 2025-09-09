'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface InviteRequest {
  id: number;
  name: string;
  fatherName: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

const InviteRequestsPage: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<InviteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<InviteRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: InviteRequest[] = [
      {
        id: 1,
        name: 'احمد محمدی',
        fatherName: 'محمد رضایی',
        email: 'ahmad.mohammadi@email.com',
        phone: '09123456789',
        message: 'لطفاً کد دعوت برای من ارسال کنید',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'فاطمه احمدی',
        fatherName: 'احمد کریمی',
        email: 'fateme.ahmadi@email.com',
        phone: '09987654321',
        message: 'می‌خواهم به خانواده بپیوندم',
        status: 'approved',
        createdAt: '2024-01-14T15:45:00Z',
        processedAt: '2024-01-15T09:20:00Z',
        processedBy: 'مدیر سیستم'
      },
      {
        id: 3,
        name: 'علی حسینی',
        fatherName: 'حسین نوری',
        email: 'ali.hosseini@email.com',
        status: 'rejected',
        createdAt: '2024-01-13T12:15:00Z',
        processedAt: '2024-01-14T08:30:00Z',
        processedBy: 'مدیر سیستم'
      },
      {
        id: 4,
        name: 'زهرا رضایی',
        fatherName: 'رضا محمدی',
        email: 'zahra.rezaei@email.com',
        phone: '09111111111',
        message: 'درخواست عضویت در خانواده',
        status: 'pending',
        createdAt: '2024-01-16T08:20:00Z'
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            ⏳ در انتظار
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            ✅ تأیید شده
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            ❌ رد شده
          </span>
        );
      default:
        return null;
    }
  };

  const handleApproveRequest = (requestId: number) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved' as const,
            processedAt: new Date().toISOString(),
            processedBy: 'مدیر سیستم'
          }
        : req
    ));
    setShowApprovalModal(false);
    setSelectedRequest(null);
  };

  const handleRejectRequest = (requestId: number) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejected' as const,
            processedAt: new Date().toISOString(),
            processedBy: 'مدیر سیستم'
          }
        : req
    ));
    setSelectedRequest(null);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:mr-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            در حال بارگذاری درخواست‌ها...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:mr-80">
        <div className="p-6">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">درخواست‌های کد دعوت</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  📋 درخواست‌های کد دعوت
                </h1>
                <p className="text-lg opacity-90">
                  مدیریت و بررسی درخواست‌های عضویت در خانواده
                </p>
              </div>
              <button
                onClick={() => router.push('/admin')}
                className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                ← بازگشت به داشبورد
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">کل درخواست‌ها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">در انتظار</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">تأیید شده</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">رد شده</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  🔍 جستجو:
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="نام، نام پدر یا ایمیل..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  📊 فیلتر وضعیت:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">همه درخواست‌ها</option>
                  <option value="pending">در انتظار</option>
                  <option value="approved">تأیید شده</option>
                  <option value="rejected">رد شده</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-700 to-pink-700">
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      شناسه
                    </th>
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      نام درخواست‌کننده
                    </th>
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      نام پدر
                    </th>
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      ایمیل
                    </th>
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      وضعیت
                    </th>
                    <th className="text-white p-4 text-center border-r border-white/20 font-bold">
                      تاریخ درخواست
                    </th>
                    <th className="text-white p-4 text-center font-bold">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr 
                      key={request.id} 
                      className={`transition-colors hover:bg-purple-50 cursor-pointer ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } ${selectedRequest?.id === request.id ? 'bg-purple-100 border-l-4 border-purple-500' : ''}`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <td className="p-4 border-r border-gray-300 text-center font-mono text-xs">
                        #{request.id}
                      </td>
                      <td className="p-4 border-r border-gray-300 text-center font-bold text-gray-800">
                        {request.name}
                      </td>
                      <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                        {request.fatherName}
                      </td>
                      <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                        <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                          {request.email}
                        </a>
                      </td>
                      <td className="p-4 border-r border-gray-300 text-center">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequest(request);
                                  setShowApprovalModal(true);
                                }}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                title="تأیید درخواست"
                              >
                                ✅
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectRequest(request.id);
                                }}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                title="رد درخواست"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(request);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            title="مشاهده جزئیات"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center text-gray-600 text-lg py-10">
                <div className="text-6xl mb-4">📋</div>
                {searchTerm || statusFilter !== 'all' ? 'نتیجه‌ای یافت نشد' : 'درخواستی موجود نیست'}
              </div>
            )}
          </div>

          {/* Selected Request Details */}
          {selectedRequest && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 جزئیات درخواست #{selectedRequest.id}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div><strong>نام درخواست‌کننده:</strong> {selectedRequest.name}</div>
                  <div><strong>نام پدر:</strong> {selectedRequest.fatherName}</div>
                  <div><strong>ایمیل:</strong> 
                    <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline mr-2">
                      {selectedRequest.email}
                    </a>
                  </div>
                  <div><strong>شماره تماس:</strong> {selectedRequest.phone || 'ارسال نشده'}</div>
                </div>
                <div className="space-y-3">
                  <div><strong>وضعیت:</strong> {getStatusBadge(selectedRequest.status)}</div>
                  <div><strong>تاریخ درخواست:</strong> {new Date(selectedRequest.createdAt).toLocaleString('fa-IR')}</div>
                  {selectedRequest.processedAt && (
                    <div><strong>تاریخ پردازش:</strong> {new Date(selectedRequest.processedAt).toLocaleString('fa-IR')}</div>
                  )}
                  {selectedRequest.processedBy && (
                    <div><strong>پردازش شده توسط:</strong> {selectedRequest.processedBy}</div>
                  )}
                </div>
              </div>
              {selectedRequest.message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <strong>پیام اضافی:</strong>
                  <p className="mt-2 text-gray-700">{selectedRequest.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Approval Modal */}
          {showApprovalModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ✅ تأیید درخواست کد دعوت
                </h3>
                <p className="text-gray-600 mb-6">
                  آیا مطمئن هستید که می‌خواهید درخواست <strong>{selectedRequest.name}</strong> را تأیید کنید؟
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    ✅ تأیید
                  </button>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h4 className="text-lg font-bold text-purple-800 mb-2">📋 راهنمای مدیریت درخواست‌ها</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
              <div>✅ برای تأیید درخواست روی دکمه تأیید کلیک کنید</div>
              <div>❌ برای رد درخواست روی دکمه رد کلیک کنید</div>
              <div>👁️ برای مشاهده جزئیات روی دکمه مشاهده کلیک کنید</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteRequestsPage;
