import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Alert } from '../../components/ui/alert';
import RequestActionDialog from '../../components/manager/RequestActionDialog';
import requestService from '../../services/requestService';

export default function ManagerRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await requestService.getRequestById(id);
        setRequest(response.data);
      } catch (err) {
        setError('Failed to load request details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleUpdateStatus = async (requestId, status, comments) => {
    try {
      setIsSubmitting(true);
      await requestService.updateRequest(requestId, { 
        status,
        comments: comments.trim() ? comments : undefined
      });
      setActionSuccess(`Request successfully ${status.toLowerCase()}.`);
      
      setRequest(prev => ({
        ...prev,
        status,
        comments: comments.trim() ? comments : prev.comments
      }));
      
      setDialogOpen(false);
      
      setTimeout(() => {
        navigate('/manager/requests');
      }, 2000);
    } catch (err) {
      setError(`Failed to ${status.toLowerCase()} request. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDialog = (action) => {
    setActionType(action);
    setDialogOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-xl">Loading request details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/manager/requests')}
        >
          Back to Requests
        </Button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Request Not Found</h2>
        <p className="text-yellow-700">The requested access request could not be found.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/manager/requests')}
        >
          Back to Requests
        </Button>
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
        <h1 className="text-2xl font-bold">Request Details</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/manager/requests')}
        >
          Back to Requests
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <CardTitle>Access Request #{request.id}</CardTitle>
            <Badge className={getStatusBadgeClass(request.status)}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Requested By</h3>
              <p className="mt-1 text-lg">{request.user?.name || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{request.user?.email || 'No email'}</p>
              <p className="text-sm text-gray-500">Department: {request.user?.department || 'Not specified'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Request Details</h3>
              <p className="mt-1 text-lg">Software: {request.software?.name || 'Unknown Software'}</p>
              <p className="text-sm text-gray-500">Access Type: {request.accessType}</p>
              <p className="text-sm text-gray-500">
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reason for Request</h3>
            <p className="mt-1 p-3 bg-gray-50 rounded-md">{request.reason || 'No reason provided'}</p>
          </div>
          
          {request.status !== 'Pending' && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Manager Comments</h3>
              <p className="mt-1 p-3 bg-gray-50 rounded-md">
                {request.comments || 'No comments provided'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Decision made by: {request.approvedBy?.name || 'Unknown'} on {' '}
                {new Date(request.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
        
        {request.status === 'Pending' && (
          <CardFooter className="bg-gray-50 p-6 flex flex-col space-y-4">
            <div className="w-full">
              <label className="text-sm font-medium">
                Add Comments (Optional)
              </label>
              <Textarea
                placeholder="Enter any comments about your decision..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end space-x-3 w-full">
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => openDialog('Rejected')}
              >
                Reject
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => openDialog('Approved')}
              >
                Approve Request
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <RequestActionDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        action={actionType}
        onConfirm={handleUpdateStatus}
        requestId={id}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 