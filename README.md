
![alt text](images/image.png)
![alt text](images/image-1.png)

# Look how CORA.ai works - Click the image below
[![Click here](images/image-25.png)](https://www.canva.com/design/DAGXLrZh8fA/mZ-0cras2Rtdb8IXY0cBeg/edit?utm_content=DAGXLrZh8fA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)


# There is two seperate versions for this submission
### (i) Enterprise version - Custom DB, backend deployment with a female avatar representing the brand CORA fed with Compliance and Regulation sepcific data <br>
### (ii) Community version - Simple OpenAI implementation with default ReadyPlayerMe avatar followed by detailed implemenetation help

<br><br>
# Wanna have a look at the Data scraper for the enterprise version ? Once again click below :)
[![alt text](images/image-26.png)](https://github.com/cool-skr/coraai-backend-scraper)


## Getting Started

### Requirements  
Before using this system, ensure you have the following prerequisites:

---

1. **OpenAI Subscription**  
   You must have an active subscription with OpenAI. If you don't have one, you can create it [here](https://openai.com/product).  

2. **Eleven Labs Subscription**  
   You need a subscription with Eleven Labs. If you don't have one yet, you can sign up [here](https://elevenlabs.io/).  
   - It’s recommended to have the paid version for optimal performance.  
   - The free version may encounter errors due to limited requests, which can affect the avatar's functionality.  

3. **Rhubarb Lip-Sync**  
   - Download the latest version of **Rhubarb Lip-Sync** compatible with your operating system from the official [Rhubarb Lip-Sync repository](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).  
   - Once downloaded, create a `/bin` directory in the backend and move all the contents of the unzipped `rhubarb-lip-sync.zip` into it.  
   - Ensure appropriate permissions are granted if required by your operating system.  

4. **FFmpeg**  
   Install **FFmpeg**, a multimedia framework for audio and video processing:  
   - [Mac OS](https://formulae.brew.sh/formula/ffmpeg)  
   - [Linux](https://ffmpeg.org/download.html)  
   - [Windows](https://ffmpeg.org/download.html)  

5. **AWS Account**  
   - Create an AWS account if you don’t already have one. You can register [here](https://aws.amazon.com/).  
   - The system may require access to specific AWS services such as:  
     - **S3**: For file storage and retrieval (e.g., managing audio and video files).  
     - **Lambda**: For running serverless functions, such as triggering transcription tasks.  
     - **CloudFront**: For securely distributing content globally with low latency.  
     - **Polly** (optional): For additional text-to-speech capabilities if needed.  

6. **Environment Setup**  
   Ensure the following tools and dependencies are installed on your machine:  
   - **Node.js**: For running the backend.  
   - **Python** (>= 3.9): For supporting backend tasks.  
   - **Docker** (optional): For containerized deployments.  
   - **Redis** (optional): For efficient caching to improve system performance.

---


### Installation - Base openAI version (Community version)

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


## The main logic for the frontend Avatar will be (Initally built with OpenAI)
```js
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const template = `
  You are Jack, a world traveler.
  You will always respond with a JSON array of messages, with a maximum of 3 messages:
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
  Surprised, DismissingGesture and ThoughtfulHeadShake.
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  ["human", "{question}"],
]);

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "-",
  modelName: process.env.OPENAI_MODEL || "davinci",
  temperature: 0.2,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

export { openAIChain, parser };

```

The code performs four main tasks:

* It sets up the environment using the dotenv library to establish the necessary environment variables for interacting with the OpenAI API.

* It defines a "prompt" template using the ChatPromptTemplate class from @langchain/core/prompts. This template guides the conversation as a predefined script for the chat.

* It configures the chat model using the ChatOpenAI class, which relies on OpenAI's "davinci" model if the environment variables have not been configured previously.

* It parses the output, designing the response generated by the AI in a specific format that includes details about the facial expression and animation to use, which is crucial for a realistic interaction with Jack.
  
* This service integrates with Eleven Labs and Rhubarb Lip-Sync to generate the following client integration interface, where the exchanged data looks something like this:
```js
[
  {
    text: "I've been to so many places around the world, each with its own unique charm and beauty.",
    facialExpression: 'smile',
    animation: 'TalkingOne',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7',
    lipsync: { metadata: [Object], mouthCues: [Array] }
  },
  {
    text: "There were times when the journey was tough, but the experiences and the people I met along the way made it all worth it.",
    facialExpression: 'thoughtful',
    animation: 'TalkingThree',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7',
    lipsync: { metadata: [Object], mouthCues: [Array] }
  },  
{
    text: :"And there's still so much more to see and explore. The world is a fascinating place!",
    facialExpression: 'surprised',
    animation: 'ThoughtfulHeadShake',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7',
    lipsync: { metadata: [Object], mouthCues: [Array] }
  }
]
```

The concept here is to craft a sequence of text accompanied by varied body movements (animations) and diverse facial expressions, aiming to imbue the digital human with a heightened sense of realism in its actions.

## How it Operates - (Core idea based off community version)
The system operates through two primary workflows, depending on whether the user input is in text or audio form:

### Workflow with Text Input:
1. **User Input:** The user enters text.
2. **Text Processing:** The text is forwarded to the OpenAI GPT API for processing.
3. **Audio Generation:** The response from GPT is relayed to the Eleven Labs TTS API to generate audio.
4. **Viseme Generation:** The audio is then sent to Rhubarb Lip Sync to produce viseme metadata.
5. **Synchronization:** The visemes are utilized to synchronize the digital human's lips with the audio.

### Workflow with Audio Input:
1. **User Input:** The user submits audio.
2. **Speech-to-Text Conversion:** The audio is transmitted to the OpenAI Whisper API to convert it into text.
3. **Text Processing:** The converted text is sent to the OpenAI GPT API for further processing.
4. **Audio Generation:** The output from GPT is sent to the Eleven Labs TTS API to produce audio.
5. **Viseme Generation:** The audio is then routed to Rhubarb Lip Sync to generate viseme metadata.
6. **Synchronization:** The visemes are employed to synchronize the digital human's lips with the audio.

<div align="center">
  <img src="resources/architecture.drawio.svg" alt="System Architecture" width="100%">
</div>




## Appendix for the Community 😉

### Appendix A: Create Your Own 3D Avatar

**FOR HOBBYISTS:**

1. Create your own full-body avatar free at [https://readyplayer.me](https://readyplayer.me)

2. Copy the given URL and add the following URL parameters in order to include all the needed morph targets:<br>`morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png`<br><br>Your final URL should look something like this:<br>`https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png`

3. Use the URL to download the GLB file to your own web server.

**FOR 3D MODELERS:**

You can create and use your own 3D full-body model, but it has to be
Ready Player Me compatible. Their rig has a Mixamo-compatible bone
structure described here:

https://docs.readyplayer.me/ready-player-me/api-reference/avatars/full-body-avatars

For lip-sync and facial expressions, you also need to have ARKit and Oculus
compatible blend shapes, and a few additional ones, all listed in the
following two pages:

https://docs.readyplayer.me/ready-player-me/api-reference/avatars/morph-targets/apple-arkit
https://docs.readyplayer.me/ready-player-me/api-reference/avatars/morph-targets/oculus-ovr-libsync

The TalkingHead class supports both separated mesh and texture atlasing.

Here are some Blender Python scripts that could be useful in converting
custom models:

Script | Description
--- | ---
[rename-mixamo-bones.py](https://github.com/met4citizen/TalkingHead/blob/main/blender/rename-mixamo-bones.py) | If your model doesn't have a compatible rig, you can auto-rig your model easily at [Mixamo](https://www.mixamo.com) and use this Blender script to rename the Mixamo bones.
[rename-rocketbox-shapekeys.py](https://github.com/met4citizen/TalkingHead/blob/main/blender/rename-rocketbox-shapekeys.py) | Rename [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox) model shape keys.
[rename-avatarsdk-shapekeys.py](https://github.com/met4citizen/TalkingHead/blob/main/blender/rename-avatarsdk-shapekeys.py) | Rename [Avatar SDK MetaPerson](https://github.com/avatarsdk) model shape keys.
[build-extras-from-arkit.py](https://github.com/met4citizen/TalkingHead/blob/main/blender/build-extras-from-arkit.py) | Build RPM extras (mouthOpen, mouthSmile, eyesClosed, eyesLookUp, eyesLookDown) from ARKit blendshapes.
[build-visemes-from-arkit.py](https://github.com/met4citizen/TalkingHead/blob/main/blender/build-visemes-from-arkit.py) | Build Oculus visemes from ARKit blendshapes. As models are all different, you should fine-tune the script for best result. EXPERIMENTAL

---

### Appendix B: Create API Proxies with JSON Web Token (JWT) Single Sign-On (SSO)

1. Make a CGI script that generates a new JSON Web Token with an expiration time (exp). See [jwt.io](https://jwt.io) for more information about JWT and libraries that best fit your needs and architecture. In my own test setup, I return the generated JWT as JSON.

```json
{ "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" }
```

2. Protect your CGI script with some authentication scheme. Below is an example Apache 2.4 directory config that uses Basic authentication (remember to always use HTTPS/SSL!). Put your CGI script `get` in the `jwt` directory.

```apacheconf
# Restricted applications
<Directory "/var/www/app">
  AuthType Basic
  AuthName "Restricted apps"
  AuthUserFile /etc/httpd/.htpasswd
  Require valid-user
</Directory>

# JSON Web Token
<Directory "/var/www/app/jwt" >
  Options ExecCGI
  SetEnv REMOTE_USER %{REMOTE_USER}
  SetHandler cgi-script
</Directory>
```

3. Make an [External Rewriting Program](https://httpd.apache.org/docs/2.4/rewrite/rewritemap.html#prg) script that verifies JSON Web Tokens. The script should return `OK` if the given token is not expired and its signature is valid. Start the script in Apache 2.4 config. User's don't use the verifier script directly, so put it in some internal directory, not under document root.

```apacheconf
# JSON Web Token verifier
RewriteEngine On
RewriteMap jwtverify "prg:/etc/httpd/jwtverify" apache:apache
```

4. Make a proxy configuration for each service you want to use. Add the required API keys and protect the proxies with the JWT token verifier. Below are some example configs for Apache 2.4 web server. Note that when opening a WebSocket connection (ElevenLabs, Azure) you can't add authentication headers in browser JavaScript. This problem is solved here by including the JWT token as a part of the request URL. The downside is that the token might end up in server log files. This is typically not a problem as long as you are controlling the proxy server, you are using HTTPS/SSL, and the token has an expiration time.


```apacheconf
# OpenAI API
<Location /openai/>
  RewriteCond ${jwtverify:%{http:Authorization}} !=OK
  RewriteRule .+ - [F]
  ProxyPass https://api.openai.com/
  ProxyPassReverse  https://api.openai.com/
  ProxyPassReverseCookiePath "/"  "/openai/"
  ProxyPassReverseCookieDomain ".api.openai.com" ".<insert-your-proxy-domain-here>"
  RequestHeader set Authorization "Bearer <insert-your-openai-api-key-here>"
</Location>

# Google TTS API
<Location /gtts/>
  RewriteCond ${jwtverify:%{http:Authorization}} !=OK
  RewriteRule .+ - [F]
  ProxyPass https://eu-texttospeech.googleapis.com/v1beta1/text:synthesize?key=<insert-your-api-key-here> nocanon
  RequestHeader unset Authorization
</Location>

# Microsoft Azure TTS WebSocket API (Speech SDK)
<LocationMatch /mstts/(?<jwt>[^/]+)/>
  RewriteCond ${jwtverify:%{env:MATCH_JWT}} !=OK
  RewriteRule .+ - [F]
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteRule /mstts/[^/]+/(.+) "wss://<insert-your-region-here>.tts.speech.microsoft.com/$1" [P]
  RequestHeader set "Ocp-Apim-Subscription-Key" <insert-your-subscription-key-here>
</LocationMatch>

# ElevenLabs Text-to-speech WebSocket API
<LocationMatch /elevenlabs/(?<jwt>[^/]+)/>
  RewriteCond ${jwtverify:%{env:MATCH_JWT}} !=OK
  RewriteRule .+ - [F]
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteRule /elevenlabs/[^/]+/(.+) "wss://api.elevenlabs.io/$1" [P]
  RequestHeader set "xi-api-key" "<add-your-elevenlabs-api-key-here>"
</LocationMatch>
```

---

### Appendix C: Create A New Lip-sync Module

The steps that are common to all new languages:

- Create a new file named `lipsync-xx.mjs` where `xx` is your language code, and place the file in the `./modules/` directory. The language module should have a class named `LipsyncXx` where Xx is the language code. The naming in important, because the modules are loaded dynamically based on their names.
- The class should have (at least) the following two methods: `preProcessText` and `wordsToVisemes`. These are the methods used in the TalkingHead class.
- The purpose of the `preProcessText` method is to preprocess the given text by converting symbols to words, numbers to words, and filtering out characters that should be left unspoken (if any), etc. This is often needed to prevent ambiguities between TTS and lip-sync engines. This method takes a string as a parameter and returns the preprocessed string.
- The purpose of the `wordsToVisemes` method is to convert the given text into visemes and timestamps. The method takes a string as a parameter and returns a lip-sync object. The lipsync object has three required properties: `visemes`, `times`and `durations`.
  - Property `visemes` is an array of Oculus OVR viseme codes. Each viseme is one of the strings: `'aa'`, `'E'`, `'I'`, `'O'`, `'U'`, `'PP'`, `'SS'`, `'TH'`, `'CH'`, `'FF'`, `'kk'`, `'nn'`, `'RR'`, `'DD'`, `'sil'`. See the reference images here: https://developer.oculus.com/documentation/unity/audio-ovrlipsync-viseme-reference/
  - Property `times` is an array of starting times, one entry for each viseme in `visemes`. Starting times are to be given in relative units. They will be scaled later on based on the word timestamps that we get from the TTS engine.
  - Property `durations` is an array of relative durations, one entry for each viseme in `visemes`. Durations are to be given in relative units. They will be scaled later on based on the word timestamps that we get from the TTS engine.

The difficult part is to actually make the conversion from words to visemes.
What is the best approach depends on the language. Here are some typical
approaches to consider (not a comprehensive list):

- **Direct mapping from graphemes to phonemes to visemes**. This works well for languages that have a consistent one-to-one mapping between individual letters and phonemes. This was used as the approach for the Finnish language (`lipsync-fi.mjs`) giving >99.9% lip-sync accuracy compared to the Finnish phoneme dictionary. Implementation size was ~4k. Unfortunately not all languages are phonetically orthographic languages.
- **Rule-based mapping**. This was used as the approach for the English language (`lipsync-en.mjs`) giving around 80% lip-sync accuracy compared to the English phoneme dictionary. However, since the rules cover the most common words, the effective accuracy is higher. Implementation size ~12k.
- **Dictionary based approach**. If neither of the previous approaches work for your language, make a search from some open source phoneme dictionary. Note that you still need some backup algorithm for those words that are not in the dictionary. The problem with phoneme dictionaries is their size. For example, the CMU phoneme dictionary for English is ~5M.
- **Neural-net approach based on transformer models**. Typically this should be done on server-side as the model size can be >50M.

TalkingHead is supposed to be a real-time class, so latency is
always something to consider. It is often better to be small and fast than
to aim for 100% accuracy.

---

### Appendix D: Adding Custom Poses, Moods, Gestures, and Emojis (ADVANCED)

In the TalkingHead class, the avatar's movements are based on four
data structures: `head.poseTemplates`, `head.animMoods`,
`head.gestureTemplates`, and `head.animEmojis`. By using these
objects, you can give your avatar its own personal body language.

In `head.poseTemplates` the hip position is defined as an {x, y, z} coordinate
in meters, and bone rotations as Euler XYZ rotations in radians.
In each pose, the avatar should have its weight on the left leg, if any, as
the class automatically mirrors it for the right side. Setting the boolean
properties `standing`, `sitting`, `bend`, `kneeling`, and `lying` helps the class
make the transitions between different poses in proper steps.

```javascript
head.poseTemplates["custom-pose-1"] = {
  standing: true, sitting: false, bend: false, kneeling: false, lying: false,
  props: {
    'Hips.position':{x:0, y:0.989, z:0.001}, 'Hips.rotation':{x:0.047, y:0.007, z:-0.007}, 'Spine.rotation':{x:-0.143, y:-0.007, z:0.005}, 'Spine1.rotation':{x:-0.043, y:-0.014, z:0.012}, 'Spine2.rotation':{x:0.072, y:-0.013, z:0.013}, 'Neck.rotation':{x:0.048, y:-0.003, z:0.012}, 'Head.rotation':{x:0.05, y:-0.02, z:-0.017}, 'LeftShoulder.rotation':{x:1.62, y:-0.166, z:-1.605}, 'LeftArm.rotation':{x:1.275, y:0.544, z:-0.092}, 'LeftForeArm.rotation':{x:0, y:0, z:0.302}, 'LeftHand.rotation':{x:-0.225, y:-0.154, z:0.11}, 'LeftHandThumb1.rotation':{x:0.435, y:-0.044, z:0.457}, 'LeftHandThumb2.rotation':{x:-0.028, y:0.002, z:-0.246}, 'LeftHandThumb3.rotation':{x:-0.236, y:-0.025, z:0.113}, 'LeftHandIndex1.rotation':{x:0.218, y:0.008, z:-0.081}, 'LeftHandIndex2.rotation':{x:0.165, y:-0.001, z:-0.017}, 'LeftHandIndex3.rotation':{x:0.165, y:-0.001, z:-0.017}, 'LeftHandMiddle1.rotation':{x:0.235, y:-0.011, z:-0.065}, 'LeftHandMiddle2.rotation':{x:0.182, y:-0.002, z:-0.019}, 'LeftHandMiddle3.rotation':{x:0.182, y:-0.002, z:-0.019}, 'LeftHandRing1.rotation':{x:0.316, y:-0.017, z:0.008}, 'LeftHandRing2.rotation':{x:0.253, y:-0.003, z:-0.026}, 'LeftHandRing3.rotation':{x:0.255, y:-0.003, z:-0.026}, 'LeftHandPinky1.rotation':{x:0.336, y:-0.062, z:0.088}, 'LeftHandPinky2.rotation':{x:0.276, y:-0.004, z:-0.028}, 'LeftHandPinky3.rotation':{x:0.276, y:-0.004, z:-0.028}, 'RightShoulder.rotation':{x:1.615, y:0.064, z:1.53}, 'RightArm.rotation':{x:1.313, y:-0.424, z:0.131}, 'RightForeArm.rotation':{x:0, y:0, z:-0.317}, 'RightHand.rotation':{x:-0.158, y:-0.639, z:-0.196}, 'RightHandThumb1.rotation':{x:0.44, y:0.048, z:-0.549}, 'RightHandThumb2.rotation':{x:-0.056, y:-0.008, z:0.274}, 'RightHandThumb3.rotation':{x:-0.258, y:0.031, z:-0.095}, 'RightHandIndex1.rotation':{x:0.169, y:-0.011, z:0.105}, 'RightHandIndex2.rotation':{x:0.134, y:0.001, z:0.011}, 'RightHandIndex3.rotation':{x:0.134, y:0.001, z:0.011}, 'RightHandMiddle1.rotation':{x:0.288, y:0.014, z:0.092}, 'RightHandMiddle2.rotation':{x:0.248, y:0.003, z:0.02}, 'RightHandMiddle3.rotation':{x:0.249, y:0.003, z:0.02}, 'RightHandRing1.rotation':{x:0.369, y:0.019, z:0.006}, 'RightHandRing2.rotation':{x:0.321, y:0.004, z:0.026}, 'RightHandRing3.rotation':{x:0.323, y:0.004, z:0.026}, 'RightHandPinky1.rotation':{x:0.468, y:0.085, z:-0.03}, 'RightHandPinky2.rotation':{x:0.427, y:0.007, z:0.034}, 'RightHandPinky3.rotation':{x:0.142, y:0.001, z:0.012}, 'LeftUpLeg.rotation':{x:-0.077, y:-0.058, z:3.126}, 'LeftLeg.rotation':{x:-0.252, y:0.001, z:-0.018}, 'LeftFoot.rotation':{x:1.315, y:-0.064, z:0.315}, 'LeftToeBase.rotation':{x:0.577, y:-0.07, z:-0.009}, 'RightUpLeg.rotation':{x:-0.083, y:-0.032, z:3.124}, 'RightLeg.rotation':{x:-0.272, y:-0.003, z:0.021}, 'RightFoot.rotation':{x:1.342, y:0.076, z:-0.222}, 'RightToeBase.rotation':{x:0.44, y:0.069, z:0.016}
  }
};
head.playPose("custom-pose-1");
```

In `head.animMoods` the syntax is more complex, so I suggest that you take
a look at the existing moods. In `anims`, each leaf object is an animation
loop template. Whenever a loop starts, the class iterates through
the nested hierarchy of objects by following keys that match the current
state (`idle`, `talking`), body form (`M`, `F`), current view
(`full`, `upper`, `mid`, `head`), and/or probabilities (`alt` + `p`).
The next animation will be created internally by using the `animFactory`
method. The property `delay` (ms) determines how long that pose is held,
`dt` defines durations (ms) for each part in the sequence, and
`vs` defines the shapekeys and their target values for each part.

```javascript

head.animMoods["custom-mood-1"] = {
  baseline: { eyesLookDown: 0.1 },
  speech: { deltaRate: 0, deltaPitch: 0, deltaVolume: 0 },
  anims: [
    { name: 'breathing', delay: 1500, dt: [ 1200,500,1000 ], vs: { chestInhale: [0.5,0.5,0] } },
    { name: 'pose', alt: [
      { p: 0.2, delay: [5000,20000], vs: { pose: ['side'] } },
      { p: 0.2, delay: [5000,20000], vs: { pose: ['hip'] },
        'M': { delay: [5000,20000], vs: { pose: ['wide'] } }
      },
      { delay: [5000,20000], vs: { pose: ['custom-pose-1'] } }
    ]},
    { name: 'head',
      idle: { delay: [0,1000], dt: [ [200,5000] ], vs: { headRotateX: [[-0.04,0.10]], headRotateY: [[-0.3,0.3]], headRotateZ: [[-0.08,0.08]] } },
      talking: { dt: [ [0,1000,0] ], vs: { headRotateX: [[-0.05,0.15,1,2]], headRotateY: [[-0.1,0.1]], headRotateZ: [[-0.1,0.1]] } }
    },
    { name: 'eyes', delay: [200,5000], dt: [ [100,500],[100,5000,2] ], vs: { eyesRotateY: [[-0.6,0.6]], eyesRotateX: [[-0.2,0.6]] } },
    { name: 'blink', delay: [1000,8000,1,2], dt: [50,[100,300],100], vs: { eyeBlinkLeft: [1,1,0], eyeBlinkRight: [1,1,0] } },
    { name: 'mouth', delay: [1000,5000], dt: [ [100,500],[100,5000,2] ], vs : { mouthRollLower: [[0,0.3,2]], mouthRollUpper: [[0,0.3,2]], mouthStretchLeft: [[0,0.3]], mouthStretchRight: [[0,0.3]], mouthPucker: [[0,0.3]] } },
    { name: 'misc', delay: [100,5000], dt: [ [100,500],[100,5000,2] ], vs : { eyeSquintLeft: [[0,0.3,3]], eyeSquintRight: [[0,0.3,3]], browInnerUp: [[0,0.3]], browOuterUpLeft: [[0,0.3]], browOuterUpRight: [[0,0.3]] } }
  ]
};
head.setMood("custom-mood-1");

```

Typical value range is [0,1] or [-1,1]. At the end of each animation,
the value will automatically return to its baseline value.
If the value is an array, it defines a range for a uniform/Gaussian
random value (approximated using CLT). See the class method
`gaussianRandom` for more information.

In `head.gestureTemplates` each property is a subset of bone rotations
that will be used to override the current pose.

```javascript
head.gestureTemplates["salute"] = {
  'LeftShoulder.rotation':{x:1.706, y:-0.171, z:-1.756}, 'LeftArm.rotation':{x:0.883, y:-0.288, z:0.886}, 'LeftForeArm.rotation':{x:0, y:0, z:2.183}, 'LeftHand.rotation':{x:0.029, y:-0.298, z:0.346}, 'LeftHandThumb1.rotation':{x:1.43, y:-0.887, z:0.956}, 'LeftHandThumb2.rotation':{x:-0.406, y:0.243, z:0.094}, 'LeftHandThumb3.rotation':{x:-0.024, y:0.008, z:-0.012}, 'LeftHandIndex1.rotation':{x:0.247, y:-0.011, z:-0.084}, 'LeftHandIndex2.rotation':{x:0.006, y:0, z:0}, 'LeftHandIndex3.rotation':{x:-0.047, y:0, z:0.004}, 'LeftHandMiddle1.rotation':{x:0.114, y:-0.004, z:-0.055}, 'LeftHandMiddle2.rotation':{x:0.09, y:0, z:-0.007}, 'LeftHandMiddle3.rotation':{x:0.078, y:0, z:-0.006}, 'LeftHandRing1.rotation':{x:0.205, y:-0.009, z:0.023}, 'LeftHandRing2.rotation':{x:0.109, y:0, z:-0.009}, 'LeftHandRing3.rotation':{x:-0.015, y:0, z:0.001}, 'LeftHandPinky1.rotation':{x:0.267, y:-0.012, z:0.031}, 'LeftHandPinky2.rotation':{x:0.063, y:0, z:-0.005}, 'LeftHandPinky3.rotation':{x:0.178, y:-0.001, z:-0.014}
};
head.playGesture("salute",3);
```

In `head.animEmojis` each object is an animated emoji. Note that you can
also use `head.playGesture` to play animated emojis. This makes it easy to
combine a hand gesture and a facial expression by giving the gesture and
the emoji the same name.

```javascript
head.animEmojis["🫤"] = { dt: [300,2000], vs: {
    browInnerUp: [0.5], eyeWideLeft: [0.5], eyeWideRight: [0.5], mouthLeft: [0.5], mouthPressLeft: [0.8], mouthPressRight: [0.2], mouthRollLower: [0.5], mouthStretchLeft: [0.7],   mouthStretchRight: [0.7]
  }
};
head.playGesture("🫤",3);
```

---

### Appendix E: Dynamic Bones (ADVANCED)

If you want your character's hair or other body parts to wiggle as
the character moves, you can use TalkingHead's Dynamic Bones feature.
It simulates Newton's equations of motions using a spring-damper model and the
[velocity Verlet integration](https://en.wikipedia.org/wiki/Verlet_integration)
method.

Standard Ready Player Me 3D avatars don't yet include features like hair bones.
Until they do, you'll need to add the dynamic bones and weights to the model
yourself. Here's an example of rigged hair in Blender.

<img src="images/ponytail.jpg"/>


Once your custom rig is in place, you can configure the dynamic bones
by setting the `modelDynamicBones` property to the `avatar` object of
the `showAvatar` method. Here's an example:

```javascript
// Load and show the avatar
try {
  await head.showAvatar( {
    url: './avatars/custom.glb',
    body: 'F',
    avatarMood: 'neutral',
    ttsLang: "en-GB",
    ttsVoice: "en-GB-Standard-A",
    lipsyncLang: 'en',
    modelDynamicBones: [
      {
        bone: "ponytail1", type: "full", stiffness: 20, damping: 2,
        limits: [null,null,[null,0.01],null],
      },
      {
        bone: "ponytail2", type: "full", stiffness: 200, damping: 10,
        pivot: true
      },
      {
        bone: "ponytail3", type: "full", stiffness: 400, damping: 10,
        excludes: [{"bone":"Head","deltaLocal":[0,0.05,0.02],"radius":0.13}]
      }
    ]
  });
} catch (error) {
  console.log(error);
}
```

Each item in `modelDynamicBones` array represents a dynamic bone, which
can be configured using the following properties:

Property | Description | Example
--- | --- | ---
`bone` | The name of the bone in your custom skeleton. Note that each dynamic bone must have a parent bone. | `bone: "ponytail1"`
`type` | <ul><li>`"point"` updates only the bone's local position [x,y,z]. It is fast to calculate, but may cause skinned meshes to deform unnaturally.</li><li>`"link"` updates only the parent's quaternions (XZ rotations).</li><li>`"mix1"` mixes XZ rotations with a stretch (bone length, position change).</li><li>`"mix2"` mixes XZ rotations with a twist (Y rotations).</li><li>`"full"` link with both stretch and twist.</li></ul> | `type: "full"`
`stiffness` | Mass-normalized spring constant `k` [m/s^2]. Either a non-negative number or an array with separate values for each dimension [x, y, z, t]. | `stiffness: 20`
`damping` | Mass-normalized damping coefficient `c` [1/s]. Either a non-negative number or an array with separate values for each dimension [x, y, z, t]. | `damping: 2`
`external` | External scaling factor between [0,1] that can be used to scale down the external forces caused by parent's movement. If set to `0`, the bone is rigid and moves with its parent without experiencing any external force. If set to `1`, the bone follows its parent with a lag (inertia) and feels the force.  OPTIONAL, default value `1.0` | `external: 0.7`
`limits` | Sets the limiting range [low, high] for each dimension [x, y, z, t] in meters [m]. This can help prevent situations in which meshes overlap due to sudden movements or when the amplitude becomes unrealistic. Limits are applied in local space. OPTIONAL, default `null` (no limit) | `limits: [null,null,[null,0.01],null]`
`deltaLocal` | Local position translation [dx,dy,dz] in meters [m]. OPTIONAL, default `null` | `deltaLocal: [0,0.01,0]`
`deltaWorld` | World position translation [dx,dy,dz] in meters [m]. OPTIONAL, default `null` | `deltaWorld: [0,-0.02,0]`
`pivot` | If `true`, the bone becomes a free-hanging bone along the Y-axis. This means that the parent's X/Z rotations are automatically compensated. Use with caution, as this requires additional computational effort, and the `limits` do not apply as usual. OPTIONAL, default `false` | `pivot: true`
`excludes` | Sets one or more spherical excluded zones that act as invisible force fields, limiting the movement of the bone. An array of objects in the format `{ bone, deltaLocal, radius}` in which `bone` specifies the center bone name, `deltaLocal` (optional) offset [x,y,z] relative to center bone, and `radius` in meters. OPTIONAL, default `null` | `excludes: [ { bone: "Head", deltaLocal: [0,0.05,0.02], radius: 0.13 } ]`
`helper` | If `true`, add a helper object to the scene to assist with visualizing the bone during testing. If the dynamic bone type is "point", displays only a square, otherwise also the line from parent to the bone. OPTIONAL, default `false` | `helper: true`


Finding a good combination of `stiffness`, `damping`, and `external`, is mostly
a matter of trial and error. Turn on the helper property or use the test app
to fine-tune the settings while running animations typical to your use case.

> [!TIP]
> For dynamic bones of type `"point"`, you can simulate gravity by applying
a `deltaWorld` translation down the Y-axis and compensating for
the initial stretch in the rest pose by applying `deltaLocal` translation
up the Y-axis.


<br><br>


# What's the scope, where is this going after Amazon Sambhav Hackathon

## A coversational AI ready to be consumed as a WebApp , extension , embeded link. Anywhere, Everywhere !

### Demo Videos

Video | Description
--- | ---
<span style="display: block; min-width:400px">[<img src="images/dynamicbones2.jpg" width="400"/>](https://youtu.be/4Y9NFnENH5s)</span> | Having a good hair day — a follow-up to our previous video about dynamic bones. This time, we're focusing on pivot bones and excluded zones. See Appendix E for more details.
[<img src="images/dynamicbones.jpg" width="400"/>](https://youtu.be/YUbDIWkskuw) | A short intro for the dynamic bones feature 🦴🦴 Using a custom model with rigged hair. See Appendix E for more details.
[<img src="images/screenshot4.jpg" width="400"/>](https://youtu.be/OA6LBZjkzJI) | I chat with Jenny and Harri. The close-up view allows you to evaluate the accuracy of lip-sync in both English and Finnish. Using GPT-3.5 and Microsoft text-to-speech.
[<img src="images/screenshot5.jpg" width="400"/>](https://youtu.be/fJrYGaGCAGo) | A short demo of how AI can control the avatar's movements. Using OpenAI's function calling and Google TTS with the TalkingHead's built-in viseme generation.
[<img src="images/screenshot6.jpg" width="400"/>](https://youtu.be/6XRxALY1Iwg) | Michael lip-syncs to two MP3 audio tracks using OpenAI's Whisper and TalkingHead's `speakAudio` method. He kicks things off with some casual talk, but then goes all out by trying to tackle an old Meat Loaf classic. 🤘 Keep rockin', Michael! 🎤😂
[<img src="images/screenshot3.jpg" width="400"/>](https://youtu.be/SfnqRnWKT40) | Julia and I showcase some of the features of the TalkingHead class and the test app including the settings, some poses and animations.

*All the demo videos are real-time screen captures from a Chrome browser running
the TalkingHead test web app without any post-processing.*

---

### Use Case Examples

Video/App | Use Case
--- | ---
<span style="display: block; min-width:400px">[<img src="images/olivia.jpg" width="400"/>](https://youtu.be/9GeXwjuslnQ)</span> | **Video conferencing**. A video conferencing solution with real-time transcription, contextual AI responses, and voice lip-sync. The app and demo, featuring Olivia, by [namnm](https://github.com/namnm) 👍
[<img src="images/geminicompetition.jpg" width="400"/>](https://www.youtube.com/watch?v=Dl2o9kRvbLQ) | **Recycling Advisor 3D**. Snap a photo and get local recycling advice from a talking avatar. My entry for the [Gemini API Developer Competition](https://ai.google.dev/competition).
[<img src="images/evertrail.jpg" width="400"/>](https://www.youtube.com/watch?v=OG1vwOit_Yk) | **Live Twitch adventure**. [Evertrail](https://evertrail.app) is an infinite, real-time generated world where all of your choices shape the outcome. Video clip and the app by [JPhilipp](https://github.com/JPhilipp) 👏👏
[<img src="images/cliquevm.jpg" width="400"/>](https://www.youtube.com/watch?v=vNJ9Ifv-as8) | **Quantum physics using a blackboard**. David introduces us to the CHSH game and explores the mystery of quantum entanglement. For more information about the research project, see [CliqueVM](https://github.com/met4citizen/CliqueVM).
[<img src="images/interactiveportfolio.jpg" width="400"/>](https://akshatrastogi.in/) | **Interactive Portfolio**. Click the image to open the app, where you can interview the virtual persona of its developer, [AkshatRastogi-1nC0re](https://github.com/AkshatRastogi-1nC0re) 👋


---

  
    
<br><br>
# Code Walkthrough


## Requirements

#### Hyper-realistic appearance: AI avatars are becoming increasingly realistic. Although they are often created in a studio and then synthesized using machine learning programs, it’s becoming easier and faster to create digital avatars using only GLTF models, photos, or videos recorded by oneself (see Meshcapade editor). For our tutorial, we will use an avatar in GLTF format generated by Ready Player Me rendered through React.js with React Three Fiber.  

#### Natural body movements: To generate some body movements of the avatar, we will use Mixamo. As for synchronizing voice with smooth and natural mouth movements, we will use Rhubarb lip-sync. It is a CLI command that generates phonemes locally, and then we use it to synchronize mouth movements with voice.

#### Text-to-speech (TTS): Text-to-speech (TTS) technology has come a long way since the early days of voice assistants like the Microsoft Agent and DECtalk in the 1990s. Nowadays, TTS can produce realistic voices in all languages. It can generate a digital human with convincing, natural speech if combined with lip synchronization. In this case, we will use ElevenLabs, a multi-language text-to-speech service.

#### Speech-to-text (STT): Speech recognition is a critical feature that allows users to interact with digital avatars through voice commands. For this, we will use Whisper, an OpenAI Speech-to-Text (STT) API. This system transforms the user’s voice into text so AI can hear it appropriately.

 #### Information processing and understanding: By leveraging large language models (LLMs) such as GPT-4, we can enhance the AI avatar’s ability to process and understand information. LLMs are trained on vast amounts of data and can provide contextually relevant responses, enhancing interaction between users and digital avatars.

#### Response latency: The interaction between humans and AI avatars is still not as smooth as a real human interaction. In this case, our avatar will still have high latency– a feature we’ll improve upon in a future post.

## Project Setup
The architecture of our system has two directories: the frontend directory, which is in charge of rendering the avatar, and the backend directory, which is responsible for coordinating all the artificial intelligence services.

  
We start by developing a React project from scratch inside the frontend directory, using Tailwind CSS and Vite as support. We assume that the reader has previous experience with React. However, if you need guidance on how to start a project with React, Tailwind CSS, and Vite, we suggest you consult the following post: How to Setup Tailwind CSS in React JS with VS Code.

After installing the React project, update the structure to resemble the following:

![alt text](images/image-3.png)

#### And we install the following dependencies:

```bash
$ yarn add three  
$ yarn add @types/three   
$ yarn add @react-three/fiber   
$ yarn add @react-three/drei  
$ yarn add --dev leva    
```

As for the backend, we’re going to structure it as follows:

  
![alt text](images/image-2.png)


### And we install the following dependencies:

```bash
yarn add elevenlabs-node
yarn add langchain
yarn add @langchain/openai
yarn add zod
```

#### In the frontend/src/App.js, we will implement the following base code:

```javascript
// frontend/src/App.jsx 

import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { ChatInterface } from "./components/ChatInterface";


function App() {
 return (
   <>
     <Loader />
     <Leva collapsed />
     <ChatInterface />
     <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
       <Scenario />
     </Canvas>
   </>
 );
}


export default App;

```

In the above code, we have set up the main components of a React application integrating 3D graphics using Three.js along with the @react-three/fiber library. We started by importing Loader from @react-three/drei to handle the visualization of loading 3D resources, ensuring a smooth user experience during the application startup.

To represent the 3D scene, we used the Canvas component from @react-three/fiber, which serves as a container for all the 3D visual elements. In this case, the Canvas has shadows enabled (shadows), and the camera is configured with an initial position of [0, 0, 0] and a field of view (fov) of 10. The camera has been set to be at the scene’s center, providing a neutral initial view for the user.

Additionally, we have integrated LEVA, a tool that provides a control panel for manipulating variables in real time without changing the code.


![alt text](images/image-4.png)
### Figure 1. LEVA control panel.
The Scenario component represents the core of our 3D scene, where all objects, lights, and specific environment configurations are placed. This component looks like:


```javascript
// frontend/src/components/Scenario.jsx


import { CameraControls, Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";


export const Scenario = () => {
 const cameraControls = useRef();
 useEffect(() => {
   cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
 }, []);
 return (
   <>
     <CameraControls ref={cameraControls} />
     <Environment preset="sunset" />
   </>
 );
};

```  
### In the Scenario component, we have utilized some elements provided by the @react-three/drei library, a set of helpful abstractions for react-three-fiber. Below are the elements used in the Scenario component:


<CameraControls>: This component handles camera controls, allowing users to interact with the 3D view. For example, the user could orbit around an object and zoom in or out.

<Environment>: This component sets the scene’s environment. By using the sunset preset, it automatically adds lighting and a background that simulates a sunset. The sunset preset helps improve the visual appearance of the scene without the need to manually configure lights and the background. .

The Scenario component returns a JSX fragment containing these three elements. When rendered, this component sets up camera controls, defines the environment, and adds contact shadows to the 3D scene. It also prepares the scene for other 3D components (such as models, additional lights, etc.) to be added and presented with an already established basic appearance and controls.

The Avatar

![alt text](images/image-5.png)
### Figure 2. The avatar editor of Ready Player Me.
The next step is to obtain an avatar to integrate it into our Scenario component. We will access the page Ready Player Me and create our avatar to do this. No registration is required.

On this site, we can customize our avatars by adjusting gender, skin tone, accessories, hair style and colour, face shape, eye shape, and clothing.

Once your avatar is ready, we copy the avatar link and modify it as follows, adding the query parameters morphTargets=ARKit, Oculus Visemes:

https://models.readyplayer.me/YOUR_AVATAR_ID.glb?morphTargets=ARKit,Oculus Visemes
By adding the query parameters, we can download the .glb file with the attributes to animate the avatar’s mouth, eyes, and overall face. Here, you can consult the rest of the query parameters that we can use. Once our avatar is downloaded, we place it in the public/model directory with a name of your choice. In my case, I have called it avatar.glb.

With the avatar.glb file, we go to gltf.pmnd.rs to create our React component for our avatar. If you decide to use TypeScript, it is necessary to specify that you also need the corresponding types.


![alt text](images/image-6.png)
### Figure 3. GLTF editor to generate React.js components.
Since we’re not using TypeScript in our case, the generated code for our avatar would be as follows:


```javascript
// frontend/src/components/Avatar.jsx

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";


export function Avatar(props) {
 const { nodes, materials } = useGLTF("/models/avatar.glb");
 return (
   <group {...props} dispose={null}>
     <primitive object={nodes.Hips} />
     <skinnedMesh
       name="EyeLeft"
       geometry={nodes.EyeLeft.geometry}
       material={materials.Wolf3D_Eye}
       skeleton={nodes.EyeLeft.skeleton}
       morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
       morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
     />
     <skinnedMesh
       name="EyeRight"
       geometry={nodes.EyeRight.geometry}
       material={materials.Wolf3D_Eye}
       skeleton={nodes.EyeRight.skeleton}
       morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
       morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
     />
     <skinnedMesh
       name="Wolf3D_Head"
       geometry={nodes.Wolf3D_Head.geometry}
       material={materials.Wolf3D_Skin}
       skeleton={nodes.Wolf3D_Head.skeleton}
       morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
       morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
     />
     <skinnedMesh
       name="Wolf3D_Teeth"
       geometry={nodes.Wolf3D_Teeth.geometry}
       material={materials.Wolf3D_Teeth}
       skeleton={nodes.Wolf3D_Teeth.skeleton}
       morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
       morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Glasses.geometry}
       material={materials.Wolf3D_Glasses}
       skeleton={nodes.Wolf3D_Glasses.skeleton}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Headwear.geometry}
       material={materials.Wolf3D_Headwear}
       skeleton={nodes.Wolf3D_Headwear.skeleton}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Body.geometry}
       material={materials.Wolf3D_Body}
       skeleton={nodes.Wolf3D_Body.skeleton}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
       material={materials.Wolf3D_Outfit_Bottom}
       skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
       material={materials.Wolf3D_Outfit_Footwear}
       skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
     />
     <skinnedMesh
       geometry={nodes.Wolf3D_Outfit_Top.geometry}
       material={materials.Wolf3D_Outfit_Top}
       skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
     />
   </group>
 );
}


useGLTF.preload("/models/avatar.glb");
```

The previous code contains a React component called Avatar, which loads and renders the 3D model avatar.glb using Three.js through the @react-three/drei library. This component uses the useGLTF hook to load a GLB file, a binary format of glTF (GL Transmission Format), a standard specification for the efficient distribution of 3D models.

The previous component does the following:

Loading the 3D Model: The useGLTF hook loads the 3D model from the provided path (“models/avatar.glb”). Once loaded, this hook returns two important objects: nodes, which contain all the nodes or elements of the model, and materials, which store the materials defined in the 3D model.

Component Structure: The Avatar component returns a Three.js <group> element group, which acts as a container for all child elements. This group receives any additional props passed to the Avatar component via {…props} and prevents the JavaScript garbage collector from removing the group when not in use by setting dispose={null}.

Meshes with Skinning: Inside the group, multiple <skinnedMesh> components are created, each representing a part of the avatar with its own geometry, material, and skeleton. Skinned meshes allow complex animations, such as facial expressions or character movement, as their vertices are linked to a bone system (skeleton).

Morph Targets: Some meshes include morphTargetDictionary and morphTargetInfluences, which are used for animations based on morph targets. These animations deform the mesh in a controlled way to create facial expressions or subtle movements.

Preloading: Finally, useGLTF.preload(“models/avatar.glb”) is used to preload the 3D model in the background as soon as possible, which can improve the user experience by reducing the waiting time when the Avatar component is first mounted.

The previous code defines an Avatar component that renders an interactive 3D avatar with movable parts and facial expressions. This avatar is ready to be integrated into a larger 3D scene or used as a standalone element within a web application.

Now, what we’ll do is update our Scenario component as follows:


```javascript
// frontend/src/components/Scenario.jsx


import { CameraControls, Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";


export const Scenario = () => {
  const cameraControls = useRef();
  useEffect(() => {
    cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Avatar />
    </>
  );
};    
And we place our avatar far away from the camera:

//frontend/src/components/Avatar.js
// Omitted code for simplicity
<group {...props} dispose={null} position={[0, -0.65, 0]}>
```

The result should look something like this:
![alt text](images/image-7.png)
### Figure 4. Preview of the rendered avatar.
.
Animations
As we mentioned earlier, one of the fundamental features of AI avatars is their body movements. To meet this requirement, we will perform two tasks in this section:

Use Mixamo to animate the whole body, and to add movements such as dancing, waving, running, etc.
Add a natural blink to the eyes to make the eyes more realistic.
Body Movements with Mixamo Animations
To use Mixamo, we must first convert our avatar.glb model into a .fbx file format. To do this, we will use Blender, by following these steps:

Install Blender on our computer.
Create a new general-type project:

![alt text](images/image-8.png)
### Figure 5. Start a new General type project.
.
Remove all the elements from the scene and import the avatar.glb file:

![alt text](images/image-9.png)
### Figure 6. Import a .glb/.gltf file.
When selecting our file, we adjust the Bone Dir parameter in Temperance, as shown in the image:


![alt text](images/image-10.png)
### Figure 6. Set the Bone Dir parameter to Temperance.
If done correctly, our avatar should look like this in Blender:


![alt text](images/image-11.png)
### Figure 6. GLFT model in Blender.
Export the file in .fbx format.

![alt text](images/image-12.png)
### Figure 7. Export in FBX format.
We must ensure that the Path Mode parameter is set to copy:

![alt text](images/image-13.png)
### Figure 8. Set the Path Mode parameter to copy.
And finally, we export them to our frontend/public/models directory.

Now that we have our model in FBX format, let’s go to https://www.mixamo.com/, register, and upload the avatar.fbx file. Here, we will find a variety of animations in which we can animate our avatar. Remember, the idea here is to make our avatar act as realistically as possible.

As shown in the GIF, I’ve taught my digital avatar to dance hip-hop:


![alt text](images/image-14.png)
### Figure 9. CORA-male, the digital human in this post, is showing his best hip-hop moves.
Before we continue, I want to explain the relation between these animations with OpenAI GPT or any other language model we wish to implement. In the backend, we are going to implement an OpenAI GPT integration module for these animations. This module will handle the synchronization between the generated responses and the corresponding animations, ensuring that the avatar’s movements and facial expressions match the context and flow of the conversation.

By doing this, we improve the overall user experience, making interactions feel more natural. The code for this module looks like this:

```javascript
// backend/modules/openAI.mjs


import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";


dotenv.config();


const template = `
  You are CORA-male, a world traveler.
  You will always respond with a JSON array of messages, with a maximum of 3 messages:
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
  Surprised, DismissingGesture and ThoughtfulHeadShake.
`;


const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  ["human", "{question}"],
]);


const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "-",
  modelName: process.env.OPENAI_MODEL || "davinci",
  temperature: 0.2,
});


