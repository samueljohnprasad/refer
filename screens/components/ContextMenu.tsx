import { Text } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Button } from "react-native";
import * as ContextMenu from "zeego/context-menu";
import { Preview } from "zeego/context-menu";

export function MyContextMenu() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button title="Open" />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Content key="item-1">Item 1</ContextMenu.Content>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
