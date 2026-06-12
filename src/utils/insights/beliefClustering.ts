import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

export interface ThoughtEntry {
  index: number;
  text: string;
  date: string;
  preIntensity: number;
  postIntensity: number | undefined;
}

export interface RawBeliefCluster {
  coreBeliefName: string;
  thoughtIndices: number[];
}

/**
 * Calls Gemini to group automatic thoughts by underlying core belief.
 * Returns clusters with indices mapping back to the input array.
 */
export async function clusterThoughtsByBelief(
  thoughts: ThoughtEntry[],
): Promise<RawBeliefCluster[] | null> {
  const thoughtList = thoughts
    .map(
      (t) =>
        `${t.index}. "${t.text}" (${t.date}, intensity: ${t.preIntensity}%)`,
    )
    .join("\n");

  const prompt = `Given these automatic thoughts from a CBT journal (one per session over several weeks), group them by underlying core belief. Thoughts that express the same fear or assumption belong together even if worded differently.

Thoughts:
${thoughtList}

Group by core belief and give each group a short name (e.g., "I'm not good enough", "People will reject me", "I can't cope"). Only create a group if it has 2 or more thoughts.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            coreBeliefName: { type: "string" },
            thoughtIndices: { type: "array", items: { type: "integer" } },
          },
          required: ["coreBeliefName", "thoughtIndices"],
        },
      },
    },
  });

  if (!response.text) return null;
  return JSON.parse(response.text);
}
