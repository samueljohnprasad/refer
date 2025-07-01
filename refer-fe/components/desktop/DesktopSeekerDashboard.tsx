import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DesktopSeekerDashboardPresentation from './DesktopSeekerDashboardPresentation';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';

export interface SeekerMetrics {
  activeRequests: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
  totalRequests: number;
  successfulPlacements: number;
}

export interface ReferralRequest {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  referrerName: string;
  referrerTitle: string;
  referrerAvatar: string;
  status: 'pending' | 'accepted' | 'submitted' | 'interviewing' | 'hired' | 'rejected' | 'declined';
  requestDate: string;
  lastUpdated: string;
  stage: number; // 1-9 for progress tracking
  applicationId?: string;
  notes?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  connectionStrength: 'strong' | 'medium' | 'weak';
  mutualConnections: number;
  responseRate: number;
  lastInteraction: string;
  industry: string;
  openToReferrals: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  postedDate: string;
  matchScore: number;
  hasReferrer: boolean;
  referrerName?: string;
  referrerTitle?: string;
  urgency: 'low' | 'medium' | 'high';
  requirements: string[];
}

export interface RequestActivity {
  id: string;
  type: 'request_sent' | 'response_received' | 'application_submitted' | 'interview_scheduled' | 'status_update';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  relatedRequestId?: string;
}

interface DesktopSeekerDashboardProps {
  theme: EnhancedThemeInterface;
}

