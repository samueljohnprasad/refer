import { useToast } from "heroui-native";
import { useCallback } from "react";

type ToastType = "success" | "error";

export const useSaveToast = () => {
  const { toast } = useToast();

  const showToast = useCallback(
    (type: ToastType = "success", message?: string) => {
      toast.show({
        placement: "top",
        variant: type === "error" ? "danger" : "success",
        label: message,
      });
    },
    [toast]
  );

  return { showToast };
};
