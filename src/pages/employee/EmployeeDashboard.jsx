import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import { Skeleton } from '../../components/ui/skeleton';

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
    <div className="employee-dashboard">
      <h1 className="text-2xl font-semibold mb-6">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-500 text-sm font-medium">Total Requests</h2>
              <p className="mt-2 text-3xl font-bold">{requestStatusCounts.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-yellow-500 text-sm font-medium">Pending</h2>
              <p className="mt-2 text-3xl font-bold">{requestStatusCounts.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-green-500 text-sm font-medium">Approved</h2>
              <p className="mt-2 text-3xl font-bold">{requestStatusCounts.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-red-500 text-sm font-medium">Rejected</h2>
              <p className="mt-2 text-3xl font-bold">{requestStatusCounts.rejected}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Requests</h2>
          <Link to="/employee/requests" className="text-blue-500 hover:text-blue-700">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Software
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested On
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-28" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-10" />
                    </td>
                  </tr>
                ))
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No requests found. Create a new request.
                  </td>
                </tr>
              ) : (
                recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.software.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.accessType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/employee/requests/${request.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/employee/requests/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Request
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 