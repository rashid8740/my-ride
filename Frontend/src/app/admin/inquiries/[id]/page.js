"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import apiService from '@/utils/api';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Mail, 
  Phone, 
  Car, 
  MessageSquare, 
  CheckCircle, 
  Loader2,
  Send,
  User,
  AlertCircle
} from 'lucide-react';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: {
      color: 'bg-blue-100 text-blue-800',
      icon: <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>,
      label: 'New'
    },
    inProgress: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-3 w-3 mr-1.5" />,
      label: 'In Progress'
    },
    resolved: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-3 w-3 mr-1.5" />,
      label: 'Resolved'
    }
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default function InquiryDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchInquiry();
  }, []);

  const fetchInquiry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.contact.getById(params.id);
      
      if (response && response.status === 'success') {
        setInquiry(response.data);
      } else {
        throw new Error('Failed to fetch inquiry details');
      }
    } catch (err) {
      console.error('Error fetching inquiry:', err);
      setError('Failed to load inquiry details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      
      const response = await apiService.contact.updateStatus(params.id, newStatus);
      
      if (response && response.status === 'success') {
        setInquiry({
          ...inquiry,
          status: newStatus
        });
      } else {
        throw new Error('Failed to update inquiry status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again later.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!reply.trim()) return;
    
    try {
      setIsSending(true);
      
      const response = await apiService.contact.addResponse(params.id, reply);
      
      if (response && response.status === 'success') {
        // Update inquiry with new response
        const updatedInquiry = {
          ...inquiry,
          responseHistory: [
            ...(inquiry.responseHistory || []),
            {
              message: reply,
              sentBy: user._id,
              timestamp: new Date().toISOString()
            }
          ]
        };
        
        setInquiry(updatedInquiry);
        setReply('');
        
        // If the inquiry was new, automatically set to in progress
        if (inquiry.status === 'new') {
          handleStatusChange('inProgress');
        }
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('Failed to send reply. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-red-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Inquiry</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => fetchInquiry()}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              <Link href="/admin/inquiries" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inquiry Not Found</h3>
          <p className="text-sm text-gray-600 mb-4">The inquiry you're looking for doesn't exist or has been removed.</p>
          <Link href="/admin/inquiries" className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            Back to Inquiries
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get vehicle info from either car reference or vehicleInfo field
  const vehicleInfo = inquiry.car ? 
    `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}` : 
    (inquiry.vehicleInfo || 'Not specified');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link href="/admin/inquiries" className="mr-4 p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inquiry from {inquiry.name}
              </h1>
              <p className="text-sm text-gray-500">
                Received {formatDate(inquiry.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <select
                disabled={statusUpdating}
                value={inquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="new">New</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Message */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                <div className="text-xs text-gray-500">{inquiry.email}</div>
              </div>
              <div className="ml-auto">
                <StatusBadge status={inquiry.status} />
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{inquiry.subject}</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </div>
            
            {vehicleInfo !== 'Not specified' && (
              <div className="flex items-center text-sm text-gray-500">
                <Car className="h-4 w-4 mr-1.5" />
                Regarding: {vehicleInfo}
              </div>
            )}
          </div>
          
          {/* Responses History */}
          {inquiry.responseHistory && inquiry.responseHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Responses</h3>
              <div className="space-y-4">
                {inquiry.responseHistory.map((response, index) => (
                  <div key={index} className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {response.sentBy ? 'Support Agent' : 'System'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(response.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {response.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reply Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send a Response</h3>
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={5}
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSending || !reply.trim()}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Customer Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Name</div>
                  <div className="mt-1 text-sm text-gray-500">{inquiry.name}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Email</div>
                  <div className="mt-1 text-sm text-gray-500">{inquiry.email}</div>
                </div>
              </div>
              
              {inquiry.phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Phone</div>
                    <div className="mt-1 text-sm text-gray-500">{inquiry.phone}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Date Submitted</div>
                  <div className="mt-1 text-sm text-gray-500">{formatDate(inquiry.createdAt)}</div>
                </div>
              </div>
              
              {vehicleInfo !== 'Not specified' && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Car className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Vehicle</div>
                    <div className="mt-1 text-sm text-gray-500">{vehicleInfo}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a 
                href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                className="block w-full px-4 py-2 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Send Email
              </a>
              {inquiry.status !== 'resolved' && (
                <button 
                  onClick={() => handleStatusChange('resolved')}
                  className="block w-full px-4 py-2 text-center bg-green-100 border border-green-200 rounded-lg text-sm font-medium text-green-800 hover:bg-green-200 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
              <Link 
                href="/admin/inquiries"
                className="block w-full px-4 py-2 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to All Inquiries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 