import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DesktopReferrerDashboardPresentation from './DesktopReferrerDashboardPresentation';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';

export interface ReferralMetrics {
  activeReferrals: number;
  successRate: number;
  totalEarnings: number;
  responseRate: number;
  totalReferrals: number;
  successfulPlacements: number;
}

export interface ReferralItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  status: 'pending' | 'submitted' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  stage: number; // 1-9 for progress tracking
  reward: number;
  notes?: string;
}

export interface NetworkConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  successRate: number;
  totalReferrals: number;
  industry: string;
  lastInteraction: string;
}

export interface ReferralOpportunity {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  candidateMatch: string;
  matchScore: number;
  postedDate: string;
  urgency: 'low' | 'medium' | 'high';
  referralReward: number;
}

export interface DashboardActivity {
  id: string;
  type: 'request_received' | 'status_update' | 'message' | 'reward_earned' | 'opportunity_matched';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  relatedReferralId?: string;
}

interface DesktopReferrerDashboardProps {
  theme: EnhancedThemeInterface;
}

const DesktopReferrerDashboard: React.FC<DesktopReferrerDashboardProps> = ({
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'network' | 'opportunities' | 'analytics'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data - in real app this would come from Redux/API
  const [metrics, setMetrics] = useState<ReferralMetrics>({
    activeReferrals: 12,
    successRate: 68,
    totalEarnings: 15750,
    responseRate: 89,
    totalReferrals: 47,
    successfulPlacements: 32
  });

  const [referrals, setReferrals] = useState<ReferralItem[]>([
    {
      id: '1',
      candidateName: 'Sarah Chen',
      candidateEmail: 'sarah.chen@email.com',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      status: 'interviewing',
      submittedDate: '2024-01-15',
      lastUpdated: '2024-01-22',
      stage: 6,
      reward: 2500,
      notes: 'Strong React background, currently in final round'
    },
    {
      id: '2',
      candidateName: 'Michael Rodriguez',
      candidateEmail: 'michael.r@email.com',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      companyLogo: 'SX',
      status: 'reviewing',
      submittedDate: '2024-01-20',
      lastUpdated: '2024-01-21',
      stage: 4,
      reward: 1500,
      notes: 'Profile submitted to hiring manager'
    },
    {
      id: '3',
      candidateName: 'Emma Thompson',
      candidateEmail: 'emma.t@email.com',
      jobTitle: 'UX Designer',
      company: 'DesignStudio Pro',
      companyLogo: 'DS',
      status: 'hired',
      submittedDate: '2024-01-08',
      lastUpdated: '2024-01-25',
      stage: 9,
      reward: 2000,
      notes: 'Successfully placed! Reward earned.'
    }
  ]);

  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([
    {
      id: '1',
      name: 'David Kim',
      title: 'Engineering Manager',
      company: 'TechCorp Inc',
      avatar: 'DK',
      successRate: 85,
      totalReferrals: 6,
      industry: 'Technology',
      lastInteraction: '2024-01-20'
    },
    {
      id: '2',
      name: 'Lisa Zhang',
      title: 'VP of Product',
      company: 'StartupXYZ',
      avatar: 'LZ',
      successRate: 72,
      totalReferrals: 4,
      industry: 'Technology',
      lastInteraction: '2024-01-18'
    }
  ]);

  const [opportunities, setOpportunities] = useState<ReferralOpportunity[]>([
    {
      id: '1',
      jobTitle: 'Senior React Developer',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      candidateMatch: 'Alex Johnson',
      matchScore: 94,
      postedDate: '2024-01-22',
      urgency: 'high',
      referralReward: 3000
    },
    {
      id: '2',
      jobTitle: 'Product Designer',
      company: 'CreativeHub',
      companyLogo: 'CH',
      location: 'Remote',
      salary: '$90k - $120k',
      candidateMatch: 'Jessica Wang',
      matchScore: 87,
      postedDate: '2024-01-21',
      urgency: 'medium',
      referralReward: 2500
    }
  ]);

  const [activities, setActivities] = useState<DashboardActivity[]>([
    {
      id: '1',
      type: 'status_update',
      title: 'Interview Scheduled',
      description: 'Sarah Chen has an interview scheduled for Senior Frontend Developer at TechCorp Inc',
      timestamp: '2024-01-22T10:30:00Z',
      read: false,
      relatedReferralId: '1'
    },
    {
      id: '2',
      type: 'reward_earned',
      title: 'Referral Reward Earned',
      description: 'Congratulations! You earned $2,000 for Emma Thompson\'s successful placement',
      timestamp: '2024-01-22T09:15:00Z',
      read: false,
      relatedReferralId: '3'
    },
    {
      id: '3',
      type: 'request_received',
      title: 'New Referral Request',
      description: 'Tom Wilson is requesting a referral for Backend Developer position',
      timestamp: '2024-01-21T16:45:00Z',
      read: true,
      actionRequired: true
    }
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: 'overview' | 'pipeline' | 'network' | 'opportunities' | 'analytics') => {
    setActiveTab(tab);
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedTimeRange(range);
    // Trigger data refetch based on time range
  };

  const handleReferralAction = (referralId: string, action: 'view' | 'message' | 'follow_up') => {
    console.log('Referral action:', { referralId, action });
    // Implement referral actions
  };

  const handleOpportunityAction = (opportunityId: string, action: 'refer' | 'save' | 'dismiss') => {
    console.log('Opportunity action:', { opportunityId, action });
    // Implement opportunity actions
  };

  const handleNetworkAction = (connectionId: string, action: 'message' | 'view_profile' | 'request_referral') => {
    console.log('Network action:', { connectionId, action });
    // Implement network actions
  };

  const handleActivityAction = (activityId: string, action: 'mark_read' | 'take_action' | 'dismiss') => {
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

  const refreshData = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <DesktopReferrerDashboardPresentation
      theme={theme}
      activeTab={activeTab}
      selectedTimeRange={selectedTimeRange}
      loading={loading}
      metrics={metrics}
      referrals={referrals}
      networkConnections={networkConnections}
      opportunities={opportunities}
      activities={activities}
      onTabChange={handleTabChange}
      onTimeRangeChange={handleTimeRangeChange}
      onReferralAction={handleReferralAction}
      onOpportunityAction={handleOpportunityAction}
      onNetworkAction={handleNetworkAction}
      onActivityAction={handleActivityAction}
      onRefresh={refreshData}
    />
  );
};

export default DesktopReferrerDashboard;
