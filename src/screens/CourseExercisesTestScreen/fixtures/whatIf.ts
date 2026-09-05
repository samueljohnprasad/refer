import { WhatIfContent } from "@/src/components/exercise/whatif/whatIfContent";

export const mockWhatIfContent: WhatIfContent = {
  title: "What if?",
  instruction: "What do you think will happen?",
  options: [
    { id: "p1", label: "I will forget everything" },
    { id: "p2", label: "I will stumble slightly" },
    { id: "p3", label: "It will go fine" }
  ],
  steps: [
    { title: "Step 1", body: "You step on stage" },
    { title: "Step 2", body: "You start talking" },
    { title: "Step 3", body: "People nod" }
  ],
  takeaway: "Review",
  rule: "Here is how reality compared to your prediction."
};
