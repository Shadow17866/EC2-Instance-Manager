import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ChevronRight, RefreshCw } from 'lucide-react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import StatusMessage from '../components/StatusMessage';
import { useRegions } from '../hooks/useRegions';
import { useInstances } from '../hooks/useInstances';
import { ProcessStep } from '../types';

const TerminateProcess: React.FC = () => {
  const navigate = useNavigate();
  const regions = useRegions();
  const { instances, loading, error, fetchInstances } = useInstances();

  const [formData, setFormData] = useState({
    region: '',
    instanceId: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [terminateStatus, setTerminateStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const steps: ProcessStep[] = [
    { id: 1, title: 'Select Region', description: 'Choose AWS region with instances', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Select Instance', description: 'Choose instance to terminate', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, title: 'Confirm Termination', description: 'Review and confirm your action', status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending' },
  ];

  // Fetch whenever region changes
  useEffect(() => {
    if (formData.region) {
      console.log('🚀 [TerminateProcess] fetching for region:', formData.region);
      fetchInstances(formData.region);
    }
  }, [formData.region, fetchInstances]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => currentStep < steps.length && setCurrentStep(prev => prev + 1);
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === 2) setFormData(prev => ({ ...prev, instanceId: '' }));
    }
  };
  const handleRefresh = () => formData.region && fetchInstances(formData.region);

  const handleTerminate = async () => {
    const { region, instanceId } = formData;
    if (!region || !instanceId) return;

    setTerminateStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('http://localhost:5000/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminate_region: region, instance_id: instanceId }),
      });
      const result = await res.json();
      setTerminateStatus(result.status === 'success' ? 'success' : 'error');
      setStatusMessage(result.message);
    } catch {
      setTerminateStatus('error');
      setStatusMessage('An error occurred during termination.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField label="AWS Region" id="region" value={formData.region} onChange={handleChange} options={regions.map(r => r.name)} required />
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext} disabled={!formData.region}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Instances in {formData.region}</h3>
              <Button variant="outline" onClick={handleRefresh} className="py-1 px-2"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
            </div>

            {loading ? (
              <div className="text-center py-4"><RefreshCw className="h-6 w-6 animate-spin mx-auto" /><p>Loading instances...</p></div>
            ) : error ? (
              <StatusMessage status="error" message={error} />
            ) : instances.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded-md"><p>No instances found in this region.</p></div>
            ) : (
              <div className="bg-white border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Instance ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">State</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Launch Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Select</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {instances.map(i => (
                      <tr key={i.InstanceId}>
                        <td className="px-4 py-3">{i.InstanceId}</td>
                        <td className="px-4 py-3">{i.InstanceType}</td>
                        <td className="px-4 py-3"><span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          i.State === 'running' ? 'bg-green-100 text-green-800' :
                          i.State === 'stopped' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{i.State}</span></td>
                        <td className="px-4 py-3">{i.LaunchTime}</td>
                        <td className="px-4 py-3">
                          <input type="radio" name="instanceId" value={i.InstanceId}
                            checked={formData.instanceId === i.InstanceId}
                            onChange={() => setFormData(prev => ({ ...prev, instanceId: i.InstanceId }))}
                            className="h-4 w-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!formData.instanceId}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Confirm Termination</h3>
              <p className="mt-2">You're about to terminate <span className="font-semibold">{formData.instanceId}</span> in {formData.region}.</p>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 font-medium">Warning:</p>
                <p className="text-red-600 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <StatusMessage status={terminateStatus} message={statusMessage} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button variant="danger" onClick={handleTerminate} disabled={terminateStatus === 'loading' || terminateStatus === 'success'}>
                {terminateStatus === 'loading' ? 'Terminating...' : 'Confirm Termination'}
              </Button>
            </div>
            {terminateStatus === 'success' && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate('/')}>Return to Home</Button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terminate EC2 Instance</h1>
        <div className="mb-8 flex items-center justify-between">
          {steps.map(step => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step.status === 'completed' ? 'bg-green-500 text-white' :
                  step.status === 'active' ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>
                <p className="text-sm mt-2">{step.title}</p>
              </div>
              {step.id !== steps.length && <div className={`flex-grow h-1 mx-2 ${
                step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default TerminateProcess;
