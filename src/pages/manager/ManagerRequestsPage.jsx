import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Alert } from '../../components/ui/alert';
import { Textarea } from '../../components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';
import requestService from '../../services/requestService';
import { ScrollArea } from '../../components/ui/scroll-area';

export default function ManagerRequestsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('filter') || 'all';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAllRequests();
      setRequests(response.data);
    } catch (err) {
      setError('Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    
    try {
      setIsSubmitting(true);
      
      await requestService.updateRequest(selectedRequest.id, {
        status: actionType,
        comments: comments.trim() ? comments : undefined
      });
      
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? {...req, status: actionType, updatedBy: { username: "Current User" }} 
            : req
        )
      );
      
      setActionSuccess(`Request #${selectedRequest.id} has been ${actionType.toLowerCase()}.`);
      setDialogOpen(false);
      setComments('');
      
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError(`Failed to ${actionType.toLowerCase()} request. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-xl">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          {actionSuccess}
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Access Requests</h1>
        <Link to="/manager/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          onClick={() => setFilter('pending')}
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'approved' ? 'default' : 'outline'} 
          onClick={() => setFilter('approved')}
          className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
        >
          Approved
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'default' : 'outline'} 
          onClick={() => setFilter('rejected')}
          className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
        >
          Rejected
        </Button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <p className="text-lg text-muted-foreground">No {filter !== 'all' ? filter : ''} requests found.</p>
        </div>
      ) : (
        <ScrollArea className="h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested By</TableHead>
                <TableHead>Software</TableHead>
                <TableHead>Access Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.user?.username || 'Unknown'}</TableCell>
                  <TableCell>{request.software?.name || 'Unknown'}</TableCell>
                  <TableCell>{request.accessType}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={request.reason}>
                    {request.reason?.slice(0, 50)}{request.reason?.length > 50 ? '...' : ''}
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                          onClick={() => handleAction(request, 'Approved')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                          onClick={() => handleAction(request, 'Rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Updated by: {request.updatedBy?.username || 'Unknown'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {actionType === 'Approved' ? 'Approval' : 'Rejection'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType === 'Approved' ? 'approve' : 'reject'} 
              this access request for {selectedRequest?.user?.username || 'this user'} to access {selectedRequest?.software?.name || 'this software'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium">
              Comments (Optional)
            </label>
            <Textarea
              placeholder="Add any comments about your decision..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              className={actionType === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isSubmitting ? 'Processing...' : `Confirm ${actionType}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 