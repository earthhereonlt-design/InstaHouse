import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, Download, Share2, 
  ArrowRight, Flame, RefreshCw, BookOpen,
  Target, Sword, Wind, Star, PenTool,
  Zap, Cloud, Moon, Sun, Ghost
} from 'lucide-react';
import { fetchInstagramProfile, analyzeProfile } from '../services/api';
import { InstagramProfile, AnimeAnalysis } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export const Home = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(urlUsername || '');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Gathering Chakra...');
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnimeAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [showSummonSmoke, setShowSummonSmoke] = useState(false);

  useEffect(() => {
    if (urlUsername) {
      handleGenerate(urlUsername);
    }
  }, [urlUsername]);

  const handleGenerate = async (targetUsername: string, refinement?: string) => {
    if (!targetUsername) return;
    
    let cleanUsername = targetUsername;
    if (targetUsername.includes('instagram.com/')) {
      cleanUsername = targetUsername.split('instagram.com/')[1].split('/')[0].split('?')[0];
    }
    
    setLoading(true);
    setError(null);
    if (refinement) setIsRefining(true);

    const loadingSteps = refinement ? [
      'Recalibrating soul resonance...',
      'Searching deeper into the multiverse...',
      'Refining character alignment...',
      'Manifesting new destiny...'
    ] : [
      'Focusing chakra...',
      'Drafting soul scroll...',
      'Assigning character rank...',
      'Generating 3D soul manifestation...'
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setLoadingText(loadingSteps[step]);
      }
    }, 1500);
    
    try {
      const startTime = Date.now();
      const profileData = profile || await fetchInstagramProfile(cleanUsername);
      if (!profile) setProfile(profileData);
      
      const analysisData = await analyzeProfile(profileData, refinement);
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 5000) {
        await new Promise(resolve => setTimeout(resolve, 5000 - elapsedTime));
      }

      // Trigger Summoning Smoke
      setShowSummonSmoke(true);
      setTimeout(() => {
        setAnalysis(analysisData);
        setShowSummonSmoke(false);
        setRefinementText('');
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [analysisData.colorTheme || '#ff6700', '#0047ab', '#1a1a1a', '#ffffff']
        });
      }, 800);

      if (!urlUsername) {
        navigate(`/u/${cleanUsername}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setIsRefining(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/u/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const element = document.getElementById('result-spread');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fdfcf8',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `AnimePersona-${profile?.username}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) {
    const handSigns = [Zap, Flame, Wind, Cloud, Sword, Target, Star];
    const CurrentSign = handSigns[Math.floor(Date.now() / 500) % handSigns.length];

    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="speed-lines-bg" />
        <div className="halftone-pattern" />
        
        {/* Floating Smoke Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              scale: [1, 2, 1.5],
              x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
              y: [Math.random() * 400 - 200, Math.random() * 400 - 200]
            }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
            className="smoke-particle w-32 h-32"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-10 sm:space-y-16 relative z-10 w-full max-w-2xl"
        >
          <div className="relative flex items-center justify-center">
            {/* Sharingan Eye */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="sharingan-eye scale-75 sm:scale-100"
            >
              <div className="sharingan-pupil" />
              <div className="sharingan-tomoe sharingan-tomoe-1" />
              <div className="sharingan-tomoe sharingan-tomoe-2" />
              <div className="sharingan-tomoe sharingan-tomoe-3" />
            </motion.div>

            {/* Hand Sign Sequence */}
            <div className="absolute -bottom-16 sm:-bottom-20 flex gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.floor(Date.now() / 500) % handSigns.length}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  className="p-3 sm:p-4 bg-ink border-4 border-naruto-orange rounded-sm shadow-xl"
                >
                  <CurrentSign className="w-8 h-8 sm:w-12 sm:h-12 text-naruto-orange" />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div 
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="onomatopoeia text-4xl sm:text-6xl -top-12 sm:-top-16 -right-12 sm:-right-24 text-naruto-orange"
            >
              KUCHIYOSE!
            </motion.div>
          </div>
          
          <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-10">
            <motion.h2 
              key={loadingText}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-7xl font-comic text-ink tracking-widest drop-shadow-[4px_4px_0px_#ff6700] sm:drop-shadow-[6px_6px_0px_#ff6700]"
            >
              {loadingText}
            </motion.h2>
            
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-4 h-4 bg-naruto-orange rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (profile && analysis) {
    return (
      <main className="min-h-screen bg-paper p-4 sm:p-12 flex items-center justify-center relative overflow-hidden">
        <div className="speed-lines-bg" />
        <div className="halftone-pattern" />
        
        <AnimatePresence>
          {showSummonSmoke && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 2 }}
              exit={{ opacity: 0, scale: 3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [0, Math.random() * 600 - 300],
                    y: [0, Math.random() * 600 - 300],
                    scale: [1, 3],
                    opacity: [0.8, 0]
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute w-40 h-40 bg-gray-200 rounded-full blur-2xl"
                />
              ))}
              <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] }}
                className="onomatopoeia text-9xl text-white"
              >
                POOF!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          id="result-spread"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10"
        >
          {/* Left: Character Panel */}
          <div className="lg:col-span-6 space-y-10">
            <div className="relative">
              <div className="comic-panel-tilted group">
                <div className="halftone-gradient" />
                <img 
                  src={analysis.imageUrl} 
                  className="w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 left-8">
                  <div className="comic-label bg-naruto-orange">
                    <span>SUMMONED ENTITY</span>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8">
                  <div className="comic-label bg-naruto-blue text-paper">
                    <span>{analysis.matchPercentage}% SOUL RESONANCE</span>
                  </div>
                </div>
              </div>

              {/* Identity Reveal Overlay */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="comic-panel p-4 sm:p-8 bg-naruto-orange rotate-[-2deg] -mt-8 sm:-mt-16 mx-2 sm:mx-4 relative z-20 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] sm:shadow-[16px_16px_0px_0px_rgba(26,26,26,1)]"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="comic-label bg-ink text-paper"><span>IDENTITY CONFIRMED</span></span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 fill-ink text-ink" />)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-4xl sm:text-7xl font-comic text-ink leading-none tracking-tight">
                      {analysis.characterName}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t-2 sm:border-t-4 border-ink/10 pt-3 sm:pt-4 mt-3 sm:mt-4 gap-2">
                      <p className="text-xl sm:text-3xl font-comic text-naruto-blue italic uppercase tracking-wider">
                        {analysis.animeName}
                      </p>
                      <div className="comic-label bg-transparent text-ink border-2 sm:border-4 border-ink px-4 sm:px-6">
                        <span>{analysis.characterArchetype}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="comic-panel p-6 sm:p-10 space-y-4 sm:space-y-6 rotate-[1deg] bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-naruto-orange rounded-sm">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-paper" />
                </div>
                <span className="comic-label"><span>SIGNATURE ABILITY</span></span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-comic text-ink leading-none">THE POWER</h3>
              <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-medium italic border-l-4 border-naruto-orange pl-4 sm:pl-6">
                "{analysis.signatureAbility}"
              </p>
            </div>
          </div>

          {/* Right: Info Panels */}
          <div className="lg:col-span-6 space-y-10">
            <header className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="comic-label"><span>VOL. 01</span></span>
                  <span className="comic-label bg-naruto-orange"><span>SUMMON REVEAL</span></span>
                </div>
                <span className="comic-label bg-naruto-blue text-paper"><span>@{profile.username}</span></span>
              </div>
              <div className="space-y-2">
                <h1 className="comic-title text-ink">
                  ANIME <br/>
                  <span className="text-naruto-orange">CHRONICLES.</span>
                </h1>
              </div>
              <div className="h-2 bg-ink w-full skew-x-[-12deg]" />
            </header>

            {/* Stats Grid */}
            <div className="space-y-4">
              <span className="comic-label"><span>SOUL PARAMETERS</span></span>
              <div className="ninja-stat-grid">
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">POWER</span>
                  <span className="ninja-stat-value">{analysis.stats.power}</span>
                </div>
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">SPEED</span>
                  <span className="ninja-stat-value">{analysis.stats.speed}</span>
                </div>
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">TECHNIQUE</span>
                  <span className="ninja-stat-value">{analysis.stats.technique}</span>
                </div>
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">INTELLIGENCE</span>
                  <span className="ninja-stat-value">{analysis.stats.intelligence}</span>
                </div>
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">AURA</span>
                  <span className="ninja-stat-value">{analysis.stats.aura}</span>
                </div>
                <div className="ninja-stat-item">
                  <span className="ninja-stat-label">POTENTIAL</span>
                  <span className="ninja-stat-value">{analysis.stats.potential}</span>
                </div>
              </div>
            </div>

            <div className="speech-bubble rotate-[-1deg]">
              <div className="halftone-gradient opacity-5" />
              <p className="text-ink text-lg leading-relaxed relative z-10">
                "BELIEVE IT! Your digital aura has manifested as <span className="text-naruto-orange font-black">{analysis.characterName}</span> from <span className="italic">{analysis.animeName}</span>! 
                {analysis.reason}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <button onClick={handleDownload} className="btn-comic-main text-xl py-5">
                <Download className="w-6 h-6 mr-2" />
                EXPORT
              </button>
              <button onClick={handleCopyLink} className="btn-comic-main bg-naruto-blue shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-xl py-5">
                <Share2 className="w-6 h-6 mr-2" />
                {copied ? 'COPIED!' : 'SHARE'}
              </button>
              <button 
                onClick={() => {
                  setProfile(null);
                  setAnalysis(null);
                  setUsername('');
                  navigate('/');
                }}
                className="btn-comic-main bg-white text-ink shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-xl py-5"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>

            {/* Refinement Section */}
            <div className="comic-panel p-8 bg-paper border-4 border-ink space-y-6">
              <div className="flex items-center gap-3">
                <PenTool className="w-6 h-6 text-naruto-orange" />
                <span className="comic-label"><span>REFINE YOUR SOUL</span></span>
              </div>
              <p className="text-sm text-ink/60 italic">
                Not satisfied with your manifestation? Tell the multiverse what's missing (e.g., "make it more villainous", "I prefer swordsmen").
              </p>
              <div className="flex gap-4">
                <input 
                  type="text"
                  value={refinementText}
                  onChange={(e) => setRefinementText(e.target.value)}
                  placeholder="ENTER REFINEMENT..."
                  className="flex-1 px-6 py-4 bg-white border-4 border-ink rounded-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] outline-none focus:shadow-[6px_6px_0px_0px_rgba(255,103,0,1)] transition-all font-comic text-ink"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate(profile.username, refinementText)}
                />
                <button 
                  onClick={() => handleGenerate(profile.username, refinementText)}
                  disabled={loading || !refinementText}
                  className="btn-comic-main py-4 px-8 text-lg"
                >
                  REFINE
                </button>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => handleGenerate(profile.username)}
                  className="text-ink/40 hover:text-naruto-orange transition-colors text-sm font-black italic flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  REGENERATE WITHOUT FEEDBACK
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="onomatopoeia text-4xl sm:text-8xl top-10 sm:top-20 right-10 sm:right-20 text-naruto-orange"
        >
          DATTEBAYO!
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [-15, -20, -15] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="onomatopoeia text-3xl sm:text-6xl bottom-10 sm:bottom-20 left-10 sm:left-20 text-naruto-blue"
        >
          KAGEBUNSHIN!
        </motion.div>
        <motion.div 
          animate={{ x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="onomatopoeia text-2xl sm:text-5xl top-1/2 left-5 sm:left-10 text-naruto-orange"
        >
          RASENGAN!
        </motion.div>

        {/* Leaf Symbols */}
        <div className="leaf-symbol top-1/4 right-1/4" />
        <div className="leaf-symbol bottom-1/4 left-1/4" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="speed-lines-bg" />
      <div className="halftone-pattern" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full text-center space-y-20 relative z-10"
      >
        {/* Decorative Characters */}
        <div className="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 pointer-events-none block">
          <motion.img 
            animate={{ y: [0, -20, 0], rotate: [-5, -2, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src="https://www.pngplay.com/wp-content/uploads/12/Naruto-Uzumaki-Transparent-PNG.png" 
            className="w-48 sm:w-96 opacity-40 sm:opacity-80 drop-shadow-[0_20px_50px_rgba(255,103,0,0.3)]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 pointer-events-none block">
          <motion.img 
            animate={{ y: [0, 20, 0], rotate: [5, 2, 5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            src="https://www.pngplay.com/wp-content/uploads/12/Sasuke-Uchiha-PNG-Photos.png" 
            className="w-48 sm:w-96 opacity-40 sm:opacity-80 drop-shadow-[0_20px_50px_rgba(0,71,171,0.3)]"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-6 sm:space-y-10">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="h-1 w-10 sm:w-20 bg-ink skew-x-[-12deg]" />
            <div className="comic-label bg-naruto-orange"><span>ANIME SUMMONER v10.0</span></div>
            <div className="h-1 w-10 sm:w-20 bg-ink skew-x-[-12deg]" />
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <h1 className="comic-title text-ink">
              SUMMON YOUR <br/>
              <span className="text-naruto-orange italic">SOUL!</span>
            </h1>
            <p className="text-lg sm:text-2xl text-ink/70 font-bold max-w-2xl mx-auto leading-relaxed italic">
              "Believe it! Your digital aura is ready to be drafted into the Anime Chronicles. Which character matches your soul?"
            </p>
          </div>
        </div>

        <div className="max-w-lg mx-auto space-y-6 sm:space-y-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-naruto-orange rounded-sm blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER INSTAGRAM USERNAME"
                className="relative w-full px-6 py-5 sm:px-10 sm:py-8 bg-white border-4 border-ink rounded-sm shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] sm:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] focus:shadow-[12px_12px_0px_0px_rgba(255,103,0,1)] sm:focus:shadow-[16px_16px_0px_0px_rgba(255,103,0,1)] outline-none transition-all text-xl sm:text-3xl font-comic text-ink placeholder:text-ink/10"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate(username)}
              />
            </div>

            <button 
              onClick={() => handleGenerate(username)}
              disabled={loading || !username}
              className="btn-comic-main w-full group"
            >
              <span className="flex items-center gap-4 sm:gap-6">
                BEGIN SUMMONING
                <ArrowRight className="w-6 h-6 sm:w-10 sm:h-10 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 border-4 border-ink bg-naruto-orange text-paper font-black italic text-xl rounded-sm shadow-lg"
              >
                DATTEBAYO: {error.toUpperCase()}!!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-10 sm:pt-16 border-t-8 border-ink/5">
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <Sword className="w-6 h-6 sm:w-8 sm:h-8 text-naruto-orange" />
            <span className="text-3xl sm:text-5xl font-comic text-ink">SOUL</span>
            <span className="comic-label"><span>MASTERY</span></span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-naruto-orange fill-naruto-orange" />
            <span className="text-3xl sm:text-5xl font-comic text-ink">CHAKRA</span>
            <span className="comic-label bg-naruto-blue text-paper"><span>POWERED</span></span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            <span className="text-3xl sm:text-5xl font-comic text-ink">S-RANK</span>
            <span className="comic-label bg-accent"><span>ACCURACY</span></span>
          </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-6 sm:bottom-12 w-full px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="comic-label bg-transparent text-ink/30 border-none shadow-none"><span>© 2026 ANIME SOUL CHRONICLES</span></div>
        <div className="flex gap-6 sm:gap-10">
          <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-ink/20 hover:text-naruto-orange transition-colors cursor-pointer" />
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-ink/20 hover:text-accent transition-colors cursor-pointer" />
        </div>
      </footer>

      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="onomatopoeia text-[12rem] -bottom-20 -right-20 opacity-5"
      >
        NINJA!
      </motion.div>
      <motion.div 
        animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="onomatopoeia text-[10rem] -top-20 -left-20 opacity-5"
      >
        JUTSU!
      </motion.div>
    </div>
  );
};
