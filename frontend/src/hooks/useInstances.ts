import { useState, useCallback } from 'react';

interface Instance {
  InstanceId: string;
  State: string;
  LaunchTime: string;
  InstanceType: string;
}

interface UseInstancesResult {
  instances: Instance[];
  loading: boolean;
  error: string | null;
  fetchInstances: (region: string) => Promise<void>;
}

export const useInstances = (): UseInstancesResult => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async (region: string) => {
    if (!region) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/get_instances?region=${region}`
      );
      const data = await response.json();
      console.log('🔵 [useInstances] raw data:', data);
      if (data.status === 'success') {
        setInstances(data.instances || []);
      } else {
        setError(data.message || 'Failed to fetch instances.');
      }
    } catch (err) {
      console.error('🔴 [useInstances] error:', err);
      setError('Failed to fetch instances. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);  // ← stable identity

  return { instances, loading, error, fetchInstances };
};
