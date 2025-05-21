import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import requestService from '../../services/requestService';
import softwareService from '../../services/softwareService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const NewRequestPage = () => {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        setLoading(true);
        const response = await softwareService.getAllSoftware();
        setSoftware(response.data);
      } catch (err) {
        setError('Failed to load software list');
      } finally {
        setLoading(false);
      }
    };

    fetchSoftware();
  }, []);

  const formik = useFormik({
    initialValues: {
      softwareId: '',
      accessType: '',
      reason: '',
    },
    validationSchema: Yup.object({
      softwareId: Yup.string().required('Software selection is required'),
      accessType: Yup.string().required('Access type is required'),
      reason: Yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitLoading(true);
        await requestService.createRequest(values);
        navigate('/employee/requests', { state: { success: true } });
      } catch (err) {
        setError('Failed to submit request. Please try again.');
        setSubmitLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-4 sm:py-6 px-4 sm:px-6 overflow-x-auto">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6">New Access Request</h1>
      
      <Card className="shadow-lg border-muted min-w-[280px]">
        <CardHeader className="bg-muted/40 px-4 sm:px-6 py-3 sm:py-4">
          <CardTitle className="text-lg sm:text-xl">Request Details</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 overflow-y-auto">
          {error && (
            <Alert variant="destructive" className="mb-4 sm:mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="software-select" className={formik.touched.softwareId && formik.errors.softwareId ? "text-destructive font-medium" : "font-medium"}>
                Software
              </Label>
              
              <div className="relative">
                <select
                  id="software-select"
                  name="softwareId"
                  value={formik.values.softwareId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={submitLoading}
                  className={`w-full h-10 sm:h-11 px-3 py-2 rounded-md border ${
                    formik.touched.softwareId && formik.errors.softwareId 
                    ? "border-destructive" 
                    : "border-input"
                  } bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none`}
                >
                  <option value="">Select Software</option>
                  {software.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-50"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              
              {formik.touched.softwareId && formik.errors.softwareId && (
                <p className="text-xs sm:text-sm text-destructive font-medium mt-1">{formik.errors.softwareId}</p>
              )}
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label className={formik.touched.accessType && formik.errors.accessType ? "text-destructive font-medium" : "font-medium"}>
                Access Type
              </Label>
              <RadioGroup
                value={formik.values.accessType}
                onValueChange={(value) => formik.setFieldValue('accessType', value)}
                disabled={submitLoading}
                className="flex flex-col space-y-2 sm:space-y-3 pt-1"
              >
                <div className="flex items-center space-x-3 rounded-md border p-2 sm:p-3 hover:bg-muted/50">
                  <RadioGroupItem value="Read" id="accessTypeRead" />
                  <Label htmlFor="accessTypeRead" className="cursor-pointer font-normal">
                    <div className="font-medium">Read</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">View only access to the software</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-md border p-2 sm:p-3 hover:bg-muted/50">
                  <RadioGroupItem value="Write" id="accessTypeWrite" />
                  <Label htmlFor="accessTypeWrite" className="cursor-pointer font-normal">
                    <div className="font-medium">Write</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Create and modify data in the software</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-md border p-2 sm:p-3 hover:bg-muted/50">
                  <RadioGroupItem value="Admin" id="accessTypeAdmin" />
                  <Label htmlFor="accessTypeAdmin" className="cursor-pointer font-normal">
                    <div className="font-medium">Admin</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Full control with administrative privileges</p>
                  </Label>
                </div>
              </RadioGroup>
              {formik.touched.accessType && formik.errors.accessType && (
                <p className="text-xs sm:text-sm text-destructive font-medium mt-1">{formik.errors.accessType}</p>
              )}
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="reason" className={formik.touched.reason && formik.errors.reason ? "text-destructive font-medium" : "font-medium"}>
                Reason for Request
              </Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please explain why you need access to this software"
                rows={4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reason}
                disabled={submitLoading}
                className={`${formik.touched.reason && formik.errors.reason ? "border-destructive" : ""} resize-none min-h-24 sm:min-h-32`}
              />
              {formik.touched.reason && formik.errors.reason && (
                <p className="text-xs sm:text-sm text-destructive font-medium mt-1">{formik.errors.reason}</p>
              )}
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 bg-muted/20 py-3 sm:py-4 px-4 sm:px-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate('/employee/requests')}
            disabled={submitLoading}
            className="w-full sm:w-auto h-9 sm:h-10"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={formik.handleSubmit}
            disabled={submitLoading}
            className="w-full sm:w-auto h-9 sm:h-10"
          >
            {submitLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewRequestPage;