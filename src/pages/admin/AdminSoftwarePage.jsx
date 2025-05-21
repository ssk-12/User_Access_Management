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
    return <div className="flex justify-center p-4 sm:p-8 text-sm sm:text-base">Loading software data...</div>;
  }

  if (isError) {
    return <div className="text-red-500 p-4 sm:p-8 text-sm sm:text-base">Error loading software data. Please try again.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Software Management</h1>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto text-sm sm:text-base">
            Add New Software
          </Button>
        )}
      </div>
      
      {showAddForm ? (
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Add New Software</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <AddSoftwareForm 
              onSuccess={handleSoftwareAdded} 
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Software List</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-3 sm:px-4 py-3 text-xs sm:text-sm">ID</TableHead>
                    <TableHead className="px-3 sm:px-4 py-3 text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="px-3 sm:px-4 py-3 text-xs sm:text-sm">Description</TableHead>
                    <TableHead className="px-3 sm:px-4 py-3 text-xs sm:text-sm">Access Levels</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {softwareList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-xs sm:text-sm">
                        No software found
                      </TableCell>
                    </TableRow>
                  ) : (
                    softwareList.map((software) => (
                      <TableRow key={software.id}>
                        <TableCell className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{software.id}</TableCell>
                        <TableCell className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">{software.name}</TableCell>
                        <TableCell className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          <div className="max-w-[200px] sm:max-w-none truncate">
                            {software.description}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          <div className="max-w-[100px] sm:max-w-none truncate">
                            {software.accessLevels.join(', ')}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 