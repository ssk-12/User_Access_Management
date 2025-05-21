import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export default function RequestList({ requests, title, emptyMessage }) {
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      
      {requests?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {emptyMessage || 'No requests found.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests?.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {request.user?.username || 'Unknown User'} - {request.software?.name || 'Unknown Software'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.reason?.slice(0, 60)}{request.reason?.length > 60 ? '...' : ''}
                    </p>
                    <div className="flex gap-2 items-center mt-2">
                      <Badge className="text-xs">{request.accessType}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      {request.status !== 'Pending' && request.updatedBy && (
                        <span className="text-xs text-muted-foreground">
                          Updated by: {request.updatedBy.username}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge className={getStatusBadgeClass(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 