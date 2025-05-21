import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import { Skeleton } from '../../components/ui/skeleton';
import { ScrollArea } from '../../components/ui/scroll-area';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [requestStatusCounts, setRequestStatusCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await requestService.getMyAccess();
        const { requests, counts } = response.data;
        
        setRequestStatusCounts(counts);
        setRecentRequests(requests.slice(0, 5));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="employee-dashboard px-3 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-6">Employee Dashboard</h1>
      
      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        {isLoading ? (
          <>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-32 mb-1 sm:mb-4" />
              <Skeleton className="h-6 sm:h-10 w-10 sm:w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-32 mb-1 sm:mb-4" />
              <Skeleton className="h-6 sm:h-10 w-10 sm:w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-32 mb-1 sm:mb-4" />
              <Skeleton className="h-6 sm:h-10 w-10 sm:w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-32 mb-1 sm:mb-4" />
              <Skeleton className="h-6 sm:h-10 w-10 sm:w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Requests</h2>
              <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-bold">{requestStatusCounts.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <h2 className="text-yellow-500 text-xs sm:text-sm font-medium">Pending</h2>
              <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-bold">{requestStatusCounts.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <h2 className="text-green-500 text-xs sm:text-sm font-medium">Approved</h2>
              <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-bold">{requestStatusCounts.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-2 sm:p-6">
              <h2 className="text-red-500 text-xs sm:text-sm font-medium">Rejected</h2>
              <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-bold">{requestStatusCounts.rejected}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-3 sm:p-6 border-b">
          <h2 className="text-sm sm:text-lg font-semibold">Recent Requests</h2>
          <Link to="/employee/requests" className="text-blue-500 hover:text-blue-700 text-xs sm:text-base">
            View All
          </Link>
        </div>
        
        <ScrollArea orientation="both">
          <div className="min-w-full">
            <table className="min-w-[500px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-1.5 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Software
                  </th>
                  <th className="px-2 sm:px-6 py-1.5 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Type
                  </th>
                  <th className="px-2 sm:px-6 py-1.5 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested On
                  </th>
                  <th className="px-2 sm:px-6 py-1.5 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap">
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-32" />
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap">
                        <Skeleton className="h-4 sm:h-5 w-12 sm:w-24" />
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap">
                        <Skeleton className="h-4 sm:h-5 w-14 sm:w-28" />
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap">
                        <Skeleton className="h-4 sm:h-5 w-12 sm:w-20" />
                      </td>
                    </tr>
                  ))
                ) : recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                      No requests found. Create a new request.
                    </td>
                  </tr>
                ) : (
                  recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {request.software.name}
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {request.accessType}
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 sm:px-6 py-1.5 sm:py-4 whitespace-nowrap">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                          request.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
      
      {/* Action Button */}
      <div className="mt-4 sm:mt-8 text-center">
        <Link
          to="/employee/requests/new"
          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-base font-medium rounded-md transition-colors"
        >
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Request
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 