const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);


const openAIChain = prompt.pipe(model).pipe(parser);


export { openAIChain, parser };
In this code, we use @langchain/openai to create an interactive chat system that incorporates animated responses and facial expressions using OpenAI’s artificial intelligence. In the template variable, we instruct the AI to act as a character named CORA-male, a world traveler. We also specify that CORA-male should always respond with a JSON array containing messages. The responses should follow a specific format in which each element has defined properties for the text that CORA-male will say, its facial expression, and the animation or movement it will perform.

The facial expressions that CORA-male can use in responding are a smile, sadness (sad), anger (angry), surprise (surprised), funny face (funnyFace), and a default expression (default). These expressions humanize the responses generated by the AI. In addition, we detail some animations that CORA-male can execute while responding, such as Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture and ThoughtfulHeadShake. These animations make the interaction more dynamic and entertaining, providing an additional element that accompanies the generated text:

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);
```

We use the zod library to implement a schema that validates the response’s structure to ensure the response always has the desired JSON array. This schema acts as a template that defines the response’s structure and content.

If you want to learn more about how to make LLMs respond to your questions with a particular data structure, I recommend you read the article: How to Make LLMs Speak Your Language.

Up to this point, it’s important to note that CORA-male will reply to a user not just by sending out generated text, but with appropriate facial expression for the situation being discussed. To ensure that these elements adhere to a predefined standard, we have used a zod scheme. This scheme acts as a template that defines what the response should be in terms of its structure and content.

Each time CORA-male generates a response, it goes through a validation process with zod.zod inspects the response and checks that each part complies with the rules set in the schema. The response is sent to Azure Cognitive Speech Service if everything is in order. But if something doesn’t match, zod identifies the problem, allowing it to be corrected before proceeding. In this way, confusion or misunderstandings from a poorly formed response are avoided.

Now that we understand the reasoning behind animations from Mixamo, let’s explore ways to incorporate them into our model.

We will first select a set of animations coherent with the personality we want to give our avatar. In my case, I have chosen ten of them:

Defeated: Showing frustration after a loss

Angry: Standing angrily

Idle: Stopped, doing nothing

Happy idle: Happy idle

Surprised: Finding something and wiggling fingers

Thoughtful headshake: Shaking head not thoughtfully

Dismissing Gesture: Dismissing with backhand

Talking One: Talking with two hands

Talking Two: Talking with one hand

Sad idle: Standing in a sad disposition

When you have chosen your animations, we must download each one of them without skin, as we can see in the following image:


![alt text](images/image-15.png)
### Figure 10. Download animations without skin.
This way, we ensure that we only download the animation data and locate them in a folder we can easily access. In my case, I decided to place them in the project’s frontend/public animations directory.

Next, in Blender, we create a new general-type project, delete all the default elements, and import one of the animations as an FBX file:


![alt text](images/image-16.png)
### Figure 11. Preview of a Mixamo animation. You must press the space key on your keyboard to run or stop it.
If we have imported it well, our animation should look like a skeleton of triangular bones. To see how the animation works, press the key to play or stop the animation.

Then, in the Nonlinear Animation section, we can edit the animation’s name, which by default appears similar to something like Armature|mixamo.com|Layer0. The idea is to use names related to emotions or feelings associated with the animation so that when we integrate the LLM, it can construct messages and use these emotions to express its feelings.


![alt text](images/image-17.png)
### Figure 12. Change the name of the animations.
The next step will be to add the other animations as follows:

Import the animation as an FBX file.

Disassemble the armature by deleting the animation hierarchy.


![alt text](images/image-18.png)
### Figure 13. Disarticulate the armature.
Add a new action and rename the animation. Use names in CamelCase or snake_case format.

![alt text](images/image-19.png)
### Figure 14. Add a new animation.
Repeat the previous steps with each animation you want to add to
your avatar.

![alt text](images/image-20.png)
### Figure 15. Export the animation package in glTF 2.0 format.
Once our animation package is ready, we must export it as a .glb file and place it in the public/models/ directory. By implementing them in our code, it is enough to do the following in the Avatar.js component:


```javascript
// frontend/src/components/Avatar.jsx
import { useAnimations, useGLTF } from "@react-three/drei";

