import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useCallback } from "react";

type ToastType = "success" | "error";

export const useSaveToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (type: ToastType = "success", message?: string) => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action={type}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast]
  );

  return { showToast };
};
