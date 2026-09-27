import { geminiClient } from "../_shared/reflection-engine/ai/client.ts";

function detectAudioMime(base64: string): string {
  if (base64.startsWith("UklGR")) return "audio/wav";
  if (base64.startsWith("SUQz") || base64.startsWith("//tQ") || base64.startsWith("//uQ")) return "audio/mp3";
  if (base64.startsWith("OggS")) return "audio/ogg";
  return "audio/m4a";
}

export async function transcribeAudio(
  _apiKey: string,
  journal: string,
  isAudio: boolean,
  reqTag: string = "default"
): Promise<string[]> {
  if (!isAudio) return [journal];

  // ponytail: transcribe directly using Gemini 2.5 Flash multimodal audio
  const tag = `[transcribeAudio][${reqTag}]`;
  const startTime = Date.now();
  try {
    const mimeType = detectAudioMime(journal);
    const estKb = Math.round((journal.length * 0.75) / 1024);
    console.log(`${tag} Audio MIME detected: "${mimeType}", size: ~${estKb} KB (${journal.length} chars)`);
    console.log(`${tag} Base64 head: ${journal.slice(0, 30)}...`);

    console.log(`${tag} Dispatching audio payload to Gemini 2.5 Flash multimodal...`);
    const model = geminiClient.getModel("gemini-2.5-flash");
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: journal,
        },
      },
      {
        text: "Transcribe the spoken words in this audio recording exactly. Output ONLY the raw transcription text. Do not add markdown, quotes, explanations, or filler. If no speech is detected or if only silence/noise, output nothing.",
      },
    ]);

    const transcript = result.response.text().trim();
    const elapsedMs = Date.now() - startTime;
    console.log(`${tag} Gemini STT completed in ${elapsedMs}ms. Transcript length: ${transcript.length}`);
    if (transcript) {
      console.log(`${tag} Transcript: "${transcript.length > 200 ? transcript.slice(0, 200) + '...' : transcript}"`);
    } else {
      console.log(`${tag} No speech detected (Gemini returned empty text)`);
    }

    return transcript ? [transcript] : [];
  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`${tag} Gemini STT failed in ${elapsedMs}ms:`, error);
    throw error;
  }
}

