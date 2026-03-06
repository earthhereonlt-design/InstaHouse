import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { ApifyClient } from 'apify-client';
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file-based cache
const CACHE_FILE = path.join(__dirname, "data", "cache.json");
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
}

interface CacheData {
  profiles: Record<string, any>;
  analyses: Record<string, any>;
}

let cache: CacheData = {
  profiles: {},
  analyses: {}
};

if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    console.log(`[Cache] Loaded ${Object.keys(cache.profiles).length} profiles and ${Object.keys(cache.analyses).length} analyses.`);
  } catch (e) {
    console.error("[Cache] Failed to load cache file, starting fresh.");
  }
}

const saveCache = () => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error("[Cache] Failed to save cache:", e);
  }
};

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.warn("[Apify] Warning: APIFY_TOKEN is not set in environment variables.");
}
const apifyClient = new ApifyClient({
  token: APIFY_TOKEN || "",
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/instagram/:username", async (req, res) => {
    const { username } = req.params;
    
    // Check Cache First
    if (cache.profiles[username]) {
      console.log(`[Cache] Hit for profile: ${username}`);
      return res.json(cache.profiles[username]);
    }

    try {
      console.log(`[Apify] Starting Actor for: ${username}`);
      const input = {
        "usernames": [username],
        "proxyConfiguration": {
          "useApifyProxy": true
        }
      };

      const run = await apifyClient.actor("apify/instagram-profile-scraper").call(input, {
        waitSecs: 180
      });
      
      console.log(`[Apify] Run finished: ${run.id}. Status: ${run.status}`);
      
      const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
      console.log(`[Apify] Found ${items.length} items in dataset`);
      
      const user = items[0];
      
      if (!user) {
        console.error("[Apify] No user data found in dataset");
        return res.status(404).json({ error: "User not found or profile is private. Please check the username." });
      }

      const profileData = {
        username: user.username || username,
        fullName: user.fullName || user.username || username,
        profilePic: user.profilePicUrl || user.profilePicUrlHD || `https://ui-avatars.com/api/?name=${username}`,
        followers: user.followersCount || 0,
        following: user.followsCount || 0,
        posts: user.postsCount || user.mediaCount || 0,
        biography: user.biography || ""
      };

      // Save to Cache
      cache.profiles[username] = profileData;
      saveCache();

      res.json(profileData);
    } catch (error: any) {
      console.error("[Apify] Error:", error.message);
      res.status(500).json({ error: `Failed to fetch Instagram profile: ${error.message}` });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    const { username, fullName, biography, followers, posts, refinement } = req.body;
    
    // Check Cache First (only if no refinement)
    if (!refinement && cache.analyses[username]) {
      console.log(`[Cache] Hit for analysis: ${username}`);
      return res.json(cache.analyses[username]);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
      console.error("[Gemini] Invalid API Key");
      return res.status(500).json({ error: "Invalid Gemini API Key. Please set GEMINI_API_KEY in the Secrets panel." });
    }

    try {
      console.log(`[Gemini] Analyzing profile for: ${username}${refinement ? ` with refinement: ${refinement}` : ""}`);
      const ai = new GoogleGenAI({ apiKey });
      
      let textPrompt = `Analyze this Instagram profile and find the PERFECT anime character that matches their vibe. 
        The character can be from ANY anime (Naruto, One Piece, Dragon Ball, Spy x Family, etc.), not just Naruto.
        
        Username: ${username}
        Name: ${fullName}
        Bio: ${biography}
        Followers: ${followers}
        Posts: ${posts}`;

      if (refinement) {
        textPrompt += `\n\nUSER REFINEMENT REQUEST: The user was not satisfied with the previous result. Please adjust the selection based on this feedback: "${refinement}". 
        Ensure the new character strictly follows this refinement while still being a good match for the profile.`;
      }
        
      textPrompt += `\n\nReturn a JSON object with:
        - characterName: The name of the character.
        - animeName: The name of the anime they are from.
        - signatureAbility: Their most iconic power or ability.
        - stats: An object with Power, Speed, Technique, Intelligence, Aura, and Potential (Values: 1-10).
        - reason: A detailed explanation why this character matches the user's personality and vibe.
        - matchPercentage: A number from 1-100.
        - characterArchetype: A cool title for their archetype (e.g., 'Lone Wolf', 'Solar Knight', 'Chaos Mage').
        - colorTheme: A hex color code representing the character's vibe.`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: textPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              characterName: { type: Type.STRING },
              animeName: { type: Type.STRING },
              signatureAbility: { type: Type.STRING },
              stats: {
                type: Type.OBJECT,
                properties: {
                  power: { type: Type.NUMBER },
                  speed: { type: Type.NUMBER },
                  technique: { type: Type.NUMBER },
                  intelligence: { type: Type.NUMBER },
                  aura: { type: Type.NUMBER },
                  potential: { type: Type.NUMBER }
                },
                required: ["power", "speed", "technique", "intelligence", "aura", "potential"]
              },
              reason: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              characterArchetype: { type: Type.STRING },
              colorTheme: { type: Type.STRING }
            },
            required: ["characterName", "animeName", "signatureAbility", "stats", "reason", "matchPercentage", "characterArchetype", "colorTheme"]
          }
        }
      });

      if (!textResponse.text) {
        throw new Error("Empty response from Gemini text model");
      }

      const analysis = JSON.parse(textResponse.text);
      console.log(`[Gemini] Character Selected: ${analysis.characterName}`);

      // Step 2: Generate a 3D-style image for the character
      console.log(`[Gemini] Generating 3D image for: ${analysis.characterName}`);
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `A high-quality 3D CG render of ${analysis.characterName} from ${analysis.animeName}. 
        Style: Modern 3D anime movie style (like Stand By Me Doraemon or Dragon Ball Super: Super Hero). 
        Cinematic lighting, vibrant colors, detailed textures, professional character portrait. 
        The character should be in a dynamic pose, looking heroic. 
        Background: Simple studio background with a slight glow matching ${analysis.colorTheme}.`,
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      let generatedImageUrl = "";
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!generatedImageUrl) {
        console.warn("[Gemini] Image generation failed, falling back to placeholder");
        generatedImageUrl = `https://picsum.photos/seed/${analysis.characterName}/600/800`;
      }

      const result = { ...analysis, imageUrl: generatedImageUrl };
      
      // Save to Cache (only if no refinement, or overwrite if refinement)
      cache.analyses[username] = result;
      saveCache();

      res.json(result);
    } catch (error: any) {
      console.error("[Gemini] Error:", error.message);
      res.status(500).json({ error: `Analysis failed: ${error.message}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
