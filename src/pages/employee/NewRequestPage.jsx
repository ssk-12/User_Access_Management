import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import requestService from '../../services/requestService';
import softwareService from '../../services/softwareService';

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
        console.error(err);
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
        console.error(err);
        setSubmitLoading(false);
      }
    },
  });

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New Access Request</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="softwareId">
              Software
            </label>
            <select
              id="softwareId"
              name="softwareId"
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.softwareId && formik.errors.softwareId
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.softwareId}
              disabled={submitLoading}
            >
              <option value="">Select Software</option>
              {software.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {formik.touched.softwareId && formik.errors.softwareId && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.softwareId}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accessType">
              Access Type
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="accessTypeRead"
                  name="accessType"
                  type="radio"
                  value="READ"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.accessType === 'READ'}
                  disabled={submitLoading}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="accessTypeRead" className="ml-2 block text-gray-700">
                  Read (View only)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="accessTypeWrite"
                  name="accessType"
                  type="radio"
                  value="WRITE"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.accessType === 'WRITE'}
                  disabled={submitLoading}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="accessTypeWrite" className="ml-2 block text-gray-700">
                  Write (Create and modify)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="accessTypeAdmin"
                  name="accessType"
                  type="radio"
                  value="ADMIN"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.accessType === 'ADMIN'}
                  disabled={submitLoading}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="accessTypeAdmin" className="ml-2 block text-gray-700">
                  Admin (Full control)
                </label>
              </div>
            </div>
            {formik.touched.accessType && formik.errors.accessType && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.accessType}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
              Reason for Request
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.reason && formik.errors.reason
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Please explain why you need access to this software"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reason}
              disabled={submitLoading}
            ></textarea>
            {formik.touched.reason && formik.errors.reason && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.reason}</p>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => navigate('/employee/requests')}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
              disabled={submitLoading}
            >
              {submitLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestPage;