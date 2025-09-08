import { Button } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

export function MyMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button title="Open" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label />
        <DropdownMenu.Item key="item-1">
          <DropdownMenu.ItemTitle>Item 1</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>

        <DropdownMenu.Group>
          <DropdownMenu.Item key="item-2">
            <DropdownMenu.ItemTitle>Item 2</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.CheckboxItem key="item-3" value="on">
          <DropdownMenu.ItemTitle>Item 3</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="item-4">
            <DropdownMenu.ItemTitle>Item 4</DropdownMenu.ItemTitle>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item key="item-5">
              <DropdownMenu.ItemTitle>Item 5</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Arrow />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
