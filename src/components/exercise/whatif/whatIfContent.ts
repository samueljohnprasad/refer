export interface WhatIfContent {
  title?: string;
  instruction?: string;
  steps: (string | { title?: string; body: string })[];
  options: (string | {
    id: string;
    label?: string;
    text?: string;
    body?: string;
    detail?: string;
    next?: string;
    feedback?: string;
    isCorrect?: boolean;
  })[];
  rule?: string;
  takeaway?: string;
}
