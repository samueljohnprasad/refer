import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Idea01Icon, Clock01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

import { CBTExercise } from '@/src/types/exercises';
import { CBT_EXERCISES } from '@/src/data/exercises';

export default function ExercisesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }}>
        
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center mt-4">
          <View className="flex-1 pr-4">
            <Text className="text-3xl font-bold text-slate-800 mb-2">CBT Exercises</Text>
            <Text className="text-base text-slate-500">
              Choose an exercise to help you feel better.
            </Text>
          </View>
          <View className="h-16 w-16 items-center justify-center -mr-2">
            {/* Placeholder for the Brain illustration */}
             <Text className="text-[46px]">🧠</Text>
          </View>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 rounded-2xl p-4 flex-row items-start mb-8 border border-blue-100">
          <View className="h-8 w-8 bg-blue-500 rounded-full items-center justify-center mt-0.5">
            {/* Blue Icon with lightbulb */}
            <HugeiconsIcon icon={Idea01Icon} size={18} color="white" variant="solid" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-slate-700 text-[15px] leading-snug">
              <Text className="font-bold">How to use: </Text>
              Pick one exercise at a time. Each one takes just 2-3 minutes.
            </Text>
          </View>
        </View>

        {/* Exercise List */}
        <View className="space-y-4">
          {CBT_EXERCISES.map((exercise: CBTExercise) => (
            <Pressable 
              key={exercise.id}
              className="bg-white rounded-[24px] p-4 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center active:bg-slate-50 mb-4"
            >
              <View 
                style={{ backgroundColor: exercise.backgroundColor }}
                className="h-16 w-16 rounded-2xl items-center justify-center mr-4"
              >
                 {/* Brain character placeholder */}
                 <Text className="text-[32px]">{exercise.icon}</Text>
                 <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                   <Text className="text-sm">{exercise.badgeIcon}</Text>
                 </View>
              </View>
              <View className="flex-1 py-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-[17px] font-bold text-slate-800 mr-2">{exercise.title}</Text>
                  <View className={`${exercise.badgeColor} px-[6px] py-[2px] rounded-md`}>
                    <Text className={`${exercise.badgeTextColor} text-[10px] font-bold uppercase tracking-wider`}>Step {exercise.step}</Text>
                  </View>
                </View>
                <Text className="text-[14px] text-slate-500 mb-2 font-medium">{exercise.subtitle}</Text>
                <View className="flex-row items-center">
                  <View className="bg-slate-100 px-2 py-1 rounded-full flex-row items-center">
                    <HugeiconsIcon icon={Clock01Icon} size={12} color="#64748B" />
                    <Text className="text-slate-500 text-xs font-bold ml-[4px]">{exercise.duration}</Text>
                  </View>
                </View>
              </View>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
