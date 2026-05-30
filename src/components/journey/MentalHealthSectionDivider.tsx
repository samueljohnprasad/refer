/**
 * MentalHealthSectionDivider (P1.4.5)
 *
 * Visual divider inserted between sections in the mental health journey map.
 * Shows section title + "X/Y nodes completed".
 * Locked sections show lock icon + "Complete previous section to unlock".
 *
 * Pure presentational — all data via props.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    LockIcon,
} from '@hugeicons/core-free-icons';

// ============================================================================
// Types
// ============================================================================

export interface MentalHealthSectionDividerProps {
    /** Section title */
    title: string;
    /** Section number (1-indexed) */
    sectionNumber: number;
    /** Total nodes in this section */
    totalNodes: number;
    /** Completed nodes in this section */
    completedNodes: number;
    /** Whether the section is locked */
    isLocked: boolean;
}

// ============================================================================
// Component
// ============================================================================

function MentalHealthSectionDividerInner({
    title,
    sectionNumber,
    totalNodes,
    completedNodes,
    isLocked,
}: MentalHealthSectionDividerProps): React.JSX.Element {
    const isComplete: boolean = completedNodes >= totalNodes && totalNodes > 0;

    return (
        <View className="w-full px-6 py-5 items-center">
            {/* Horizontal line */}
            <View className="w-16 h-0.5 bg-slate-200 mb-4" />

            {/* Section badge */}
            <View
                className={`flex-row items-center gap-2 px-4 py-2 rounded-2xl border ${isLocked
                    ? 'bg-slate-50 border-slate-200'
                    : isComplete
                        ? 'bg-green-50 border-green-200'
                        : 'bg-brand-surface border-slate-200'
                    }`}
            >
                {/* Icon */}
                {isLocked ? (
                    <HugeiconsIcon icon={LockIcon} size={16} color="#94A3B8" />
                ) : isComplete ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#16A34A" />
                ) : (
                    <Text className="text-sm font-bold text-ink-soft">
                        {sectionNumber}
                    </Text>
                )}

                {/* Title */}
                <Text
                    className={`text-sm font-semibold ${isLocked ? 'text-ink-muted' : 'text-ink'
                        }`}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </View>

            {/* Progress or locked message */}
            {isLocked ? (
                <Text className="text-xs text-ink-muted mt-2 text-center">
                    Complete previous section to unlock
                </Text>
            ) : (
                <Text
                    className={`text-xs mt-2 text-center ${isComplete ? 'text-green-600 font-semibold' : 'text-ink-muted'
                        }`}
                >
                    {isComplete
                        ? `All ${totalNodes} completed ✓`
                        : `${completedNodes}/${totalNodes} completed`}
                </Text>
            )}

            {/* Bottom line */}
            <View className="w-16 h-0.5 bg-slate-200 mt-4" />
        </View>
    );
}

export const MentalHealthSectionDivider = React.memo(MentalHealthSectionDividerInner);
export default MentalHealthSectionDivider;
