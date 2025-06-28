import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, SafeAreaView, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Simple desktop feed component
const DesktopFeed: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('Designer');
  const [locationQuery, setLocationQuery] = useState<string>('');
  
  // Sample job data matching the design
  const sampleJobs = [
    {
      id: '1',
      title: 'Principal Designer',
      company: 'Beats Corporation Inc.com',
      description: 'Lead the design vision, create intuitive user experiences, and collaborate with cross-functional teams to drive innovation.',
      location: 'Redwood City, CA',
      workType: 'On Site',
      jobType: 'Full-time',
      salary: '$3500 - $4500',
      skills: ['UI/UX Design', 'Product Design', 'Leadership'],
      postedTime: '1 Day ago',
      experienceLevel: 'Mid-Senior level',
      industry: 'Technology and Services',
      rewards: ['iPhone 16', 'Mystery Box', '$1000']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Word Flow',
      description: 'Build responsive UIs with modern frameworks, ensuring great performance and user experience as a Frontend Designer.',
      location: 'Ocean City, NJ',
      workType: 'Remote/Hybrid',
      jobType: 'Full-time',
      salary: '$2500 - $3000',
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
      postedTime: '2 days ago',
      experienceLevel: 'Mid-Senior level',
      industry: 'Technology and Services',
      rewards: ['iPhone 16', '$1000', 'Cash']
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'TuneIn Radio',
      description: 'Define product strategy, prioritize features, and align teams to deliver impactful solutions that meet business and user needs.',
      location: 'Redwood City, CA',
      workType: 'On Site',
      jobType: 'Full-time',
      salary: '$2000 - $2500',
      skills: ['Product Strategy', 'Analytics', 'Leadership'],
      postedTime: '3 days ago',
      experienceLevel: 'Mid-Senior level',
      industry: 'Technology and Services',
      rewards: ['Royal Resort Trip', 'Mystery Box', '$1000']
    }
  ];

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    maxWidth: 1400,
    alignSelf: 'center' as const,
    width: '100%'
  };

  const headerStyle = {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.lg
  };

  const searchContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.md
  };

  const searchSectionStyle = {
    flex: 2,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48
  };

  const locationSectionStyle = {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48
  };

  const searchButtonStyle = {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minWidth: 100
  };

  const mainContentStyle = {
    flex: 1,
    flexDirection: 'row' as const,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg
  };

  const leftColumnStyle = {
    flex: 2
  };

  const rightColumnStyle = {
    flex: 1,
    minWidth: 300,
    maxWidth: 400
  };

  const jobCardStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden' as const
  };

  const cardHeaderStyle = {
    flexDirection: 'row' as const,
    padding: theme.spacing.lg,
    alignItems: 'flex-start' as const,
    gap: theme.spacing.md
  };

  const companyLogoStyle = {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const
  };

  const jobInfoStyle = {
    flex: 1
  };

  const cardFooterStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md
  };

  const renderJobCard = ({ item }: { item: any }) => (
    <View style={jobCardStyle}>
      <View style={cardHeaderStyle}>
        <View style={companyLogoStyle}>
          <Text style={{ color: 'white', fontSize: theme.typography.fontSize.lg, fontWeight: '700' }}>
            {item.company.charAt(0)}
          </Text>
        </View>
        
        <View style={jobInfoStyle}>
          <Text style={{ 
            fontSize: theme.typography.fontSize.lg, 
            fontWeight: '600', 
            fontFamily: theme.typography.fontFamily.primary,
            color: theme.colors.text,
            marginBottom: theme.spacing.xs
          }}>
            {item.title}
          </Text>
          
          <Text style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.sm
          }}>
            {item.company}
          </Text>
          
          <Text style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.text,
            lineHeight: 20,
            marginBottom: theme.spacing.md
          }}>
            {item.description}
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: theme.spacing.md,
            marginBottom: theme.spacing.md
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <FontAwesome name="map-marker" size={14} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                {item.location}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <FontAwesome name="briefcase" size={14} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                {item.workType}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <FontAwesome name="clock-o" size={14} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                {item.jobType}
              </Text>
            </View>
            <Text style={{ 
              fontSize: theme.typography.fontSize.base, 
              fontWeight: '600', 
              color: theme.colors.text 
            }}>
              {item.salary}
            </Text>
          </View>
        </View>
      </View>

      <View style={cardFooterStyle}>
        <Text style={{ 
          fontSize: theme.typography.fontSize.xs, 
          color: theme.colors.textSecondary 
        }}>
          {item.postedTime}
        </Text>
        
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <TouchableOpacity style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
            minWidth: 80,
            justifyContent: 'center'
          }}>
            <FontAwesome name="send" size={14} color="white" />
            <Text style={{ 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: '500', 
              color: 'white' 
            }}>
              Apply
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
            minWidth: 80,
            justifyContent: 'center'
          }}>
            <FontAwesome name="share" size={14} color={theme.colors.primary} />
            <Text style={{ 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: '500', 
              color: theme.colors.primary 
            }}>
              Refer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <View style={searchContainerStyle}>
          <View style={searchSectionStyle}>
            <FontAwesome 
              name="search" 
              size={18} 
              color={theme.colors.textSecondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            
            <View style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm,
              padding: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: theme.spacing.sm
            }}>
              <Text style={{ 
                color: 'white', 
                fontSize: theme.typography.fontSize.sm,
                marginRight: theme.spacing.xs
              }}>
                Designer
              </Text>
              <TouchableOpacity style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FontAwesome name="times" size={10} color="white" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Job title, keywords, or company"
              placeholderTextColor={theme.colors.textSecondary}
              style={{ 
                flex: 1, 
                fontSize: theme.typography.fontSize.base, 
                color: theme.colors.text 
              }}
            />
          </View>

          <View style={locationSectionStyle}>
            <FontAwesome 
              name="map-marker" 
              size={18} 
              color={theme.colors.textSecondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <TextInput
              value={locationQuery}
              onChangeText={setLocationQuery}
              placeholder="City, state or zip code"
              placeholderTextColor={theme.colors.textSecondary}
              style={{ 
                flex: 1, 
                fontSize: theme.typography.fontSize.base, 
                color: theme.colors.text 
              }}
            />
          </View>

          <TouchableOpacity style={searchButtonStyle}>
            <Text style={{ 
              color: 'white', 
              fontSize: theme.typography.fontSize.base, 
              fontWeight: '500' 
            }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: theme.spacing.sm, 
          marginTop: theme.spacing.md,
          flexWrap: 'wrap' 
        }}>
          <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
            Filter:
          </Text>
          {/* Add filter buttons here */}
        </View>
      </View>

      <View style={mainContentStyle}>
        <View style={leftColumnStyle}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing.lg
          }}>
            <Text style={{ 
              fontSize: theme.typography.fontSize.lg, 
              fontWeight: '600',
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.text 
            }}>
              {sampleJobs.length} Jobs Found
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <Text style={{ 
                fontSize: theme.typography.fontSize.sm, 
                color: theme.colors.textSecondary 
              }}>
                Sort by
              </Text>
              <TouchableOpacity style={{
                padding: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card
              }}>
                <Text style={{ 
                  fontSize: theme.typography.fontSize.sm, 
                  color: theme.colors.text 
                }}>
                  Most Recent
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={sampleJobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          />
        </View>

        <View style={rightColumnStyle}>
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg
          }}>
            <Text style={{ 
              fontSize: theme.typography.fontSize.lg, 
              fontWeight: '600', 
              color: theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              Quick Tips
            </Text>
            <Text style={{ 
              fontSize: theme.typography.fontSize.sm, 
              color: theme.colors.textSecondary,
              lineHeight: 20
            }}>
              • Use specific keywords in your search{'\n'}
              • Filter by skills to find relevant opportunities{'\n'}
              • Check back regularly for new postings{'\n'}
              • Apply early for better chances
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const DesktopHomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DesktopFeed />
    </SafeAreaView>
  );
};

export default DesktopHomeScreen;
