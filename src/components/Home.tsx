import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Sparkles, Loader2, ArrowRight, Share2, Download, Copy, Check } from 'lucide-react';
import { fetchInstagramProfile, analyzeProfile } from '../services/api';
import { InstagramProfile, AnimeAnalysis } from '../types';
import { HouseScene } from './HouseScene';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export const Home = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(urlUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnimeAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (urlUsername) {
      handleGenerate(urlUsername);
    }
  }, [urlUsername]);

  const handleGenerate = async (targetUsername: string) => {
    if (!targetUsername) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await fetchInstagramProfile(targetUsername);
      setProfile(profileData);
      
      const analysisData = await analyzeProfile(profileData);
      setAnalysis(analysisData);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });

      if (!urlUsername) {
        navigate(`/u/${targetUsername}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/u/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const element = document.getElementById('scene-container');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f0f9ff'
    });
    
    const link = document.createElement('a');
    link.download = `InstaAnimeHouse-${profile?.username}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (profile && analysis) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-bg font-sans uppercase text-warm">
        {/* 3D Scene Container */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-auto">
          <div className="w-full h-full" id="scene-container">
            <HouseScene profile={profile} analysis={analysis} />
          </div>
        </div>

        {/* UI Overlay */}
        <div className="pointer-events-none fixed inset-0 z-20">
          {/* Top Left: Back Button */}
          <div className="pointer-events-auto absolute top-4 left-4">
            <button 
              onClick={() => {
                setProfile(null);
                setAnalysis(null);
                setUsername('');
                navigate('/');
              }}
              className="btn-press flex items-center gap-2 border-[3px] border-border bg-bg/70 px-3 py-1.5 text-[10px] backdrop-blur-sm transition-colors hover:border-border-light"
            >
              <span className="text-accent">ESC</span>
              <span className="text-cream">Back</span>
            </button>
          </div>

          {/* Top Right: Status */}
          <div className="pointer-events-auto absolute top-4 right-4">
            <div className="flex items-center gap-2 border-[3px] border-border bg-bg/70 px-3 py-1.5 text-[10px] backdrop-blur-sm">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-cream">LIVE</span>
            </div>
          </div>

          {/* Bottom Left: Controls */}
          <div className="pointer-events-auto fixed bottom-10 left-4 z-[31] flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="btn-press flex items-center gap-1.5 border-[3px] border-border bg-bg/70 px-2.5 py-1 text-[10px] backdrop-blur-sm transition-colors hover:border-border-light"
            >
              <Download className="w-3 h-3 text-accent" />
              <span className="text-cream">Snapshot</span>
            </button>
            <button 
              onClick={handleCopyLink}
              className="btn-press flex items-center gap-1.5 border-[3px] border-border bg-bg/70 px-2.5 py-1 text-[10px] backdrop-blur-sm transition-colors hover:border-border-light"
            >
              <Share2 className="w-3 h-3 text-accent" />
              <span className="text-cream">{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Bottom Right: Controls Help */}
          <div className="pointer-events-none fixed bottom-10 right-6 z-30 hidden text-right text-[9px] leading-loose text-muted sm:block">
            <div><span className="text-cream">Drag</span> orbit</div>
            <div><span className="text-cream">Scroll</span> zoom</div>
            <div><span className="text-accent">ESC</span> close</div>
          </div>
        </div>

        {/* Right Sidebar: Profile Card */}
        <div className="pointer-events-auto fixed z-40 bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2">
          <div className="relative border-t-[3px] border-border bg-bg-raised/95 backdrop-blur-sm w-full max-h-[50vh] overflow-y-auto sm:w-[320px] sm:border-[3px] sm:max-h-[85vh] animate-[slide-up_0.2s_ease-out] sm:animate-none">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <img 
                alt={profile.username} 
                src={profile.profilePic} 
                className="w-12 h-12 border-[2px] border-border flex-shrink-0 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm text-cream font-bold">{profile.fullName}</p>
                </div>
                <p className="truncate text-[10px] text-muted font-mono">@{profile.username}</p>
              </div>
            </div>

            <div className="mx-4 mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center border-[2px] text-xs font-bold" style={{ borderColor: analysis.colorTheme, color: analysis.colorTheme }}>
                {Math.floor(profile.followers / 100) + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color: analysis.colorTheme }}>
                    Lv {Math.floor(profile.followers / 100) + 1} · {analysis.characterName}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-[4px] flex-1 bg-border">
                    <div className="h-full" style={{ width: '45%', backgroundColor: analysis.colorTheme }}></div>
                  </div>
                  <span className="text-[7px] text-muted font-mono">EXP 45%</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-2">
              <span className="inline-block px-2 py-0.5 text-[8px] text-bg font-bold" style={{ backgroundColor: analysis.colorTheme }}>
                {analysis.characterName} Guardian
              </span>
            </div>

            <div className="grid grid-cols-3 gap-px bg-border/30 mx-4 mb-3 border border-border/50">
              <div className="bg-bg-card p-2 text-center">
                <div className="text-xs text-accent">{profile.followers.toLocaleString()}</div>
                <div className="text-[8px] text-muted mt-0.5">Followers</div>
              </div>
              <div className="bg-bg-card p-2 text-center">
                <div className="text-xs text-accent">{profile.posts.toLocaleString()}</div>
                <div className="text-[8px] text-muted mt-0.5">Posts</div>
              </div>
              <div className="bg-bg-card p-2 text-center">
                <div className="text-xs text-accent">{profile.following.toLocaleString()}</div>
                <div className="text-[8px] text-muted mt-0.5">Following</div>
              </div>
            </div>

            <div className="mx-4 mb-4 p-3 border border-border bg-bg/30">
              <p className="text-[9px] text-warm leading-relaxed normal-case font-mono">
                {analysis.reason}
              </p>
            </div>

            <div className="flex gap-2 p-4 pt-0 pb-5 sm:pb-4">
              <button 
                onClick={handleDownload}
                className="btn-press flex-1 py-2 text-center text-[10px] text-bg font-bold" 
                style={{ backgroundColor: analysis.colorTheme }}
              >
                Save World
              </button>
              <button 
                onClick={() => window.open(`https://instagram.com/${profile.username}`, '_blank')}
                className="btn-press flex-1 border-[2px] border-border py-2 text-center text-[10px] text-cream transition-colors hover:border-border-light font-bold"
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Ticker */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex h-7 items-center border-t border-border/30 bg-bg/90 backdrop-blur-sm">
          <div className="min-w-0 flex-1 overflow-hidden cursor-pointer">
            <div className="ticker-scroll flex whitespace-nowrap" style={{ '--ticker-duration': '40s' } as any}>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🏗 @{profile.username} joined the sanctuary</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🏆 {analysis.characterName} unlocked "Eternal Guardian"</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">✨ Sanctuary generated with {profile.followers} followers</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🔥 {profile.posts} posts analyzed for structure</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🏗 @{profile.username} joined the sanctuary</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🏆 {analysis.characterName} unlocked "Eternal Guardian"</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">✨ Sanctuary generated with {profile.followers} followers</span>
              <span className="mx-6 text-[9px] text-muted hover:text-cream transition-colors">🔥 {profile.posts} posts analyzed for structure</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border-[3px] border-border bg-bg-raised/50 text-accent font-bold text-[10px] mb-4"
          >
            <Sparkles className="w-3 h-3" />
            PIXEL-ART 3D ENGINE v2.0
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-cream font-pixel">
            INSTA<span className="text-accent">ANIME</span>HOUSE
          </h1>
          <p className="text-sm text-dim font-mono max-w-md mx-auto leading-relaxed">
            CONVERT YOUR INSTAGRAM DATA INTO A UNIQUE 3D PIXEL-STYLE SANCTUARY.
          </p>
        </div>

        <div className="bg-bg-raised p-8 border-[3px] border-border space-y-6 relative">
          <div className="absolute -top-3 -left-3 px-2 py-0.5 bg-border text-[8px] text-muted font-bold">LOGIN_PORTAL</div>
          
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">
              <Instagram className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER USERNAME"
              className="w-full pl-14 pr-6 py-4 bg-bg border-[3px] border-border focus:border-accent outline-none transition-all text-sm font-bold text-cream placeholder:text-muted/50"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate(username)}
            />
          </div>

          <button 
            onClick={() => handleGenerate(username)}
            disabled={loading || !username}
            className="btn-press w-full py-4 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-black text-sm transition-all flex items-center justify-center gap-3 group shadow-[4px_4px_0px_0px_rgba(32,56,112,1)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                BUILDING WORLD...
              </>
            ) : (
              <>
                GENERATE SANCTUARY
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 border-[2px] border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold"
              >
                ERROR: {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-4 text-left">
          <div className="p-4 border-[2px] border-border bg-bg-card/30 space-y-2">
            <div className="text-accent font-bold text-[10px]">01 // AI</div>
            <h3 className="font-bold text-cream text-[10px]">VIBE CHECK</h3>
            <p className="text-[8px] text-muted leading-relaxed font-mono">ANALYZING BIO FOR GUARDIAN MATCH.</p>
          </div>
          <div className="p-4 border-[2px] border-border bg-bg-card/30 space-y-2">
            <div className="text-accent font-bold text-[10px]">02 // 3D</div>
            <h3 className="font-bold text-cream text-[10px]">PIXEL WORLD</h3>
            <p className="text-[8px] text-muted leading-relaxed font-mono">CONSTRUCTING VOXEL-STYLE HOUSE.</p>
          </div>
          <div className="p-4 border-[2px] border-border bg-bg-card/30 space-y-2">
            <div className="text-accent font-bold text-[10px]">03 // WEB3</div>
            <h3 className="font-bold text-cream text-[10px]">SHAREABLE</h3>
            <p className="text-[8px] text-muted leading-relaxed font-mono">EXPORT YOUR UNIQUE SANCTUARY.</p>
          </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-12 text-muted text-[8px] font-bold tracking-widest">
        SYSTEM_v2.0.4 // INSTAANIMEHOUSE // © 2026
      </footer>
    </div>
  );
};
