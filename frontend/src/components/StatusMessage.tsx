import React from 'react';
import { CheckCircle, AlertCircle, UserCircle as LoaderCircle } from 'lucide-react';

interface StatusMessageProps {
  status: 'success' | 'error' | 'loading' | null;
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, message }) => {
  if (!status) return null;

  const statusConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
    },
    loading: {
      icon: LoaderCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-md p-4 mt-4 flex items-start`}>
      <div className="flex-shrink-0 mr-3">
        {status === 'loading' ? (
          <Icon className="h-5 w-5 animate-spin" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default StatusMessage;