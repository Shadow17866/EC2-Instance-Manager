import React from 'react';
import { Server, XCircle } from 'lucide-react';
import ActionCard from '../components/ActionCard';

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#232F3E] mb-4">EC2 Instance Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Easily deploy new EC2 instances or terminate existing ones across multiple AWS regions with our simple and intuitive interface.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActionCard 
            title="Deploy Instance" 
            description="Launch new EC2 instances in your preferred AWS region with custom configurations."
            icon={Server}
            path="/deploy"
            bgColor="bg-gradient-to-br from-blue-600 to-blue-800"
          />
          <ActionCard 
            title="Terminate Instance" 
            description="Safely terminate EC2 instances that are no longer needed to optimize costs."
            icon={XCircle}
            path="/terminate"
            bgColor="bg-gradient-to-br from-red-600 to-red-800"
          />
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#232F3E] mb-4 text-center">Why Use Our EC2 Manager?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Quick Deployment</h3>
            <p className="text-gray-600">Deploy instances in seconds with minimal configuration required.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Multi-Region Support</h3>
            <p className="text-gray-600">Manage EC2 instances across all AWS regions from a single interface.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Cost Optimization</h3>
            <p className="text-gray-600">Easily terminate unused instances to keep your AWS costs under control.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;