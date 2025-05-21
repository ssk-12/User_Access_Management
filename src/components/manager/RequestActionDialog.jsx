import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../ui/dialog';

export default function RequestActionDialog({ 
  isOpen, 
  onOpenChange, 
  action, 
  onConfirm, 
  requestId,
  isSubmitting
}) {
  const [comments, setComments] = useState('');
  
  const handleConfirm = () => {
    onConfirm(requestId, action, comments);
    setComments('');
  };
  
  const getActionColor = () => {
    return action === 'Approved' 
      ? 'bg-green-600 hover:bg-green-700 text-white' 
      : 'border-red-300 text-red-600 hover:bg-red-50';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant={action === 'Approved' ? 'default' : 'outline'} 
          className={getActionColor()}
        >
          {action === 'Approved' ? 'Approve' : 'Reject'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirm {action === 'Approved' ? 'Approval' : 'Rejection'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Are you sure you want to {action === 'Approved' ? 'approve' : 'reject'} this access request?
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Comments (Optional)
            </label>
            <Textarea
              placeholder="Add any comments about your decision..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant={action === 'Approved' ? 'default' : 'destructive'}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Confirm ${action === 'Approved' ? 'Approval' : 'Rejection'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 