const { animations } = useGLTF("/models/animations.glb");

const group = useRef();

const { actions, mixer } = useAnimations(animations, group);

const \[animation, setAnimation\] = useState(

animations.find((a) =\> a.name === "Idle") ? "Idle" :
animations\[0\].name);

useEffect(() =\> {

actions\[animation\]

.reset()

.fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)

.play();

return () =\> actions\[animation\].fadeOut(0.5);

}, \[animation\]);
In the above code snippet, we use useGLTF to load the animations from models animations.glb. useGLTF returns an object containing the animations property, which we extract for easier use. Then, we define a reference with useRef to refer to the 3D group that contains the model. In our case, it would be the group provided by the Avatar.jsx component.

// frontend/src/components/Avatar.jsx
\<group {...props} dispose={null} ref={group} position={\[0, -0.65,
0\]}\>
With the useAnimations hook, we connect the loaded animations with our 3D model, which is kept in the group reference. And finally, we implement a useEffect to ensure that the animation plays or changes each time the animation state changes. When the state changes, reset() restarts the animation, fadeIn() is used to smooth the transition to the new animation, and play() starts the animation.

When the effect is finished, fadeOut() is used to smooth the transition out of the current animation.

In summary, this code loads an animation file, connects it to a 3D model, and controls what animation is activated based on the application’s state.

