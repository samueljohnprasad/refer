/**
 * JournalNodeRenderer (P1.3.3)
 * Guided journaling renderer for Journal nodes.
 *
 * Flow:
 * 1. Mood before (if content.mood_before) — emoji picker
 * 2. Writing surface — guided prompt + large TextInput + word count
 * 3. Emotion tags — optional tag selector
 * 4. Mood after (if content.mood_after) — emoji picker
 * 5. "Save & Continue" CTA
 *
 * Integration:
 * - Saves to existing journal_records via onSave callback
 * - Tags entry with journey_slug + node_id for AI analysis
 * - Placeholder mic button for Phase 3 Whisper
 *
 * Presentational — parent provides content and handles save/complete.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    ArrowLeft01Icon,
    Mic01Icon,
    Notebook02Icon,
} from '@hugeicons/core-free-icons';
import * as Haptics from 'expo-haptics';

import type {
    JournalContent,
    JournalResponseData,
} from '@/src/types/journey/mentalHealth';
import { Emotion } from '@/assets/emojis';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { countWords } from '@/src/utils/textUtils';
import { INK_MUTED, SAGE } from '@/lib/tokens';
import {
    RendererPrimaryCTA,
    RendererTitleBlock,
    RendererTopProgress,
} from '../RendererFrame';

import MoodPicker from './MoodPicker';
import EmotionTagSelector from './EmotionTagSelector';

// ============================================================================
// Types
// ============================================================================

export interface JournalNodeRendererProps {
    /** Journal node content from template JSONB */
    content: JournalContent;
    /** Node title (shown in header) */
    title: string;
    /** XP reward displayed in the renderer header */
    xpReward?: number;
    /** Called when user saves the journal entry */
    onComplete: (responseData: JournalResponseData) => void;
    /** Called when user also wants to save to the main journal system */
    onSaveToJournal: (text: string, moodBefore?: string, moodAfter?: string) => void;
    /** Called when user taps back */
    onBack: () => void;
}

/** Internal journal flow phases */
type JournalPhase = 'mood_before' | 'writing' | 'mood_after' | 'done';

// ============================================================================
// Constants
// ============================================================================

const WORD_ENCOURAGEMENTS: Array<{ min: number; message: string }> = [
    { min: 200, message: 'Beautiful reflection! 🌟' },
    { min: 100, message: 'Wonderful — keep going!' },
    { min: 50, message: 'Nice flow — you\'re doing great' },
    { min: 20, message: 'Good start — keep writing' },
    { min: 1, message: 'Writing...' },
    { min: 0, message: 'Take your time...' },
];

// ============================================================================
// Helpers
// ============================================================================

function getEncouragement(wordCount: number): string {
    return WORD_ENCOURAGEMENTS.find((e) => wordCount >= e.min)?.message ?? '';
}

function getPhases(content: JournalContent): JournalPhase[] {
    const phases: JournalPhase[] = [];
    if (content.mood_before) phases.push('mood_before');
    phases.push('writing');
    if (content.mood_after) phases.push('mood_after');
    return phases;
}

// ============================================================================
// Sub-components
// ============================================================================

/** Header */
function JournalHeader({
    title,
    onBack,
}: {
    title: string;
    onBack: () => void;
}): React.JSX.Element {
    return (
        <View className="flex-row items-center px-5 pb-4 pt-4">
            <PressableScale
                onPress={onBack}
                scale={0.9}
                hapticStyle="light"
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: SAGE.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                accessibilityLabel="Go back"
                accessibilityRole="button"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={INK_MUTED} />
            </PressableScale>

            <View className="flex-1 mx-3">
                <Text className="happy-font-body-bold text-sm text-ink" numberOfLines={1}>
                    {title}
                </Text>
                <Text className="happy-font-body-medium text-xs text-ink-muted">Guided Journal</Text>
            </View>

            <View className="happy-brand-status-chip px-3 py-1.5">
                <HugeiconsIcon icon={Notebook02Icon} size={16} color={SAGE[600]} />
            </View>
        </View>
    );
}

