import { useState, useEffect } from 'react';
import softwareService from '../../services/softwareService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AddSoftwareForm from '../../components/admin/AddSoftwareForm';

export default function AdminSoftwarePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [softwareList, setSoftwareList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const fetchSoftwareData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await softwareService.getAllSoftware();
      setSoftwareList(response.data);
    } catch (error) {
      console.error('Error fetching software:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftwareData();
  }, []);

  const handleSoftwareAdded = () => {
    fetchSoftwareData();
    setShowAddForm(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading software data...</div>;
  }

  if (isError) {
    return <div className="text-red-500 p-8">Error loading software data. Please try again.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Software Management</h1>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            Add New Software
          </Button>
        )}
      </div>
      
      {showAddForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Software</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSoftwareForm 
              onSuccess={handleSoftwareAdded} 
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Software List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Access Levels</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {softwareList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No software found
                    </TableCell>
                  </TableRow>
                ) : (
                  softwareList.map((software) => (
                    <TableRow key={software.id}>
                      <TableCell>{software.id}</TableCell>
                      <TableCell>{software.name}</TableCell>
                      <TableCell>{software.description}</TableCell>
                      <TableCell>{software.accessLevels.join(', ')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 