import React, { useEffect, useRef } from "react";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useNodeContent } from "@/src/hooks/useNodeContent";
import type { UseNodeContentReturn } from "@/src/hooks/useNodeContent";

export function useNodeContentWithTimeout() {
  const toast = useToast();
  const nodeContent = useNodeContent();
  const {
    content,
    isLoading: isNodeContentLoading,
    error: nodeContentError,
    fetchContent: fetchNodeContent,
    clearContent: clearNodeContent,
  } = nodeContent;

  const nodeContentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // BUG-09: Auto-dismiss loading overlay after 10s to prevent indefinite block
  useEffect(() => {
    if (isNodeContentLoading) {
      nodeContentTimeoutRef.current = setTimeout(() => {
        clearNodeContent();
        toast.show({
          id: "node-content-timeout",
          placement: "bottom",
          render: () => (
            <Toast action="error">
              <ToastTitle>Loading timed out. Please try again.</ToastTitle>
            </Toast>
          ),
        });
      }, 10_000);
    } else if (nodeContentTimeoutRef.current) {
      clearTimeout(nodeContentTimeoutRef.current);
      nodeContentTimeoutRef.current = null;
    }
    return () => {
      if (nodeContentTimeoutRef.current) {
        clearTimeout(nodeContentTimeoutRef.current);
      }
    };
  }, [isNodeContentLoading, clearNodeContent, toast]);

  return {
    content,
    isLoading: isNodeContentLoading,
    error: nodeContentError,
    fetchContent: fetchNodeContent,
    clearContent: clearNodeContent,
  };
}