Update Function for Morphological Traits
In this section, we will implement a function called lerpMorphTarget in the Avatar.jsx component. In game development and 3D animations, lerp is a commonly used term that means “linear interpolation” - a process that allows for a smooth transition between two points or values. In this case, “MorphTarget” refers to a feature of 3D models representing different states or shapes they can adopt. The code for our function will look like this:

// frontend/src/components/Avatar.jsx
const lerpMorphTarget = (target, value, speed = 0.1) => {
   scene.traverse((child) => {
     if (child.isSkinnedMesh && child.morphTargetDictionary) {
       const index = child.morphTargetDictionary[target];
       if (index === undefined || child.morphTargetInfluences[index] === undefined) {
         return;
       }
       child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
     }
   });
 };

 ```

The lerpMorphTarget function has three parameters: target, value, and speed. target identifies which morphological aspect we want to transform, value determines the magnitude of the transformation, and speed sets the speed at which the transformation is performed.

The function operates in the context of a scene, which could be a 3D scene. scene.traverse is a function that allows us to go through all the elements (children) of the scene.

The first condition, if (child.isSkinnedMesh && child.morphTargetDictionary), checks if the child object is a SkinnedMesh object. A SkinnedMesh object is a type of 3D object that is deformable and transformable), and it has a morph target dictionary.

Next, it tries to get the index of the morph target we want to change from the morphTargetDictionary.The function stops if the reference to the child object or the morph target index does not exist.

If both references are valid, the function reassigns the respective morph target influence value using THREE.MathUtils.lerp, a linear interpolation method within the three.js library.

Eye Blinking Feature
If we want our digital human to behave more realistically, adding natural eye blinking is necessary. To add eye blinking, we will animate the morphological elements eyeBlinkLeft and eyeBlinkRight in the Avatar.jsx component. We start by importing the useFrame hook from @react-three/fiberwhich allows us to update the scene or objects in the scene frame by frame:


```javascript
// frontend/src/components/Avatar.jsx
import { useFrame } from "@react-three/fiber";   
We set the blink state to control the eyes’ state:

