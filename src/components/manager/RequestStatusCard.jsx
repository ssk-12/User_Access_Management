import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function RequestStatusCard({ title, count, variant = 'default' }) {
  const getColorClass = () => {
    switch (variant) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <span className={`text-4xl font-bold ${getColorClass()}`}>{count || 0}</span>
        <span className="text-muted-foreground">{title.toLowerCase()} requests</span>
      </CardContent>
    </Card>
  );
} 