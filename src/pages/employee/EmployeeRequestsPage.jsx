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
        console.error('Error fetching access requests:', err);
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
      <td className="p-2"><Skeleton className="h-4 w-20" /></td>
      <td className="p-2"><Skeleton className="h-4 w-32" /></td>
      <td className="p-2"><Skeleton className="h-4 w-24" /></td>
      <td className="p-2"><Skeleton className="h-6 w-20" /></td>
      <td className="p-2"><Skeleton className="h-4 w-24" /></td>
      <td className="p-2"><Skeleton className="h-8 w-12" /></td>
    </tr>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Access Requests</h1>
          {!loading && requestCounts && (
            <p className="text-muted-foreground mt-1">
              Total: {requestCounts.total} • 
              Pending: {requestCounts.pending} • 
              Approved: {requestCounts.approved} • 
              Rejected: {requestCounts.rejected}
            </p>
          )}
        </div>
        <Button onClick={handleNewRequest}>New Request</Button>
      </div>

      <Card>
        <div className="p-6">
          {loading ? (
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <thead>
                  <tr>
                    <th className="w-[150px]">Request ID</th>
                    <th className="w-[200px]">Software</th>
                    <th className="w-[150px]">Access Type</th>
                    <th className="w-[150px]">Status</th>
                    <th className="w-[150px]">Requested Date</th>
                    <th className="w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <RequestSkeletonRow key={index} />
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : accessRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any access requests yet.</p>
              <Button onClick={handleNewRequest}>Create Your First Request</Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <thead>
                  <tr>
                    <th className="w-[150px]">Request ID</th>
                    <th className="w-[200px]">Software</th>
                    <th className="w-[150px]">Access Type</th>
                    <th className="w-[150px]">Status</th>
                    <th className="w-[150px]">Requested Date</th>
                    <th className="w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/50">
                      <td className="p-2">{request.id}</td>
                      <td className="p-2">{request.software?.name || 'N/A'}</td>
                      <td className="p-2">{request.accessType}</td>
                      <td className="p-2">
                        <Badge 
                          variant={getStatusBadgeVariant(request.status)}
                          className="capitalize"
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(request.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeRequestsPage; 