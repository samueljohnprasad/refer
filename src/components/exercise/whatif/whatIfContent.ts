// ponytail: strict types per data-model
export interface WhatIfContent {
  format: "what_if";
  predictions: { id: string; text: string }[];
  consequences: { id: string; text: string }[];
  finalComparison: {
    heading: string;
    description: string;
  };
}
