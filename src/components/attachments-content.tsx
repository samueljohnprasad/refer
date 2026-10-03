import { Switch } from "@/src/components/switch";
import * as ImagePicker from "expo-image-picker";
// ponytail: use native expo-symbols instead of lucide
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const IS_IOS = process.env.EXPO_OS === "ios";

function AttachmentButton({
  iconName,
  label,
  onPress,
}: {
  iconName: SymbolViewProps["name"];
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 py-3 rounded-xl bg-secondary active:bg-muted hover:bg-muted border-continuous"
    >
      <SymbolView name={iconName} size={24} tintColor="#1A1A1A" />
      <Text className="text-[13px] text-foreground">{label}</Text>
    </Pressable>
  );
}

async function openCamera() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return;
  await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
  });
}

async function openPhotos() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return;
  await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
  });
}

function ToggleRow({
  iconName,
  label,
  badge,
  value,
  onValueChange,
}: {
  iconName: SymbolViewProps["name"];
  label: string;
  badge?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center px-5 py-3 gap-3.5">
      <SymbolView name={iconName} size={20} tintColor="#1A1A1A" />
      <Text className="flex-1 text-[17px] text-foreground">{label}</Text>
      {badge && (
        <View className="px-1.5 py-0.5 rounded bg-muted">
          <Text className="text-[11px] font-medium text-muted-foreground">
            {badge}
          </Text>
        </View>
      )}
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function DisclosureRow({
  iconName,
  label,
  detail,
  onPress,
}: {
  iconName: SymbolViewProps["name"];
  label: string;
  detail: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center mx-2 px-3 py-3 gap-3.5 rounded-xl active:bg-muted hover:bg-muted"
    >
      <SymbolView name={iconName} size={20} tintColor="#1A1A1A" />
      <Text className="flex-1 text-[17px] text-foreground">{label}</Text>
      <Text className="text-[15px] text-muted-foreground">{detail}</Text>
      <SymbolView name="chevron.right" size={12} tintColor="#8e8e93" />
    </Pressable>
  );
}

/**
 * The shared "Add to chat" UI. Rendered inside a form-sheet route on native and
 * inside a popover on web (see `chat/attachments-button.web.tsx`).
 */
export function AttachmentsContent() {
  const [research, setResearch] = useState(false);
  const [webSearch, setWebSearch] = useState(true);

  return (
    <>
      {/* Attachment buttons */}
      <View className="flex-row gap-3 px-5 pt-2 pb-4">
        <AttachmentButton
          iconName="camera.fill"
          label="Camera"
          onPress={IS_IOS ? openCamera : undefined}
        />
        <AttachmentButton
          iconName="photo.fill"
          label="Photos"
          onPress={IS_IOS ? openPhotos : undefined}
        />
        <AttachmentButton iconName="doc.fill" label="Files" />
      </View>

      {/* Toggles */}
      <ToggleRow
        iconName="sparkles"
        label="Research"
        value={research}
        onValueChange={setResearch}
      />
      <ToggleRow
        iconName="globe"
        label="Web search"
        badge="Beta"
        value={webSearch}
        onValueChange={setWebSearch}
      />

      {/* Divider */}
      <View className="h-px bg-border mx-5 my-1" />

      {/* Disclosure rows */}
      <DisclosureRow iconName="archivebox.fill" label="Add to project" detail="None" />
      <DisclosureRow iconName="paintbrush.fill" label="Choose style" detail="Normal" />
      <DisclosureRow iconName="wrench.and.screwdriver.fill" label="Tool access" detail="Auto" />
    </>
  );
}
