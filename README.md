
## Getting Started

### Requirements
Before using this system, ensure you have the following prerequisites:

1. **OpenAI Subscription:** You must have an active subscription with OpenAI. If you don't have one, you can create it [here](https://openai.com/product).
2. **Eleven Labs Subscription:** You need to have a subscription with Eleven Labs. If you don't have one yet, you can
   sign up [here](https://elevenlabs.io/). 
It's recommended to have the paid version. With the free version, the avatar doesn't work well due to an error caused by too many requests.
3. **Rhubarb Lip-Sync:** Download the latest version of Rhubarb Lip-Sync compatible with your operating system from the
   official [Rhubarb Lip-Sync repository](https://github.com/DanielSWolf/rhubarb-lip-sync/releases). Once downloaded,
   create a `/bin` directory in the backend and move all the contents of the unzipped `rhubarb-lip-sync.zip` into it.
   Sometimes, the operating system requests permissions, so you need to enable them.
4. Install `ffmpeg` for  [Mac OS](https://formulae.brew.sh/formula/ffmpeg), [Linux](https://ffmpeg.org/download.html) or [Windows](https://ffmpeg.org/download.html).

### Installation

1. Clone this repository:
  
```bash
git@github.com:asanchezyali/talking-avatar-with-ai.git
```

2. Navigate to the project directory:

```bash
cd digital-human
```

3. Install dependencies for monorepo:
```bash
yarn
```
4. Create a .env file in the root `/apps/backend/` of the project and add the following environment variables:

```bash
# OPENAI
OPENAI_MODEL=<YOUR_GPT_MODEL>
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

# Elevenlabs
ELEVEN_LABS_API_KEY=<YOUR_ELEVEN_LABS_API_KEY>
ELVEN_LABS_VOICE_ID=<YOUR_ELEVEN_LABS_VOICE_ID>
ELEVEN_LABS_MODEL_ID=<YOUR_ELEVEN_LABS_MODEL_ID>
```

5. Run the development system:

```bash
yarn dev
```

6. If you need install another dependence in the monorepo, you can do this:

```bash
yarn add --dev -W <PACKAGE_NAME>
yarn
```


Open [http://localhost:5173/](http://localhost:5173/) with your browser to see the result.
