//@ts-ignore
import axios, { AxiosResponse } from "https://esm.sh/axios@1.10.0";

interface SpeechRecognitionConfig {
  encoding: "MP3" | "LINEAR16" | "FLAC";
  sampleRateHertz: number;
  languageCode: string;
}

interface SpeechRecognitionAudio {
  content: string; // base64-encoded audio
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionRequest {
  config: SpeechRecognitionConfig;
  audio: SpeechRecognitionAudio;
}

interface SpeechRecognitionResult {
  alternatives: SpeechRecognitionAlternative[];
  resultEndTime?: string;
  languageCode?: string;
}

interface SpeechRecognitionResponse {
  results: SpeechRecognitionResult[];
  totalBilledTime?: string;
  requestId?: string;
}

export async function transcribeAudio(
  apiKey: string,
  journal: string,
  isAudio: boolean
): Promise<string[]> {
  if (!isAudio) return [journal];

  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
  // console.log("base64Audio", base64Audio);
  const payload: SpeechRecognitionRequest = {
    config: {
      encoding: "MP3",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
    audio: {
      content: journal,
    },
  };

  try {
    const response: AxiosResponse<SpeechRecognitionResponse> = await axios.post(
      url,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const transcripts = response.data?.results?.map(
      (result: SpeechRecognitionResult) =>
        result.alternatives[0]?.transcript || ""
    );

    return transcripts || [];
  } catch (error: any) {
    console.error(
      "Error calling Speech-to-Text API:",
      error.response?.data || error.message
    );

    throw error;
  }
}
