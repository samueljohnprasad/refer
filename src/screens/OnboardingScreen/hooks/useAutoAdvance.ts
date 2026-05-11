import { useCallback, useEffect, useRef, useState } from "react";
import { LOADING_TASKS } from "../constants";

interface TaskState {
  id: string;
  label: string;
  completed: boolean;
  inProgress: boolean;
}

interface UseAutoAdvanceReturn {
  tasks: TaskState[];
  allComplete: boolean;
}

export const useAutoAdvance = (
  onComplete: () => void,
): UseAutoAdvanceReturn => {
  const [tasks, setTasks] = useState<TaskState[]>(
    LOADING_TASKS.map((t) => ({
      id: t.id,
      label: t.label,
      completed: false,
      inProgress: false,
    })),
  );
  const [allComplete, setAllComplete] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  const startSequence = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    let elapsed = 0;

    LOADING_TASKS.forEach((task, index) => {
      const startTimer = setTimeout(() => {
        setTasks((prev) =>
          prev.map((t, i) => (i === index ? { ...t, inProgress: true } : t)),
        );
      }, elapsed);
      timersRef.current.push(startTimer);

      elapsed += task.durationMs;

      const completeTimer = setTimeout(() => {
        setTasks((prev) =>
          prev.map((t, i) =>
            i === index ? { ...t, completed: true, inProgress: false } : t,
          ),
        );

        if (index === LOADING_TASKS.length - 1) {
          setAllComplete(true);
          const advanceTimer = setTimeout(onComplete, 600);
          timersRef.current.push(advanceTimer);
        }
      }, elapsed);
      timersRef.current.push(completeTimer);
    });
  }, [onComplete]);

  useEffect(() => {
    startSequence();
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [startSequence]);

  return { tasks, allComplete };
};