// frontend/src/components/Avatar.jsx

const [blink, setBlink] = useState(false);
Then we use the useFrame hook, which will check if the state of blink has changed from second to second and will update the state of the eyes in the avatar through the lerpMorphTarget function, generating the blinking of the eyes:

// frontend/src/components/Avatar.jsx
useFrame(() => {
   lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
   lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);
 });
As you can see, if we don’t update the blink state, the eyes will never blink. To accomplish this, we implement the following useEffect, where we randomly change the state of blink in a threshold of 1 second to 5 seconds, generating natural blinking.

// frontend/src/components/Avatar.jsx
    useEffect(() => {
   let blinkTimeout;
   const nextBlink = () => {
     blinkTimeout = setTimeout(() => {
       setBlink(true);
       setTimeout(() => {
         setBlink(false);
         nextBlink();
       }, 200);
     }, THREE.MathUtils.randInt(1000, 5000));
   };
   nextBlink();
   return () => clearTimeout(blinkTimeout);
 }, []);

 ```


In this way, we get a charming look for our avatar:



![alt text](images/image-21.png)
### Figure 16. CORA-male showing off his sensual look.
Facial Expressions with Leva Library
As mentioned before, Leva is a library to control all the avatar’s features, such as eyes, eyebrows, mouth, hands, feet, etc. In this case, we will use it to create a set of facial expressions and debug our code. The first thing we’ll do is import useControls and button to configure the control panel that will allow us to modify all the attributes of our avatar:

```javascript
// frontend/src/components/Avatar.jsx
import { button, useControls } from "leva";
Then, according to the Ready Player Me documentation, we define an array with all the morphTargets and the visemes in the frontend/src/constants/morphTargets.js file:

\\ frontend/src/constants/morphTargets.js

const morphTargets = [
 "mouthOpen",
 "viseme_sil",
 "viseme_PP",
 "viseme_FF",
 "viseme_TH",
 "viseme_DD",
 "viseme_kk",
 "viseme_CH",
 "viseme_SS",
 "viseme_nn",
 "viseme_RR",
 "viseme_aa",
 "viseme_E",
 "viseme_I",
 "viseme_O",
 "viseme_U",
 "mouthSmile",
 "browDownLeft",
 "browDownRight",
 "browInnerUp",
 "browOuterUpLeft",
 "browOuterUpRight",
 "eyeSquintLeft",
 "eyeSquintRight",
 "eyeWideLeft",
 "eyeWideRight",
 "jawForward",
 "jawLeft",
 "jawRight",
 "mouthFrownLeft",
 "mouthFrownRight",
 "mouthPucker",
 "mouthShrugLower",
 "mouthShrugUpper",
 "noseSneerLeft",
 "noseSneerRight",
 "mouthLowerDownLeft",
 "mouthLowerDownRight",
 "mouthLeft",
 "mouthRight",
 "eyeLookDownLeft",
 "eyeLookDownRight",
 "eyeLookUpLeft",
 "eyeLookUpRight",
 "eyeLookInLeft",
 "eyeLookInRight",
 "eyeLookOutLeft",
 "eyeLookOutRight",
 "cheekPuff",
 "cheekSquintLeft",
 "cheekSquintRight",
 "jawOpen",
 "mouthClose",
 "mouthFunnel",
 "mouthDimpleLeft",
 "mouthDimpleRight",
 "mouthStretchLeft",
 "mouthStretchRight",
 "mouthRollLower",
 "mouthRollUpper",
 "mouthPressLeft",
 "mouthPressRight",
 "mouthUpperUpLeft",
 "mouthUpperUpRight",
 "mouthSmileLeft",
 "mouthSmileRight",
 "tongueOut",
 "eyeBlinkLeft",
 "eyeBlinkRight",
];


export default morphTargets;    

```

In this code fragment, we manipulate the avatar’s facial expressions and Morph Targets. These parameters allow you to change the model’s emotional expression and facial features in real-time.

The code defines two control panels using the useControls function:

FacialExpresions: This section shows all the animations loaded in the model. In the control panel, we can find selectors to choose between the different options that we have predefined. The setAnimation function updates the animation. There are two additional buttons on this panel. The setupMode button toggles the setup mode, and logMorphTargetValues logs the current values of MorphTarget influences in the console.

MorphTarget: Provides sliders for each predefined MorphTarget. MorphTargets are used in 3D animation to deform the avatar’s mesh. The controllers on this panel will allow us to manipulate these deformations in real-time. The value of each slider ranges from 0 (no influence) to 1 (total influence). When sliding the control, the function defined in onChange, lerpMorphTarget, is called with the corresponding MorphTarget and the new value.


![alt text](images/image-22.png)
### Figure 17. CAM panel implemented in the avatar interface.
This user interface provides an intuitive way to experiment with the avatar’s animation and movements in real-time, greatly enhancing its accessibility and ability to manipulate these complex functionalities.

From this interface, you can customize your avatar’s facial expressions. Simply enable the editing model with the setMode button, then adjust all the parameters of those Morph Targets that we want to transform and then by clicking on logMorphTargetValues, we can see in the console the object of the facial expression that we have created. For example, in the following image, I have adjusted the values so that CORA-male looks somewhat surprised:


![alt text](images/image-23.png)
### Figure 18. Adjusting morphological parameters.
By clicking on logMorphTargetValues, the object logged in the console is:

```javascript
{
  "mouthOpen": 0.5038846174508553,
  "viseme_O": 0.48860157907883556,
  "browDownLeft": 0.28300077033602955,
  "browInnerUp": 0.6585272447570272,
  "browOuterUpLeft": 0.7215888575281937,
  "eyeSquintLeft": 0.3999999999999997,
  "eyeSquintRight": 0.43999999999999967,
  "noseSneerLeft": 0.1700000727403596,
  "noseSneerRight": 0.14000002836874043,
  "mouthPressLeft": 0.6099999999999992,
  "mouthPressRight": 0.4099999999999997
}

