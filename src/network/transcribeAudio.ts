import axios, { AxiosResponse } from "axios";

interface SpeechRecognitionConfig {
  encoding: "MP3" | "LINEAR16" | "FLAC";
  sampleRateHertz: number;
  languageCode: string;
}

interface SpeechRecognitionAudio {
  content: string; // base64-encoded audio
}

interface SpeechRecognitionRequest {
  config: SpeechRecognitionConfig;
  audio: SpeechRecognitionAudio;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
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
  base64Audio: string
): Promise<string[]> {
  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
  // console.log("base64Audio", base64Audio);
  const payload: SpeechRecognitionRequest = {
    config: {
      encoding: "MP3",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
    audio: {
      content: base64Audio,
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
      (result) => result.alternatives[0]?.transcript || ""
    );

    return transcripts || [];
  } catch (error: any) {
    console.error(
      "Error calling Speech-to-Text API:",
      error.response?.data || error.message
    );
    return [];
  }
}

// const API_KEY = "AIzaSyCfc4bT2M0K4z3mVjvra2T-VV65ZtWr7cM";
// const base64Audio = ""; // Base64 string of your MP3 file

// const transcripts = await transcribeAudio(API_KEY, base64Audio);
// console.log("Transcription:", transcripts);
