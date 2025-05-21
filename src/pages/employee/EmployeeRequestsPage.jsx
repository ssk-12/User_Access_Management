import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';
import { Card } from '../../components/ui/card';
import { Table } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';

const EmployeeRequestsPage = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestCounts, setRequestCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessRequests = async () => {
      try {
        setLoading(true);
        const response = await requestService.getMyAccess();
        
        setAccessRequests(response.data.requests || []);
        setRequestCounts(response.data.counts || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch access requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessRequests();
  }, []);

  const handleNewRequest = () => {
    navigate('/employee/requests/new');
  };

  const handleViewDetails = (requestId) => {
    navigate(`/employee/requests/${requestId}`);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const RequestSkeletonRow = () => (
    <tr className="hover:bg-muted/50">
      <td className="p-2 sm:p-4 text-left align-middle"><Skeleton className="h-4 w-20 sm:w-32" /></td>
      <td className="p-2 sm:p-4 text-left align-middle"><Skeleton className="h-4 w-16 sm:w-24" /></td>
      <td className="p-2 sm:p-4 text-center align-middle"><Skeleton className="h-5 sm:h-6 w-16 sm:w-20 mx-auto" /></td>
      <td className="p-2 sm:p-4 text-left align-middle"><Skeleton className="h-4 w-16 sm:w-24" /></td>
      <td className="p-2 sm:p-4 text-center align-middle"><Skeleton className="h-7 sm:h-8 w-10 sm:w-12 mx-auto" /></td>
    </tr>
  );

  return (
    <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">My Access Requests</h1>
          {!loading && requestCounts && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Total: {requestCounts.total}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">Pending: {requestCounts.pending}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">Approved: {requestCounts.approved}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">Rejected: {requestCounts.rejected}</span>
            </div>
          )}
        </div>
        <Button onClick={handleNewRequest} className="w-full sm:w-auto">New Request</Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-2 sm:p-4 md:p-6">
            <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-250px)]" orientation="both">
              <div className="min-w-full">
                <Table>
                  <thead>
                    <tr className="border-b">
                      <th className="w-[25%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Software</th>
                      <th className="w-[20%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Access Type</th>
                      <th className="w-[15%] p-2 sm:p-4 text-center text-xs sm:text-sm font-medium">Status</th>
                      <th className="w-[25%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Requested Date</th>
                      <th className="w-[15%] p-2 sm:p-4 text-center text-xs sm:text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <RequestSkeletonRow key={index} />
                    ))}
                  </tbody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : accessRequests.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">You don't have any access requests yet.</p>
            <Button onClick={handleNewRequest} className="w-full sm:w-auto">Create Your First Request</Button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <ScrollArea orientation="both">
              <div className="min-w-full">
                <Table>
                  <thead>
                    <tr className="border-b">
                      <th className="w-[25%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Software</th>
                      <th className="w-[20%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Access Type</th>
                      <th className="w-[15%] p-2 sm:p-4 text-center text-xs sm:text-sm font-medium">Status</th>
                      <th className="w-[25%] p-2 sm:p-4 text-left text-xs sm:text-sm font-medium">Requested Date</th>
                      <th className="w-[15%] p-2 sm:p-4 text-center text-xs sm:text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-muted/50 border-b">
                        <td className="p-2 sm:p-4 text-left align-middle text-xs sm:text-sm">
                          {request.software?.name || 'N/A'}
                        </td>
                        <td className="p-2 sm:p-4 text-left align-middle text-xs sm:text-sm">
                          {request.accessType}
                        </td>
                        <td className="p-2 sm:p-4 text-center align-middle">
                          <Badge 
                            variant={getStatusBadgeVariant(request.status)}
                            className="capitalize text-xs px-1.5 sm:px-3 py-0.5 sm:py-1 inline-block w-16 sm:w-24 text-center"
                          >
                            {request.status}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-4 text-left align-middle text-xs sm:text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 sm:p-4 text-center align-middle">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(request.id)}
                            className="h-7 sm:h-8 px-2 sm:px-4 text-xs sm:text-sm mx-auto"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeRequestsPage;