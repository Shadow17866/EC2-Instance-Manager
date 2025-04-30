import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ChevronRight } from 'lucide-react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import StatusMessage from '../components/StatusMessage';
import { useRegions } from '../hooks/useRegions';
import { ProcessStep } from '../types';

const DeployProcess: React.FC = () => {
  const navigate = useNavigate();
  const regions = useRegions();

  const [formData, setFormData] = useState({
    region: '',
    instances: 1,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [deployStatus, setDeployStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const steps: ProcessStep[] = [
    {
      id: 1,
      title: 'Configure Deployment',
      description: 'Select the AWS region and number of instances',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending',
    },
    {
      id: 2,
      title: 'Review Configuration',
      description: 'Confirm your deployment settings',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending',
    },
    {
      id: 3,
      title: 'Deploy Instances',
      description: 'Launch your EC2 instances',
      status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'instances' ? Number(value) : value,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDeploy = async () => {
    if (!formData.region || !formData.instances) return;

    setDeployStatus('loading');
    setStatusMessage('Deployment in progress...');

    try {
      const response = await fetch('http://localhost:5000/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: formData.region,
          instances: formData.instances,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setDeployStatus('success');
        setStatusMessage(result.message);
      } else {
        setDeployStatus('error');
        setStatusMessage('Deployment failed: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      setDeployStatus('error');
      setStatusMessage('An error occurred during deployment.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              label="AWS Region"
              id="region"
              value={formData.region}
              onChange={handleChange}
              options={regions.map((r) => r.name)}
              required
            />
            <FormField
              label="Number of Instances"
              id="instances"
              type="number"
              value={formData.instances}
              onChange={handleChange}
              required
              min={1}
              max={10}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext} disabled={!formData.region || formData.instances < 1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Deployment Configuration</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-gray-500">Region:</p>
                <p className="font-medium">{formData.region}</p>
                <p className="text-gray-500">Instances:</p>
                <p className="font-medium">{formData.instances}</p>
                <p className="text-gray-500">Instance Type:</p>
                <p className="font-medium">t2.micro (Free Tier eligible)</p>
                <p className="text-gray-500">AMI:</p>
                <p className="font-medium">Latest Amazon Linux 2</p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Server className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold">Ready to Deploy</h3>
              <p className="text-gray-600 mt-2">
                You're about to deploy {formData.instances} EC2 instance(s) in the {formData.region} region.
              </p>
            </div>
            <StatusMessage status={deployStatus} message={statusMessage} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={deployStatus === 'loading' || deployStatus === 'success'}
              >
                {deployStatus === 'loading' ? 'Deploying...' : 'Deploy Instances'}
              </Button>
            </div>
            {deployStatus === 'success' && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
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
        <h1 className="text-3xl font-bold text-[#232F3E] mb-8">Deploy EC2 Instances</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'active'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500 hidden md:block">{step.description}</p>
                  </div>
                </div>
                {step.id !== steps.length && (
                  <div
                    className={`flex-grow h-1 mx-2 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default DeployProcess;
