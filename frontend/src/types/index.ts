export interface DeploymentFormData {
  region: string;
  instances: number;
}

export interface TerminationFormData {
  region: string;
  instanceId: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}