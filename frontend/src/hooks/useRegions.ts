import { useState, useEffect } from 'react';

const AWS_REGIONS = [
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "ap-south-1", "ap-northeast-3", "ap-northeast-2", "ap-southeast-1",
  "ap-southeast-2", "ap-northeast-1", "ca-central-1", "eu-central-1",
  "eu-west-1", "eu-west-2", "eu-west-3", "sa-east-1"
];

interface RegionData {
  id: string;
  name: string;
  displayName: string;
}

const regionDisplayNames: Record<string, string> = {
  "us-east-1": "US East (N. Virginia)",
  "us-east-2": "US East (Ohio)",
  "us-west-1": "US West (N. California)",
  "us-west-2": "US West (Oregon)",
  "ap-south-1": "Asia Pacific (Mumbai)",
  "ap-northeast-3": "Asia Pacific (Osaka)",
  "ap-northeast-2": "Asia Pacific (Seoul)",
  "ap-southeast-1": "Asia Pacific (Singapore)",
  "ap-southeast-2": "Asia Pacific (Sydney)",
  "ap-northeast-1": "Asia Pacific (Tokyo)",
  "ca-central-1": "Canada (Central)",
  "eu-central-1": "Europe (Frankfurt)",
  "eu-west-1": "Europe (Ireland)",
  "eu-west-2": "Europe (London)",
  "eu-west-3": "Europe (Paris)",
  "sa-east-1": "South America (São Paulo)"
};

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionData[]>([]);
  
  useEffect(() => {
    const formattedRegions = AWS_REGIONS.map(region => ({
      id: region,
      name: region,
      displayName: regionDisplayNames[region] || region
    }));
    
    setRegions(formattedRegions);
  }, []);
  
  return regions;
};