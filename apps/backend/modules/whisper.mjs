import { OpenAIWhisperAudio } from "langchain/document_loaders/fs/openai_whisper_audio";
import { convertAudioToMp3 } from "../utils/audios.mjs";
import fs from "fs";
import dotenv from "dotenv";
import FormData from "form-data";
import axios from "axios";
dotenv.config();

const openAIApiKey = process.env.KRISHNA_OPENAI_API_KEY;

async function convertAudioToText({ audioData }) {
  const mp3AudioData = await convertAudioToMp3({ audioData });
  const outputPath = "D:/CORA.ai/apps/backend/tmp/output.mp3";
  let response;
  console.log(mp3AudioData);
  fs.writeFileSync(outputPath, mp3AudioData);
  const formData = new FormData();
  formData.append("file", fs.createReadStream(outputPath));
  try {
    response = await axios.post("http://localhost:8000/transcribe/", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error in the transcribe API", error);
  }
  // const loader = new OpenAIWhisperAudio(outputPath, {
  //   clientOptions: { apiKey: openAIApiKey },
  // });
  // const doc = (await loader.load()).shift();
  // const transcribedText = doc.pageContent;
  fs.unlinkSync(outputPath);
  return response.data.transcription;
}

export { convertAudioToText };
