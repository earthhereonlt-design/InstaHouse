import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { ApifyClient } from 'apify-client';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.warn("[Apify] Warning: APIFY_TOKEN is not set in environment variables.");
}
const apifyClient = new ApifyClient({
  token: APIFY_TOKEN || "",
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/instagram/:username", async (req, res) => {
    const { username } = req.params;
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

      // Log the keys we found to help debugging
      console.log("[Apify] User data keys:", Object.keys(user));

      const profileData = {
        username: user.username || username,
        fullName: user.fullName || user.username || username,
        profilePic: user.profilePicUrl || user.profilePicUrlHD || `https://ui-avatars.com/api/?name=${username}`,
        followers: user.followersCount || 0,
        following: user.followsCount || 0,
        posts: user.postsCount || user.mediaCount || 0,
        biography: user.biography || ""
      };

      res.json(profileData);
    } catch (error: any) {
      console.error("[Apify] Error:", error.message);
      res.status(500).json({ error: `Failed to fetch Instagram profile: ${error.message}` });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    const { username, fullName, biography, followers, posts } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
      console.error("[Gemini] Invalid API Key");
      return res.status(500).json({ error: "Invalid Gemini API Key. Please set GEMINI_API_KEY in the Secrets panel." });
    }

    try {
      console.log(`[Gemini] Analyzing profile for: ${username}`);
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this Instagram profile and suggest a fitting anime character statue to guard their house.
        Username: ${username}
        Name: ${fullName}
        Bio: ${biography}
        Followers: ${followers}
        Posts: ${posts}
        
        Return a JSON object with:
        - characterName: (e.g., Naruto, Goku, Gojo, Levi, Luffy, Saitama, Itachi, Tanjiro)
        - reason: (A short explanation why this character fits their profile vibe)
        - colorTheme: (A hex color code that represents this character)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              characterName: { type: Type.STRING },
              reason: { type: Type.STRING },
              colorTheme: { type: Type.STRING }
            },
            required: ["characterName", "reason", "colorTheme"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Empty response from Gemini");
      }

      const analysis = JSON.parse(response.text);
      console.log(`[Gemini] Analysis complete: ${analysis.characterName}`);
      res.json(analysis);
    } catch (error: any) {
      console.error("[Gemini] Error:", error.message);
      res.status(500).json({ error: `AI Analysis failed: ${error.message}` });
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