const DesktopSeekerDashboard: React.FC<DesktopSeekerDashboardProps> = ({
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'network' | 'opportunities' | 'composer'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data - in real app this would come from Redux/API
  const [metrics, setMetrics] = useState<SeekerMetrics>({
    activeRequests: 8,
    responseRate: 75,
    interviewRate: 45,
    successRate: 32,
    totalRequests: 23,
    successfulPlacements: 2
  });

  const [requests, setRequests] = useState<ReferralRequest[]>([
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      referrerName: 'David Kim',
      referrerTitle: 'Engineering Manager',
      referrerAvatar: 'DK',
      status: 'interviewing',
      requestDate: '2024-01-18',
      lastUpdated: '2024-01-25',
      stage: 6,
      applicationId: 'APP-001',
      notes: 'Interview scheduled for next Tuesday. Referrer provided internal insights.',
      urgency: 'high'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      companyLogo: 'SX',
      location: 'Remote',
      salary: '$100k - $130k',
      referrerName: 'Lisa Zhang',
      referrerTitle: 'VP of Product',
      referrerAvatar: 'LZ',
      status: 'submitted',
      requestDate: '2024-01-20',
      lastUpdated: '2024-01-23',
      stage: 4,
      applicationId: 'APP-002',
      notes: 'Application submitted through internal portal. Waiting for initial review.',
      urgency: 'medium'
    },
    {
      id: '3',
      jobTitle: 'UX Designer',
      company: 'DesignStudio Pro',
      companyLogo: 'DS',
      location: 'New York, NY',
      salary: '$85k - $110k',
      referrerName: 'Emma Wilson',
      referrerTitle: 'Design Lead',
      referrerAvatar: 'EW',
      status: 'pending',
      requestDate: '2024-01-22',
      lastUpdated: '2024-01-22',
      stage: 1,
      notes: 'Referral request sent. Awaiting response from referrer.',
      urgency: 'low'
    }
  ]);

  const [networkContacts, setNetworkContacts] = useState<NetworkContact[]>([
    {
      id: '1',
      name: 'David Kim',
      title: 'Engineering Manager',
      company: 'TechCorp Inc',
      avatar: 'DK',
      connectionStrength: 'strong',
      mutualConnections: 8,
      responseRate: 95,
      lastInteraction: '2024-01-20',
      industry: 'Technology',
      openToReferrals: true
    },
    {
      id: '2',
      name: 'Lisa Zhang',
      title: 'VP of Product',
      company: 'StartupXYZ',
      avatar: 'LZ',
      connectionStrength: 'medium',
      mutualConnections: 3,
      responseRate: 80,
      lastInteraction: '2024-01-18',
      industry: 'Technology',
      openToReferrals: true
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      title: 'Senior Developer',
      company: 'BigTech Corp',
      avatar: 'MR',
      connectionStrength: 'medium',
      mutualConnections: 5,
      responseRate: 70,
      lastInteraction: '2024-01-15',
      industry: 'Technology',
      openToReferrals: false
    }
  ]);

  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      location: 'San Francisco, CA',
      salary: '$130k - $170k',
      postedDate: '2024-01-23',
      matchScore: 94,
      hasReferrer: true,
      referrerName: 'David Kim',
      referrerTitle: 'Engineering Manager',
      urgency: 'high',
      requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience']
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'CreativeHub',
      companyLogo: 'CH',
      location: 'Remote',
      salary: '$90k - $120k',
      postedDate: '2024-01-22',
      matchScore: 87,
      hasReferrer: false,
      urgency: 'medium',
      requirements: ['Figma', 'Design Systems', 'User Research', '3+ years experience']
    }
  ]);

  const [activities, setActivities] = useState<RequestActivity[]>([
    {
      id: '1',
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      description: 'Your interview for Senior Frontend Developer at TechCorp Inc is confirmed for Jan 30th',
      timestamp: '2024-01-25T14:30:00Z',
      read: false,
      relatedRequestId: '1'
    },
    {
      id: '2',
      type: 'application_submitted',
      title: 'Application Submitted',
      description: 'Your application for Product Manager at StartupXYZ has been submitted through referral',
      timestamp: '2024-01-23T16:45:00Z',
      read: false,
      relatedRequestId: '2'
    },
    {
      id: '3',
      type: 'response_received',
      title: 'Referrer Responded',
      description: 'David Kim accepted your referral request for Senior Frontend Developer position',
      timestamp: '2024-01-20T10:15:00Z',
      read: true,
      relatedRequestId: '1'
    }
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: 'overview' | 'requests' | 'network' | 'opportunities' | 'composer') => {
    setActiveTab(tab);
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedTimeRange(range);
    // Trigger data refetch based on time range
  };

  const handleRequestAction = (requestId: string, action: 'view' | 'message' | 'follow_up' | 'withdraw') => {
    console.log('Request action:', { requestId, action });
    // Implement request actions
  };

  const handleNetworkAction = (contactId: string, action: 'message' | 'view_profile' | 'request_referral') => {
    console.log('Network action:', { contactId, action });
    // Implement network actions
  };

  const handleOpportunityAction = (opportunityId: string, action: 'apply' | 'request_referral' | 'save' | 'dismiss') => {
    console.log('Opportunity action:', { opportunityId, action });
    // Implement opportunity actions
  };

  const handleActivityAction = (activityId: string, action: 'mark_read' | 'view_details' | 'dismiss') => {
    console.log('Activity action:', { activityId, action });
    
    if (action === 'mark_read') {
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, read: true }
            : activity
        )
      );
    }
  };

  const handleCreateRequest = (requestData: Partial<ReferralRequest>) => {
    console.log('Create request:', requestData);
    // Implement request creation
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <DesktopSeekerDashboardPresentation
      theme={theme}
      activeTab={activeTab}
      selectedTimeRange={selectedTimeRange}
      loading={loading}
      metrics={metrics}
      requests={requests}
      networkContacts={networkContacts}
      opportunities={opportunities}
      activities={activities}
      onTabChange={handleTabChange}
      onTimeRangeChange={handleTimeRangeChange}
      onRequestAction={handleRequestAction}
      onNetworkAction={handleNetworkAction}
      onOpportunityAction={handleOpportunityAction}
      onActivityAction={handleActivityAction}
      onCreateRequest={handleCreateRequest}
      onRefresh={refreshData}
    />
  );
};

export default DesktopSeekerDashboard;