Once you have customized all the facial expressions you want your avatar to use when speaking, you must save them in a file. In my case, I placed them in the constant/facialExpressions.js directory:

\\ frontend/src/constants/facialExpressions.js
const facialExpressions = {
 default: {},
 smile: {
   browInnerUp: 0.17,
   eyeSquintLeft: 0.4,
   eyeSquintRight: 0.44,
   noseSneerLeft: 0.1700000727403593,
   noseSneerRight: 0.14000002836874015,
   mouthPressLeft: 0.61,
   mouthPressRight: 0.41000000000000003,
 },
 funnyFace: {
   jawLeft: 0.63,
   mouthPucker: 0.53,
   noseSneerLeft: 1,
   noseSneerRight: 0.39,
   mouthLeft: 1,
   eyeLookUpLeft: 1,
   eyeLookUpRight: 1,
   cheekPuff: 0.9999924982764238,
   mouthDimpleLeft: 0.414743888682652,
   mouthRollLower: 0.32,
   mouthSmileLeft: 0.35499733688813034,
   mouthSmileRight: 0.35499733688813034,
 },
 sad: {
   mouthFrownLeft: 1,
   mouthFrownRight: 1,
   mouthShrugLower: 0.78341,
   browInnerUp: 0.452,
   eyeSquintLeft: 0.72,
   eyeSquintRight: 0.75,
   eyeLookDownLeft: 0.5,
   eyeLookDownRight: 0.5,
   jawForward: 1,
 },
 surprised: {
   eyeWideLeft: 0.5,
   eyeWideRight: 0.5,
   jawOpen: 0.351,
   mouthFunnel: 1,
   browInnerUp: 1,
 },
 angry: {
   browDownLeft: 1,
   browDownRight: 1,
   eyeSquintLeft: 1,
   eyeSquintRight: 1,
   jawForward: 1,
   jawLeft: 1,
   mouthShrugLower: 1,
   noseSneerLeft: 1,
   noseSneerRight: 0.42,
   eyeLookDownLeft: 0.16,
   eyeLookDownRight: 0.16,
   cheekSquintLeft: 1,
   cheekSquintRight: 1,
   mouthClose: 0.23,
   mouthFunnel: 0.63,
   mouthDimpleRight: 1,
 },
 crazy: {
   browInnerUp: 0.9,
   jawForward: 1,
   noseSneerLeft: 0.5700000000000001,
   noseSneerRight: 0.51,
   eyeLookDownLeft: 0.39435766259644545,
   eyeLookUpRight: 0.4039761421719682,
   eyeLookInLeft: 0.9618479575523053,
   eyeLookInRight: 0.9618479575523053,
   jawOpen: 0.9618479575523053,
   mouthDimpleLeft: 0.9618479575523053,
   mouthDimpleRight: 0.9618479575523053,
   mouthStretchLeft: 0.27893590769016857,
   mouthStretchRight: 0.2885543872656917,
   mouthSmileLeft: 0.5578718153803371,
   mouthSmileRight: 0.38473918302092225,
   tongueOut: 0.9618479575523053,
 },
};


export default facialExpressions;
Remember that in the template we used with OpenAI, we asked GPT to return a facial expression:

\\ backend/modules/openAI.mjs
const parser = StructuredOutputParser.fromZodSchema(
 z.object({
   messages: z.array(
     z.object({
       text: z.string().describe("text to be spoken by the AI"),
       facialExpression: z
         .string()
         .describe(
           "facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
         ),
       animation: z
         .string()
         .describe(
           "animation to be used by the AI. Select from: Talking-1, Talking-2, Talking-3, Thriller and Rapping"
         ),
     })
   ),
 })
);
So, later, we will use facial expressions based on the response generated by the OpenAI API.

```

Speech and Lip-Sync
This section will explain how to implement the speech and lip synchronization system using the following APIs: OpenAI GPT, Eleven Labs TTS API, and Rhubarb Lip Sync.


![alt text](images/image-24.png)
### Figure 19. The general structure of our project’s logic. (However now most of them are updates to AWS services)
There will be two main workflows based on the user input being in text or audio form:

Workflow with text input:

The user enters text.
The text is sent to the OpenAI GPT API for processing.
The response from GPT is sent to the Eleven Labs TTS API to generate audio.
The audio is sent to Rhubarb Lip Sync to generate viseme metadata.
The visemes synchronize the digital human’s lips with the audio.
Workflow with audio input:

The user enters audio.
The audio is sent to the OpenAI Whisper API to generate text.
The generated text is sent to the OpenAI GPT API for processing.
The response from GPT is sent to the Eleven Labs TTS API to generate audio.
The audio is sent to Rhubarb Lip Sync to generate viseme metadata.
The visemes synchronize the digital human’s lips with the audio.
Client Text and Audio
We will use the following hook to handle text, audio, and backend responses: a React context and multiple states to manage voice recording and send it to the backend. Then, through the Whisper API, we will transform the audio into text, allowing the OpenAI GPT API to process it and provide a response that we can further process with the ElevenLabs API and Rhubarb Lip-Sync to generate lip synchronization for the avatar, thus producing a more human-like response on the client side.

```javascript
\\ frontend/src/hooks/useSpeech.jsx


import { createContext, useContext, useEffect, useState } from "react";


const backendUrl = "http://localhost:3000";


const SpeechContext = createContext();


export const SpeechProvider = ({ children }) => {
 const [recording, setRecording] = useState(false);
 const [mediaRecorder, setMediaRecorder] = useState(null);
 const [messages, setMessages] = useState([]);
 const [message, setMessage] = useState();
 const [loading, setLoading] = useState(false);


 let chunks = [];


 const initiateRecording = () => {
   chunks = [];
 };


 const onDataAvailable = (e) => {
   chunks.push(e.data);
 };


 const sendAudioData = async (audioBlob) => {
   const reader = new FileReader();
   reader.readAsDataURL(audioBlob);
   reader.onloadend = async function () {
     const base64Audio = reader.result.split(",")[1];
     setLoading(true);
     const data = await fetch(`${backendUrl}/sts`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ audio: base64Audio }),
     });
     const response = (await data.json()).messages;
     setMessages((messages) => [...messages, ...response]);
     setLoading(false);
   };
 };


 useEffect(() => {
   if (typeof window !== "undefined") {
     navigator.mediaDevices
       .getUserMedia({ audio: true })
       .then((stream) => {
         const newMediaRecorder = new MediaRecorder(stream);
         newMediaRecorder.onstart = initiateRecording;
         newMediaRecorder.ondataavailable = onDataAvailable;
         newMediaRecorder.onstop = async () => {
           const audioBlob = new Blob(chunks, { type: "audio/webm" });
           try {
             await sendAudioData(audioBlob);
           } catch (error) {
             console.error(error);
             alert(error.message);
           }
         };
         setMediaRecorder(newMediaRecorder);
       })
       .catch((err) => console.error("Error accessing microphone:", err));
   }
 }, []);


 const startRecording = () => {
   if (mediaRecorder) {
     mediaRecorder.start();
     setRecording(true);
   }
 };


 const stopRecording = () => {
   if (mediaRecorder) {
     mediaRecorder.stop();
     setRecording(false);
   }
 };


 // TTS logic
 const tts = async (message) => {
   setLoading(true);
   const data = await fetch(`${backendUrl}/tts`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ message }),
   });
   const response = (await data.json()).messages;
   setMessages((messages) => [...messages, ...response]);
   setLoading(false);
 };


 const onMessagePlayed = () => {
   setMessages((messages) => messages.slice(1));
 };


 useEffect(() => {
   if (messages.length > 0) {
     setMessage(messages[0]);
   } else {
     setMessage(null);
   }
 }, [messages]);


 return (
   <SpeechContext.Provider
     value={{
       startRecording,
       stopRecording,
       recording,
       tts,
       message,
       onMessagePlayed,
       loading,
     }}
   >
     {children}
   </SpeechContext.Provider>
 );
};


export const useSpeech = () => {
 const context = useContext(SpeechContext);
 if (!context) {
   throw new Error("useSpeech must be used within a SpeechProvider");
 }
 return context;
};
In the previous code, we find the following:

Imports and initial configurations

\\ frontend/src/hooks/useSpeech.jsx
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";
const SpeechContext = createContext();
First, we import the necessary React functions for our code: createContext, useContext, useEffect, and useState. These functions will allow us to structure our hook and manage its state. Then, we set our server’s URL to ‘backendUrl’ and finish the snippet by creating our context, ‘SpeechContext’.

SpeechProvider and initial states

\\ frontend/src/hooks/useSpeech.jsx
export const SpeechProvider = ({ children }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  let chunks = [];
Now, we set up our main component, SpeechProvider. Additionally, we initialize a series of states using useState. These states include recording to track if the recording is ongoing, mediaRecorder to store our media recording object, messages to maintain a list of voice messages, message for the current voice message, loading to indicate if something is loading, and chunks to store recorded audio chunks.

Essential Recording Functions

\\ frontend/src/hooks/useSpeech.jsx 
 const initiateRecording = () => {
   chunks = [];
 };


 const onDataAvailable = (e) => {
   chunks.push(e.data);
 };


const sendAudioData = async (audioBlob) => {
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  reader.onloadend = async function () {
    const base64Audio = reader.result.split(",")[1];
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/sts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: base64Audio }),
      });
      const response = (await data.json()).messages;
      setMessages((messages) => [...messages, ...response]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
};

```

Next, we set up our recording functions. initiateRecognition clears itself for each new recording, onDataAvailable collects the recording chunks, and sendAudioData sends all these chunks as a Blob to the server to convert them into text.

MediaRecorder Configuration
```javascript
\\ frontend/src/hooks/useSpeech.jsx
useEffect(() => {
   if (typeof window !== "undefined") {
     navigator.mediaDevices
       .getUserMedia({ audio: true })
       .then((stream) => {
         const newMediaRecorder = new MediaRecorder(stream);
         newMediaRecorder.onstart = initiateRecording;
         newMediaRecorder.ondataavailable = onDataAvailable;
         newMediaRecorder.onstop = async () => {
           const audioBlob = new Blob(chunks, { type: "audio/webm" });
           try {
             await sendAudioData(audioBlob);
           } catch (error) {
             console.error(error);
             alert(error.message);
           }
         };
         setMediaRecorder(newMediaRecorder);
       })
       .catch((err) => console.error("Error accessing microphone:", err));
   }
 }, []);
Here, we use useEffect to set up our MediaRecorder once the SpeechProvider is mounted in the DOM. We bind our recording functions to trigger when MediaRecorder starts or stops recording.

Recording Control Functions

\\ frontend/src/hooks/useSpeech.jsx 
 const tts = async (message) => {
   setLoading(true);
   const data = await fetch(`${backendUrl}/tts`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ message }),
   });
   const response = (await data.json()).messages;
   setMessages((messages) => [...messages, ...response]);
   setLoading(false);
 };


 const onMessagePlayed = () => {
   setMessages((messages) => messages.slice(1));
 };


 useEffect(() => {
   if (messages.length > 0) {
     setMessage(messages[0]);
   } else {
     setMessage(null);
   }
 }, [messages]);
The code provides a tts function pointing to the endpoint in the backend that can process the text directly and generate the audio and visemes used in the avatar’s lip synchronization. Meanwhile, onMessagePlayed simply removes a message once it has been played. When the messages list changes, the useEffect sets the current message.

Providing the Context

\\ frontend/src/hooks/useSpeech.jsx 
 return (
   <SpeechContext.Provider
     value={{
       startRecording,
       stopRecording,
       recording,
       tts,
       message,
       onMessagePlayed,
       loading,
     }}
   >
     {children}
   </SpeechContext.Provider>
 );
};