/** Voice button placeholder */
function VoiceButton(): React.JSX.Element {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const handlePress = useCallback((): void => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    }, []);

    return (
        <View className="relative">
            <Pressable
                onPress={handlePress}
                className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill"
                accessibilityLabel="Voice to text — coming soon"
                accessibilityRole="button"
            >
                <HugeiconsIcon icon={Mic01Icon} size={20} color={INK_MUTED} />
            </Pressable>
            {showTooltip ? (
                <View className="absolute -left-8 -top-10 rounded-lg bg-ink px-3 py-1.5">
                    <Text className="happy-font-body-medium text-xs text-brand-surface">Coming soon!</Text>
                </View>
            ) : null}
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function JournalNodeRenderer({
    content,
    title,
    xpReward,
    onComplete,
    onSaveToJournal,
    onBack,
}: JournalNodeRendererProps): React.JSX.Element {
    const textInputRef = useRef<TextInput>(null);

    // ── State ──
    const phases: JournalPhase[] = getPhases(content);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
    const currentPhase: JournalPhase = phases[currentPhaseIndex] ?? 'writing';

    const [moodBefore, setMoodBefore] = useState<Emotion | null>(null);
    const [journalText, setJournalText] = useState<string>('');
    const [emotionTags, setEmotionTags] = useState<string[]>([]);
    const [moodAfter, setMoodAfter] = useState<Emotion | null>(null);

    const wordCount: number = countWords(journalText);
    const encouragement: string = getEncouragement(wordCount);

    // ── Validation ──
    const canContinue: boolean = (() => {
        switch (currentPhase) {
            case 'mood_before':
                return moodBefore !== null;
            case 'writing':
                return journalText.trim().length > 0;
            case 'mood_after':
                return moodAfter !== null;
            default:
                return false;
        }
    })();

    const isLastPhase: boolean = currentPhaseIndex === phases.length - 1;

    // ── Navigation ──
    const handleNext = useCallback((): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (isLastPhase) {
            // Build response and complete
            const responseData: JournalResponseData = {
                text: journalText.trim(),
                wordCount,
                emotionTags: emotionTags.length > 0 ? emotionTags : undefined,
            };

            // Save to existing journal system
            onSaveToJournal(
                journalText.trim(),
                moodBefore ?? undefined,
                moodAfter ?? undefined,
            );

            onComplete(responseData);
        } else {
            setCurrentPhaseIndex((prev: number) => prev + 1);
        }
    }, [
        isLastPhase,
        journalText,
        wordCount,
        emotionTags,
        moodBefore,
        moodAfter,
        onComplete,
        onSaveToJournal,
    ]);

    const handleBack = useCallback((): void => {
        if (currentPhaseIndex > 0) {
            setCurrentPhaseIndex((prev: number) => prev - 1);
        } else {
            onBack();
        }
    }, [currentPhaseIndex, onBack]);

    // ── Phase progress ──
    const progressPercent: number =
        phases.length > 0 ? ((currentPhaseIndex + 1) / phases.length) * 100 : 100;

    // ── CTA label ──
    const ctaLabel: string = isLastPhase ? 'Save & Continue' : 'Next';

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <RendererTopProgress
                progress={progressPercent / 100}
                xpReward={xpReward}
                onClose={onBack}
            />

            <RendererTitleBlock
                eyebrow={`Journal ${currentPhaseIndex + 1} of ${phases.length}`}
                title={title}
                subtitle="A quick reflection. Keep it honest, not perfect."
            />

            {/* Content */}
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    className="flex-1 px-7"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* === Phase: Mood Before === */}
                    {currentPhase === 'mood_before' ? (
                        <View className="flex-1 justify-center">
                            <MoodPicker
                                label="How are you feeling right now?"
                                value={moodBefore}
                                onChange={setMoodBefore}
                            />
                            <Text className="happy-font-body-medium mt-2 text-center text-xs text-ink-muted">
                                This helps track how journaling affects your mood
                            </Text>
                        </View>
                    ) : null}

                    {/* === Phase: Writing === */}
                    {currentPhase === 'writing' ? (
                        <View className="flex-1">
                            {/* Guided prompt */}
                            <View className="happy-brand-preview-tile mb-4 rounded-[24px] p-4">
                                <Text className="happy-font-body-semibold text-base leading-6 text-ink">
                                    {content.prompt}
                                </Text>
                            </View>

                            {/* Writing area */}
                            <View className="happy-brand-preview-tile mb-3 flex-1 rounded-[24px] p-4">
                                <TextInput
                                    ref={textInputRef}
                                    value={journalText}
                                    onChangeText={setJournalText}
                                    placeholder="Start writing here..."
                                    placeholderTextColor={INK_MUTED}
                                    multiline
                                    textAlignVertical="top"
                                    autoFocus
                                    className="happy-font-body-medium flex-1 text-base leading-6 text-ink"
                                    style={{ minHeight: 200 }}
                                    accessibilityLabel="Journal writing area"
                                    accessibilityHint={content.prompt}
                                />
                            </View>

                            {/* Word count + encouragement + voice button */}
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-1">
                                    <Text className="happy-font-body-bold text-sm text-sage-600">
                                        {wordCount > 0 ? `${wordCount} words — ${encouragement}` : encouragement}
                                    </Text>
                                </View>
                                <VoiceButton />
                            </View>

                            {/* Emotion tags */}
                            <EmotionTagSelector
                                value={emotionTags}
                                onChange={setEmotionTags}
                            />
                        </View>
                    ) : null}

                    {/* === Phase: Mood After === */}
                    {currentPhase === 'mood_after' ? (
                        <View className="flex-1 justify-center">
                            <MoodPicker
                                label="How are you feeling now?"
                                value={moodAfter}
                                onChange={setMoodAfter}
                            />

                            {/* Mood shift indicator */}
                            {moodBefore && moodAfter ? (
                                <View className="happy-brand-card-selected mt-4 rounded-[24px] p-4">
                                    <Text className="happy-font-body-semibold text-center text-sm text-sage-700">
                                        {moodBefore === moodAfter
                                            ? 'Your mood stayed steady — that\'s okay! 🤝'
                                            : 'Your mood shifted — journaling makes a difference! ✨'}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    ) : null}
                </ScrollView>

                {/* CTA Button */}
                <View className="px-7 pb-4 pt-2">
                    <RendererPrimaryCTA
                        label={ctaLabel}
                        onPress={handleNext}
                        disabled={!canContinue}
                    />
                </View>
            </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
