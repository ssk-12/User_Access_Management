import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import RequestStatusCard from '../../components/manager/RequestStatusCard';
import RequestList from '../../components/manager/RequestList';

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const processedResponse = await requestService.getManagerProcessedRequests();
        
        setStats(processedResponse.data);
        
        const allResponse = await requestService.getAllRequests();
        const pending = allResponse.data.filter(req => req.status.toLowerCase() === 'pending');
        setPendingRequests(pending);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-xl">Loading dashboard...</div>
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <Link to="/manager/requests">
          <Button>View All Requests</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RequestStatusCard 
          title="Pending" 
          count={pendingRequests.length} 
          variant="pending" 
        />
        <RequestStatusCard 
          title="Total Processed" 
          count={stats?.counts.total} 
        />
        <RequestStatusCard 
          title="Approved" 
          count={stats?.counts.approved} 
          variant="approved" 
        />
        <RequestStatusCard 
          title="Rejected" 
          count={stats?.counts.rejected} 
          variant="rejected" 
        />
      </div>

      {pendingRequests.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <Link to="/manager/requests?filter=pending">
              <Button variant="outline" size="sm">View All Pending</Button>
            </Link>
          </div>
          <RequestList 
            requests={pendingRequests.slice(0, 3)} 
            emptyMessage="No pending requests to review." 
          />
        </div>
      )}

      <RequestList 
        title="Recent Approved Requests" 
        requests={stats?.approved?.slice(0, 3) || []} 
        emptyMessage="No approved requests yet." 
      />

      <RequestList 
        title="Recent Rejected Requests" 
        requests={stats?.rejected?.slice(0, 3) || []} 
        emptyMessage="No rejected requests yet." 
      />
    </div>
  );
} 