export const useSpeech = () => {
 const context = useContext(SpeechContext);
 if (!context) {
   throw new Error("useSpeech must be used within a SpeechProvider");
 }
 return context;
};
Finally, SpeechContext.Provider is returned, passing all the necessary functions and states for child components to manipulate and access speech functionalities.

With this, we have a SpeechProvider component that allows users to record their voice, send it to the server to be processed by the OpenAI API, and thus engage in a conversation with it.

Chat Interface and SpeechProvider Integration
To integrate the SpeechProvider, we will use the following interface:

\\ frontend/src/components/ChatInterface.jsx
import { useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";


export const ChatInterface = ({ hidden, ...props }) => {
 const input = useRef();
 const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();


 const sendMessage = () => {
   const text = input.current.value;
   if (!loading && !message) {
     tts(text);
     input.current.value = "";
   }
 };
 if (hidden) {
   return null;
 }


 return (
   <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
     <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
       <h1 className="font-black text-xl text-gray-700">Digital Human</h1>
       <p className="text-gray-600">
         {loading ? "Loading..." : "Type a message and press enter to chat with the AI."}
       </p>
     </div>
     <div className="w-full flex flex-col items-end justify-center gap-4"></div>
     <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
       <button
         onClick={recording ? stopRecording : startRecording}
         className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-4 font-semibold uppercase rounded-md ${
           recording ? "bg-red-500 hover:bg-red-600" : ""
         } ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}
       >
         <svg
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           strokeWidth={1.5}
           stroke="currentColor"
           className="w-6 h-6"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
           />
         </svg>
       </button>


       <input
         className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
         placeholder="Type a message..."
         ref={input}
         onKeyDown={(e) => {
           if (e.key === "Enter") {
             sendMessage();
           }
         }}
       />
       <button
         disabled={loading || message}
         onClick={sendMessage}
         className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
           loading || message ? "cursor-not-allowed opacity-30" : ""
         }`}
       >
         Send
       </button>
     </div>
   </div>
 );
};
We won’t go into detail on the previous code since it’s quite standard. In addition to this, we need to update the file frontend/src/index.js as follows:

\\ frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpeechProvider } from "./hooks/useSpeech";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
   <SpeechProvider>
     <App />
   </SpeechProvider>
 </React.StrictMode>
);
OpenAI GPT API with LangChain
The OpenAI GPT API will serve as the brain of our avatar. Once CORA-male receives a text from the client, he will respond using the following predefined prompt:

\\ backend/modules/openAI.mjs
const template = `
 You are CORA-male, a world traveler.
 You will always respond with a JSON array of messages, with a maximum of 3 messages:
 \n{format_instructions}.
 Each message has properties for text, facialExpression, and animation.
 The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
 The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry,
 Surprised, DismissingGesture and ThoughtfulHeadShake.
`;
Once the interaction with CORA-male has started, the OpenAI GPT API generates a series of responses. Specifically, these responses will consist of an array with a limit of three sentences designed as follows:

{
"text":  CORA-male's response",
"facialExpression": "Facial expression of CORA-male when he begins to speak",
"animation": "Animations used to generate body movements"
}
The concept behind splitting the response into three sentences is to prevent CORA-male from constantly using the same facial expressions and body movements when speaking, giving him a more realistic appearance. Overall, this process is controlled by the following code:

\\ backend/modules/openAI.mjs
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";


dotenv.config();


const template = `
 You are CORA-male, a world traveler.
 You will always respond with a JSON array of messages, with a maximum of 3 messages:
 \n{format_instructions}.
 Each message has properties for text, facialExpression, and animation.
 The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
 The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry,
 Surprised, DismissingGesture and ThoughtfulHeadShake.
`;


const prompt = ChatPromptTemplate.fromMessages([
 ["ai", template],
 ["human", "{question}"],
]);


const model = new ChatOpenAI({
 openAIApiKey: process.env.OPENAI_API_KEY || "-",
 modelName: process.env.OPENAI_MODEL || "davinci",
 temperature: 0.2,
});


const parser = StructuredOutputParser.fromZodSchema(
 z.object({
   messages: z.array(
     z.object({
       text: z.string().describe("Text to be spoken by the AI"),
       facialExpression: z
         .string()
         .describe(
           "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
         ),
       animation: z
         .string()
         .describe(
           `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle,
           Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
         ),
     })
   ),
 })
);


const openAIChain = prompt.pipe(model).pipe(parser);


export { openAIChain, parser };

``` 

The code performs four primary tasks:

It uses the dotenv library to load the necessary environment variables for interacting with the OpenAI API.

It defines a “prompt” template using the ChatPromptTemplate class from @langchain/core/prompts. This template guides the conversation as a predefined script for the chat.

It configures the chat model using the ChatOpenAI class, which relies on OpenAI’s davinci model if the environment variables have not been configured previously.

It parses the output, designing the response generated by the AI in a specific format that includes details about the facial expression and animation to use, which is crucial for a realistic interaction with CORA-male.

In summary, the code connects LangChain with the OpenAI GPT API, sends the predefined prompt, interprets the response, and passes it to the ElevenLab TTS API to convert it into coherent speech, completing the cycle of human-avatar interaction.

OpenAI and Whisper API Setup
As the reader may have noticed, the previous component can only process text. So if the user decides to use the microphone, the audio must be processed beforehand. In other words, we need to transcribe the audio. For this, we will use the Whisper service offered by OpenAI with the following implementation:


```javascript
\\ backend/modules/whisper.mjs
import { OpenAIWhisperAudio } from "langchain/document_loaders/fs/openai_whisper_audio";
import { convertAudioToMp3 } from "../utils/audios.mjs";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const openAIApiKey = process.env.OPENAI_API_KEY;


async function convertAudioToText({ audioData }) {
 const mp3AudioData = await convertAudioToMp3({ audioData });
 const outputPath = "/tmp/output.mp3";
 fs.writeFileSync(outputPath, mp3AudioData);
 const loader = new OpenAIWhisperAudio(outputPath, { clientOptions: { apiKey: openAIApiKey } });
 const doc = (await loader.load()).shift();
 const transcribedText = doc.pageContent;
 fs.unlinkSync(outputPath);
 return transcribedText;
}


export { convertAudioToText };
The main purpose of this code is to convert audio to text. To achieve this, it first converts the audio to MP3 format, then uses the OpenAI Whisper API to transcribe the audio to text, and finally, it cleans up by creating and deleting temporary files as needed.

ElevenLabs API Voice Generation
Once we are sure that the user input (text or audio) has been passed through the OpenAI GPT API and has generated a response, acting according to the flow described above, the response is a text that we must convert into audio. For this, we use the TTS service of ElevenLabs API through the following service:

\\ backend/modules/elenvenLabs.mjs
import ElevenLabs from "elevenlabs-node";
import dotenv from "dotenv";
dotenv.config();


const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;
const modelID = process.env.ELEVEN_LABS_MODEL_ID;


const voice = new ElevenLabs({
 apiKey: elevenLabsApiKey,
 voiceId: voiceID,
});


async function convertTextToSpeech({ text, fileName }) {
 await voice.textToSpeech({
   fileName: fileName,
   textInput: text,
   voiceId: voiceID,
   stability: 0.5,
   similarityBoost: 0.5,
   modelId: modelID,
   style: 1,
   speakerBoost: true,
 });
}


export { convertTextToSpeech, voice };
In the previous fragment, a function called convertTextToSpeech has been implemented, which utilizes the Text-To-Speech (TTS) service of ElevenLabs to convert text into audio.

Specifically:

The elevenlabs-node library is imported to interact with the ElevenLabs API, and dotenv is used to load environment variables from a .env file:
\\ backend/modules/elenvenLabs.mjs
import ElevenLabs from "elevenlabs-node";
import dotenv from "dotenv";
dotenv.config();
The necessary credentials to authenticate with the ElevenLabs service are obtained from the environment variables. These credentials include the ElevenLabs API Key, the voice ID, and the model ID:
\\ backend/modules/elenvenLabs.mjs
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;
const modelID = process.env.ELEVEN_LABS_MODEL_ID;
An instance of ElevenLabs is created by passing the credentials obtained earlier:
\\ backend/modules/elenvenLabs.mjs
const voice = new ElevenLabs({
 apiKey: elevenLabsApiKey,
 voiceId: voiceID,
});
The function convertTextToSpeech takes an object as an argument containing the text to be converted into audio and the name of the output file:
\\ backend/modules/elenvenLabs.mjs
async function convertTextToSpeech({ text, fileName }) {
 await voice.textToSpeech({
   fileName: fileName,
   textInput: text,
   voiceId: voiceID,
   stability: 0.5,
   similarityBoost: 0.5,
   modelId: modelID,
   style: 1,
   speakerBoost: true,
 });
}
Within the convertTextToSpeech function, the textToSpeech method provided by the ElevenLabs instance to converts text into audio. Several parameters are passed, including the output file name, the text to be converted, the voice ID, stability, similarity boost, model ID, style, and speaker boost. The ID for all available voices in Eleven Labs can be accessed here. It’s recommended to have the paid version. With the free version, the avatar doesn’t work well due to an error caused by too many requests.

Finally, the convertTextToSpeech function and the voice instance are exported so that they can be used in other modules of the application:

export { convertTextToSpeech, voice };
Visemes from Rhubarb Lip-Sync Audio File
Let’s start by saying that Rhubarb Lip-Sync is a command-line tool with which you can analyze an audio file to recognize what is being said and automatically generate the necessary information for lip synchronization. Rhubarb Lip-Sync can generate between six and nine mouth positions (visemes). The first six mouth shapes correspond to phonemes from A to F, which are the basic mouth shapes and, according to their documentation, are the minimum mouth positions that should be drawn to achieve successful animation.

In our case, we only need to implement a mapping between these visemes and the default ones provided by our avatar CORA-male, as you can check here. As an additional fact, these six mouth shapes were “invented” at Hanna-Barbera studios for programs like Scooby-Doo and The Flintstones. Since then, they have evolved into a de facto standard for 2D animation and have been widely used by studios such as Disney and Warner Bros.

In addition to the six basic mouth shapes, there are three extended mouth shapes: G, H, and X. These are optional. You can choose to use one or two or leave them out altogether.

To use Rhubarb Lip-Sync, we need to do the following:

Download the latest version according to our operating system from the official Rhubarb Lip-Sync repository.
Create in the backend a /bin directory and put all the contents of the unzipped rhubarb-lip-sync.zip inside it. Sometimes, the operating system requests permissions, so you need to enable them.
Install ffmpeg for Mac OS, Linux or Windows.
Implement the service backend/modules/rhubarbLipSync.mjs in the backend.
// backend/modules/rhubarbLipSync.mjs
import { execCommand } from "../utils/files.mjs";


const getPhonemes = async ({ message }) => {
 const time = new Date().getTime();
 console.log(`Starting conversion for message ${message}`);
 await execCommand(
   { command: `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav` }
   // -y to overwrite the file
 );
 console.log(`Conversion done in ${new Date().getTime() - time}ms`);
 await execCommand({
   command: `./bin/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`,
 });
 // -r phonetic is faster but less accurate
 console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};


export { getPhonemes };
This code imports the execCommand function from the files.mjs file in the backend/utils directory.

// backend/utils/file.mjs
import { exec } from "child_process";
import { promises as fs } from "fs";


const execCommand = ({ command }) => {
 return new Promise((resolve, reject) => {
   exec(command, (error, stdout, stderr) => {
     if (error) reject(error);
     resolve(stdout);
   });
 });
};
Then, the getPhonemes function is defined to execute two commands using the execCommand function. The first command converts an MP3 audio file into a WAV file using the ffmpeg tool. Then, the second command is executed to run rhubarb from the /bin directory to determine the timestamps and phonemes produced during the audio playback. The result is saved in a JSON file, which has a structure like this:

{
 "metadata": {
   "soundFile": "api_0.wav",
   "duration": 2.69
 },
 "mouthCues": [
   { "start": 0.00, "end": 0.01, "value": "X" },
   { "start": 0.01, "end": 0.07, "value": "A" },
   { "start": 0.07, "end": 0.31, "value": "B" },
   { "start": 0.31, "end": 0.39, "value": "A" },
   { "start": 0.39, "end": 0.66, "value": "B" },
   { "start": 0.66, "end": 0.78, "value": "X" },
   { "start": 0.78, "end": 0.86, "value": "B" },
   { "start": 0.86, "end": 0.93, "value": "E" },
   { "start": 0.93, "end": 1.07, "value": "F" },
   { "start": 1.07, "end": 1.21, "value": "C" },
   { "start": 1.21, "end": 1.35, "value": "F" },
   { "start": 1.35, "end": 1.42, "value": "C" },
   { "start": 1.42, "end": 1.63, "value": "F" },
   { "start": 1.63, "end": 1.70, "value": "C" },
   { "start": 1.70, "end": 1.78, "value": "A" },
   { "start": 1.78, "end": 1.96, "value": "B" },
   { "start": 1.96, "end": 2.03, "value": "D" },
   { "start": 2.03, "end": 2.45, "value": "B" },
   { "start": 2.45, "end": 2.69, "value": "X" }
 ]
}
The result of these files will be used later for lip synchronization with the audio.

Implement in the frontend the file frontend/src/constants/visemeMappings.js with the following mapping:
// frontend/src/constants/visemeMappings.js
const visemesMapping = {
 A: "viseme_PP",
 B: "viseme_kk",
 C: "viseme_I",
 D: "viseme_AA",
 E: "viseme_O",
 F: "viseme_U",
 G: "viseme_FF",
 H: "viseme_TH",
 X: "viseme_PP",
};


export default visemesMapping;
Here, we aim to match the phonemes identified by Rhubarb Lip-sync with the corresponding morph targets of our avatar’s visemes. For more details, you can refer to the section on mouth positions in Rhubarb lip-sync and the Morph Targets corresponding to the visemes of the avatar in Ready Player me.

Audio Lip-Sync
In our backend, we have the following code to carry out vocal synchronization with the audio:

// backend/modules/lip-sync.mjs
import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";


const lipSync = async ({ messages }) => {
 await Promise.all(
   messages.map(async (message, index) => {
     const fileName = `audios/message_${index}.mp3`;
     await convertTextToSpeech({ text: message.text, fileName });
     await getPhonemes({ message: index });
     message.audio = await audioFileToBase64({ fileName });
     message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
   })
 );
 return messages;
};


export { lipSync };
Here, we import crucial previously implemented functions, such as convertTextToSpeech and getPhonemes, readJsonTranscript and audioFileToBase64. The latter are responsible for:

readJsonTranscript: Reads information from a JSON file associated with lip synchronization. Its implementation is as follows:
// backend/utils/files.mjs
const readJsonTranscript = async ({ fileName }) => {
 const data = await fs.readFile(fileName, "utf8");
 return JSON.parse(data);
};
audioFileToBase64: Converts an audio file into a Base64 encoded string, facilitating its transmission or efficient storage. Its implementation is as follows:
// backend/utils/files.mjs
const audioFileToBase64 = async ({ fileName }) => {
 const data = await fs.readFile(fileName);
 return data.toString("base64");
};
The main lipSync function performs the following tasks:

Takes an array of messages objects as input, where each object contains text to be converted into speech.
Implements Promise.all to handle asynchronous operations simultaneously. Each message:
Generates a unique audio file named audios/message_${index}.mp3, where the synthesized audio is stored.
Uses convertTextToSpeech to synthesize the audio from the message text and save it with the generated file name.
Calls getPhonemes to extract phonemes from the generated audio, which is useful for lip animation.
Utilizes audioFileToBase64 to convert the generated audio file into a Base64-encoded string stored in the audio property of the message object.
Calls readJsonTranscript to read lip synchronization data associated with the audio file and stores it in the lipsync property of the message object.
Returns the modified messages array, containing each message object with its processed audio data and lip synchronization information.
Additionally, in the backend, we have also implemented this server:

// backend/index.mjs
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openAIChain, parser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";
import { voice } from "./modules/elevenLabs.mjs";


dotenv.config();


const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;


const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;


app.post("/tts", async (req, res) => {
 const userMessage = await req.body.message;
 if (await sendDefaultMessages({ userMessage })) return;
 let openAImessages = await openAIChain.invoke({
   question: userMessage,
   format_instructions: parser.getFormatInstructions(),
 });
 openAImessages = await lipSync({ messages: openAImessages.messages });
 res.send({ messages: openAImessages });
});


app.post("/sts", async (req, res) => {
 const base64Audio = req.body.audio;
 const audioData = Buffer.from(base64Audio, "base64");
 const userMessage = await convertAudioToText({ audioData });
 let openAImessages = await openAIChain.invoke({
   question: userMessage,
   format_instructions: parser.getFormatInstructions(),
 });
 openAImessages = await lipSync({ messages: openAImessages.messages });
 res.send({ messages: openAImessages });
});


app.listen(port, () => {
 console.log( CORA-male are listening on port ${port}`);
});
This server makes use of all previously implemented functions and exposes two endpoints:

/tts: Receives text that OpenAI processes. The generated response goes through lipSync to generate metadata for synchronization.

/sts: Receives an audio transcribed by Whisper and then processed by OpenAI. The process from the previous item is repeated.

In both cases, the server returns an object called messages with the following structure:

[
  {
    text: "I've been to so many places around the world, each with its own unique charm and beauty.",
    facialExpression: 'smile',
    animation: 'TalkingOne',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7'
    lipsync: { metadata: [Object], mouthCues: [Array] }
  },
  {
    text: :"There were times when the journey was tough, but the experiences and the people I met along the way made it all worth it.",
    facialExpression: 'thoughtful',
    animation: 'TalkingOne',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7'

    lipsync: { metadata: [Object], mouthCues: [Array] }
  },  
{
    text: :"And there's still so much more to see and explore. The world is a fascinating place!",
    facialExpression: 'surprised',
    animation: 'TalkingOne',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7'
    lipsync: { metadata: [Object], mouthCues: [Array] }
  }
]
These objects contain the parameters text, facialExpression, animation, audio in Base64 format, and lipsync, which are metadata for lip synchronization. We will use all this information on the frontend side, as seen below.

Remember that on the frontend side, we have already implemented a hook called useSpeech, which makes use of the following context:

{
    text: "I've been to so many places around the world, each with its own unique charm and beauty.",
    facialExpression: 'smile',
    animation: 'TalkingOne',
    audio: '//uQx//uQxAAADG1DHeGEeipZLqI09Jn5AkRGhGiLv9pZ3QRTd3eIR7`
    lipsync: { metadata: [Object], mouthCues: [Array] }
  }
The one we’ll use in the Avatar.jsx component to finally achieve lip synchronization. To do this, we will update the code of the Avatar.jsx file as follows:

// frontend/src/components/Avatar.jsx
import { useSpeech } from "../hooks/useSpeech";
import facialExpressions from "../constants/facialExpressions";
import visemesMapping from "../constants/visemesMapping";
import morphTargets from "../constants/morphTargets";


// omitted code for simplicity


export function Avatar(props) {


// omitted code for simplicity


 const { message, onMessagePlayed } = useSpeech();
 const [lipsync, setLipsync] = useState();
 const [facialExpression, setFacialExpression] = useState("");
 const [audio, setAudio] = useState();
 const [animation, setAnimation] = useState(animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name);




 useEffect(() => {
   if (!message) {
     setAnimation("Idle");
     return;
   }
   setAnimation(message.animation);
   setFacialExpression(message.facialExpression);
   setLipsync(message.lipsync);
   const audio = new Audio("data:audio/mp3;base64," + message.audio);
   audio.play();
   setAudio(audio);
   audio.onended = onMessagePlayed;
 }, [message]);


 const lerpMorphTarget = (target, value, speed = 0.1) => {
   scene.traverse((child) => {
     if (child.isSkinnedMesh && child.morphTargetDictionary) {
       const index = child.morphTargetDictionary[target];
       if (index === undefined || child.morphTargetInfluences[index] === undefined) {
         return;
       }
       child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
     }
   });
 };


 useFrame(() => {
   const appliedMorphTargets = [];
   if (message && lipsync) {
     const currentAudioTime = audio.currentTime;
     for (let i = 0; i < lipsync.mouthCues.length; i++) {
       const mouthCue = lipsync.mouthCues[i];
       if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
         appliedMorphTargets.push(visemesMapping[mouthCue.value]);
         lerpMorphTarget(visemesMapping[mouthCue.value], 1, 0.2);
         break;
       }
     }
   }


   Object.values(visemesMapping).forEach((value) => {
     if (appliedMorphTargets.includes(value)) {
       return;
     }
     lerpMorphTarget(value, 0, 0.1);
   });
 });


```


# Avatar.jsx - Building an Animated AI Avatar

In the provided code snippet, we update the React component, Avatar.jsx, representing an animated avatar. Here’s a detailed explanation of what each part of the code does:

---

## Necessary Modules and Resources Are Imported:
- **`useSpeech`**: A custom hook providing access to the current message being played.
- **`facialExpressions`**: A module containing predefined facial expressions for the avatar.
- **`visemesMapping`**: A module mapping visemes to avatar morphological targets.
- **`morphTargets`**: A module defining avatar morphological targets for different expressions and movements.

---

## Inside the Avatar Component:
The result of `useSpeech` is destructured into `message` and `onMessagePlayed`, where:
- **`message`**: Contains information about the current message being played, such as text, facial expression, animation, audio, and lip synchronization metadata.

---

## State Initialization:
States `lipsync`, `facialExpression`, `audio`, and `animation` are initialized using `useState`. These states store:
- **`lipsync`**: Lip synchronization metadata.
- **`facialExpression`**: The current facial expression.
- **`audio`**: The audio object of the message.
- **`animation`**: The current avatar animation.

---

## Actions with `useEffect`:
- **Condition**: Triggered whenever the `message` changes.
- **Behavior**:
  1. The avatar animation is set to “Idle” if there’s no message.
  2. States are updated with message information.
  3. An audio object is created, and the message’s audio is played.
  4. An `onended` event is set on the audio to execute `onMessagePlayed` when the message audio ends.

---

## Smoothing Transitions:
The `lerpMorphTarget` function is defined to smooth transitions between avatar morphological targets.

---

## Frame Actions with `useFrame`:
- **Purpose**: Perform actions on each animation frame.
- **Process**:
  1. Corresponding visemes for the current message audio are calculated and applied.
  2. The `mouthCues` array in the lip synchronization metadata is iterated through to determine the active viseme based on the current audio playback time.
  3. Transitions between applied and unapplied visemes are smoothed.

---


## References:
- [How ChatGPT, Bard and other LLMs are signalling an evolution for AI digital humans](https://www.digitalhumans.com/blog/how-chatgpt-bard-and-other-llms-are-signaling-an-evolution-for-ai-digital-humans)
- [UnneQ Digital Humans](https://www.digitalhumans.com/)
- [LLMs: Building a Less Artificial and More Intelligent AI Human](https://www.linkedin.com/pulse/llms-building-less-artificial-more-intelligent-ai-human/)
- [Building a digital person design best practices](https://fcatalyst.com/blog/aug2023/building-a-digital-person-design-best-practices)
- [Navigating the Era of Digital Humans: An Initial Exploration of a Future Concept](https://www.linkedin.com/pulse/navigating-era-digital-humans-initial-exploration-future-koelmel-eqrje/)
- [How to Setup Tailwind CSS in React JS with VS Code](https://dev.to/david_bilsonn/how-to-setup-tailwind-css-in-react-js-with-vs-code-59p4)
- [Ex-Human](https://exh.ai/#home)
- [Allosaurus](https://github.com/xinjli/allosaurus)
- [Rhubarb Lip-Sync](https://github.com/DanielSWolf/rhubarb-lip-sync)
- [Ready Player Me - Oculus OVR LipSync](https://docs.readyplayer.me/ready-player-me/api-reference/avatars/morph-targets/oculus-ovr-libsync)
- [Ready Player Me - Apple Arkit](https://docs.readyplayer.me/ready-player-me/api-reference/avatars/morph-targets/apple-arkit)
- [How to Build a 3D Chatbot with ChatGPT & ElevenLabs](https://www.youtube.com/watch?v=EzzcEL_1o9o&t=321s)
