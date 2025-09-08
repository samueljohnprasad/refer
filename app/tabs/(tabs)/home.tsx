import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { LinearGradient } from "expo-linear-gradient";
import { JournalCalendar } from "@/components/ui/JournalCalendar";
import { useJournalData } from "@/hooks/useJournalData";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import Animated from "react-native-reanimated";
import React from "react";
import { ModalType } from "@/types/journal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { Box } from "@/components/ui/box";
import JournalCalendarScreen from "@/screens/JournalCalendarScreen/JournalCalendarScreen";

export default function Home() {
  const activeTheme = useSeasonalTheme();
  const { journalEntries, getMoodEmoji } = useJournalData(activeTheme);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState<ModalType>("view");
  const { animationValues, closeModal } = useModalAnimation({
    isVisible: modalVisible,
    onCloseComplete: () => {
      setModalVisible(false);
    },
  });

  return (
    <JournalCalendarScreen />
    // <MindfulBackground>
    //   <Box className="p-3 mt-20">
    //     <JournalCalendar
    //       journalEntries={journalEntries}
    //       getMoodEmoji={getMoodEmoji}
    //       onDatePress={(date: string, hasEntry: boolean): void => {
    //         if (hasEntry) {
    //           setModalType("view");
    //           setModalVisible(true);
    //         } else {
    //           setModalType("add");
    //           setModalVisible(true);
    //         }
    //       }}
    //     />
    //     <AnimatedModal
    //       visible={modalVisible}
    //       modalType={modalType}
    //       animationValues={animationValues}
    //       onClose={() => {
    //         closeModal();
    //       }}
    //       onRequestClose={() => {
    //         closeModal();
    //       }}
    //     />
    //   </Box>
    // </MindfulBackground>
  );
}
