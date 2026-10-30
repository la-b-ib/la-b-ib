import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface CtfModalProps {
 isOpen: boolean;
 onClose: () => void;
}

interface CtfChallenge {
  id: string;
  category: 'crypto' | 'web' | 'dfir' | 'reverse';
  categoryLabel: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  difficultyColor: string;
  points: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  lore: string;
  payloadType: string;
  payload: string;
  hint: string;
  targetFlag: string;
  tabIcon: string;
}

const CTF_CHALLENGES: CtfChallenge[] = [
  {
    id: 'b64-matrix',
    category: 'crypto',
    categoryLabel: 'CRYPTO',
    difficulty: 'EASY',
    difficultyColor: '#a8e6cf',
    points: 250,
    title: 'Base64 Matrix Verification',
    shortTitle: 'Base64 Matrix Ver',
    subtitle: 'Exfiltrated stream decryption',
    lore: 'An intercepted network packet contains an encoded clearance token. De-obfuscate the Radix-64 stream to extract the master security key.',
    payloadType: 'BASE64 CIPHER STREAM',
    payload: 'Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=',
    hint: 'RFC 4648 Radix-64 encoding used in MIME and data URLs. Decode in terminal with: echo -n "Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=" | base64 -d',
    targetFlag: 'CTF{L4B1B_Z3R0_TRU5T_2026}',
    tabIcon: 'ph-bold ph-key',
  },
  {
    id: 'jwt-forgery',
    category: 'web',
    categoryLabel: 'WEB SEC',
    difficulty: 'MEDIUM',
    difficultyColor: '#fdd663',
    points: 350,
    title: 'JWT Algorithm "None" Audit',
    shortTitle: 'JWT Algo Audit',
    subtitle: 'Token header & payload analysis',
    lore: 'A zero-trust microservice accepted an unsigned JSON Web Token with alg=none. Decode the claims payload segment to find the forged flag.',
    payloadType: 'UNSIGNED JWT TOKEN',
    payload: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzZWNvcHNfc3VwZXIiLCJmbGFnIjoiQ1RGe05PTTNfQUxHM19CWVA0NTNfMjAyNn0ifQ.',
    hint: 'JWTs consist of Header.Payload.Signature. The middle segment is a base64url encoded JSON object containing the flag key.',
    targetFlag: 'CTF{NOM3_ALG3_BYP453_2026}',
    tabIcon: 'ph-bold ph-globe',
  },
  {
    id: 'memory-dump',
    category: 'dfir',
    categoryLabel: 'DFIR',
    difficulty: 'HARD',
    difficultyColor: '#ffb4ab',
    points: 500,
    title: 'Volatility Memory Hex Artifact',
    shortTitle: 'VM Hex Artifact',
    subtitle: 'RAM forensic raw byte extraction',
    lore: 'Forensic extraction of an in-memory injected shellcode buffer reveals raw ASCII hexadecimal bytes. Reassemble the character sequence.',
    payloadType: 'RAW MEMORY HEX STREAM',
    payload: '43 54 46 7b 44 46 31 52 5f 4d 33 4d 30 52 59 5f 44 55 4d 50 5f 32 30 32 36 7d',
    hint: 'Each two-digit hex pair represents an ASCII character code: 0x43="C", 0x54="T", 0x46="F", 0x7b="{", 0x44="D"...',
    targetFlag: 'CTF{DF1R_M3M0RY_DUMP_2026}',
    tabIcon: 'ph-bold ph-cpu',
  },
  {
    id: 'xor-stream',
    category: 'reverse',
    categoryLabel: 'REVERSING',
    difficulty: 'MEDIUM',
    difficultyColor: '#d0bcff',
    points: 400,
    title: 'Single-Byte XOR Keystream',
    shortTitle: '1B XOR KS',
    subtitle: 'Static binary signature analysis',
    lore: 'An embedded malware string was obfuscated with key 0x42 ("B"). Bitwise XOR each byte with 0x42 to decrypt the flag.',
    payloadType: 'XOR-OBFUSCATED BYTE ARRAY (KEY: 0x42)',
    payload: '[0x01, 0x16, 0x04, 0x39, 0x1a, 0x72, 0x10, 0x1d, 0x09, 0x71, 0x1b, 0x1d, 0x70, 0x72, 0x70, 0x74, 0x3f]',
    hint: 'Compute byte ^ 0x42 for each item: 0x01 ^ 0x42 = 0x43 ("C"), 0x16 ^ 0x42 = 0x54 ("T"), 0x04 ^ 0x42 = 0x46 ("F")...',
    targetFlag: 'CTF{X0R_K3Y_2026}',
    tabIcon: 'ph-bold ph-binary',
  },
];

export const CtfModal: React.FC<CtfModalProps> = ({ isOpen, onClose }) => {
  const [activeId, setActiveId] = useState<string>('b64-matrix');
  const [flagInput, setFlagInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ctf_solved_challenges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeChallenge = CTF_CHALLENGES.find((c) => c.id === activeId) || CTF_CHALLENGES[0];
  const isCurrentSolved = solvedChallenges.includes(activeChallenge.id);

  const totalScore = solvedChallenges.reduce((acc, id) => {
    const ch = CTF_CHALLENGES.find((c) => c.id === id);
    return acc + (ch ? ch.points : 0);
  }, 0);

  const maxScore = CTF_CHALLENGES.reduce((acc, c) => acc + c.points, 0);
  const solvedCount = solvedChallenges.length;

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleVerifyFlag = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const clean = flagInput.trim();

    if (
      clean === activeChallenge.targetFlag ||
      clean.toUpperCase() === activeChallenge.targetFlag.toUpperCase()
    ) {
      if (!solvedChallenges.includes(activeChallenge.id)) {
        const nextSolved = [...solvedChallenges, activeChallenge.id];
        setSolvedChallenges(nextSolved);
        try {
          localStorage.setItem('ctf_solved_challenges', JSON.stringify(nextSolved));
        } catch {
          // ignore
        }
      }
      setErrorMsg('');
      soundEngine.play('access_granted');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#2dd4bf', '#06b6d4', '#f59e0b', '#a855f7'],
        });
      } catch {
        // Fallback
      }
    } else {
      soundEngine.play('error');
      setErrorMsg(`[-] INVALID FLAG KEY. Check ${activeChallenge.categoryLabel} decoding parameters.`);
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(activeChallenge.payload);
    soundEngine.play('click');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextChallenge = () => {
    const currentIndex = CTF_CHALLENGES.findIndex((c) => c.id === activeChallenge.id);
    const nextIndex = (currentIndex + 1) % CTF_CHALLENGES.length;
    setActiveId(CTF_CHALLENGES[nextIndex].id);
    setFlagInput('');
    setErrorMsg('');
    setShowHint(false);
    soundEngine.play('click');
  };

  const handleResetProgress = () => {
    soundEngine.play('terminal_key');
    setSolvedChallenges([]);
    try {
      localStorage.removeItem('ctf_solved_challenges');
    } catch {
      // ignore
    }
    setFlagInput('');
    setErrorMsg('');
  };

  const currentIndex = CTF_CHALLENGES.findIndex((c) => c.id === activeChallenge.id);
  const hasNextChallenge = currentIndex < CTF_CHALLENGES.length - 1;

 return (
 <section className="w-full flex-1 flex flex-col bg-[#000000] min-h-full text-white font-mono animate-fadeIn pb-[calc(94px+env(safe-area-inset-bottom,0px))]">
 {/* CTF Section Header Bar */}
 <div className="bg-[#21232b] px-0 h-[45px] flex items-center justify-between select-none shrink-0" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
 <div className="flex items-center space-x-3">
 <span className="text-[13px] leading-[16px] font-mono font-semibold text-white flex items-center space-x-2" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <button className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-lg flex items-center justify-center font-bold transition-colors shrink-0 bg-[#fdd663] text-[#3b2f00] cursor-default site-card-icon-35" style={{ width: "35px", height: "35px" }}>
  <i className="ph-bold ph-flag site-icon-35" style={{ width: "35px", height: "35px", fontSize: "35px", lineHeight: "35px" }}></i>
 </button>
 <span className="text-[16px]" style={{ fontSize: "16px" }}>DECIPHER CHALLENGE ENGINE</span>
 <span className="hidden text-[13px] leading-[16px] text-[#ffb870] bg-[#4a2800]/40 px-2.5 py-0.5 rounded-full border border-[#ffb870]/30 font-medium ml-2">
 LEVEL: 01_CRYPTO
 </span>
 </span>
 </div>

 <div className="flex items-center space-x-2" style={{ paddingRight: "8px", paddingLeft: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <button
 onClick={() => {
 soundEngine.play('click');
 onClose();
 }}
 className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 bg-[#ffb4ab] text-[#690005] shadow-md shrink-0 site-icon-btn-35"
 style={{ width: "35px", height: "35px" }}
 title="Exit CTF section [ESC]"
 >
 <i className="ph-bold ph-x-circle font-bold site-icon-35" style={{ width: "35px", height: "35px", fontSize: "35px", lineHeight: "35px" }}></i>
 </button>
 </div>
 </div>

 {/* Main CTF Body */}
    <div className="flex-1 w-full max-w-4xl mx-auto px-2 pt-2 pb-2 flex flex-col justify-start" style={{ paddingLeft: "8px", paddingRight: "8px", paddingBottom: "8px", paddingTop: "8px" }}>
 <div className="flex flex-col items-start justify-between mb-[15px] shrink-0">
 <div>
 <div className="flex items-center gap-2 text-[12px] leading-[16px] font-mono text-[#a8c7fa] tracking-wider uppercase" style={{ fontSize: "12px" }}>
 <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)] animate-pulse"></span>
 Capture The Flag
 </div>

          </div>
        </div>

        {/* PRIMARY CTF NAVIGATION TABS - SLIDER CAPSULE IDENTICAL TO INTEL BRIEF */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] mb-[15px] max-w-2xl w-full shrink-0" style={{ marginBottom: "15px" }}>
          {CTF_CHALLENGES.map((challenge, idx) => {
            const isActive = activeChallenge.id === challenge.id;
            const isSolved = solvedChallenges.includes(challenge.id);
            return (
              <button
                key={challenge.id}
                onClick={() => {
                  setActiveId(challenge.id);
                  setFlagInput('');
                  setErrorMsg('');
                  setShowHint(false);
                  soundEngine.play('click');
                }}
                title={`0${idx + 1} ${challenge.categoryLabel}: ${challenge.title} (${challenge.points} PTS)`}
                aria-label={`0${idx + 1} ${challenge.categoryLabel}: ${challenge.title}`}
                className={`flex-1 h-[37px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center relative ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
              >
                <i className={`${challenge.tabIcon} text-base ${isActive ? 'text-[#00325b]' : 'text-[#c4c6d0]'}`}></i>
                {isSolved && (
                  <span
                    className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ${
                      isActive ? 'bg-[#00522b] ring-1 ring-white' : 'bg-[#a8e6cf] shadow-[0_0_6px_rgba(168,230,207,0.8)]'
                    }`}
                    title="Captured"
                  ></span>
                )}
              </button>
            );
          })}
        </div>

        {/* STATUS HUD CAPSULE BAR DYNAMIC FOR CTF - MATCHING INTEL BRIEF */}
        <div
          className="bg-[#21232b] rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-[14px] leading-[16px] text-white font-mono border-0 mb-[15px] shrink-0"
          style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "14px", lineHeight: "16px", marginBottom: "15px" }}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="truncate text-white font-semibold text-[14px] leading-[16px]" style={{ fontSize: "14px", lineHeight: "16px" }}>
              {activeChallenge.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white font-semibold font-mono text-[14px] leading-[16px]" style={{ fontSize: "14px", lineHeight: "16px" }}>
              SCORE: {totalScore}/{maxScore} ({solvedCount}/4)
            </span>
          </div>
        </div>

        {/* Compact Challenge Arena Card - No Scroll Needed */}
        <div className="bg-[#21232b] p-3 rounded-2xl border-0 space-y-2.5 font-mono text-[13px] shrink-0">
          {/* Scenario Lore */}
          <div className="bg-[#000000] px-2 py-2 rounded-xl text-xs text-[#c4c6d0] font-sans leading-relaxed border border-[#44474f]/25" style={{ paddingLeft: "8px", paddingRight: "8px", backgroundColor: "#000000" }}>
            <div className="text-[10px] font-mono text-[#a8c7fa] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <i className="ph-bold ph-terminal-window"></i>
              SCENARIO INTEL:
            </div>
            <p className="text-[12px]">{activeChallenge.lore}</p>
          </div>

          {/* Payload Row with Copy & Tactical Hint */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-[#fdd663] uppercase tracking-wider flex items-center gap-1.5">
                <i className="ph-bold ph-key flex items-center justify-center" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>
                {activeChallenge.payloadType}:
              </span>
              <i
                onClick={handleCopyPayload}
                className={`${copied ? 'ph-bold ph-clipboard-text text-[#a8e6cf]' : 'ph-bold ph-copy text-[#a8c7fa]'} flex items-center justify-center cursor-pointer shrink-0 transition-colors hover:text-white`}
                style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}
                title="Copy payload"
                aria-label="Copy payload"
              ></i>
            </div>

            {/* Payload Cipher Stream */}
            <div
              className="h-[35px] bg-[#000000] px-3 rounded-xl border border-[#44474f]/30 text-[#fdd663] text-xs font-mono select-all flex items-center justify-between overflow-x-auto shadow-inner"
              style={{ height: "35px" }}
            >
              <code className="whitespace-nowrap">{activeChallenge.payload}</code>
            </div>

            {/* Tactical Hint (Shown by default) */}
            <div
              className="bg-[#292415] border-0 p-2 rounded-xl text-[11px] text-[#ffe082] font-mono leading-tight"
              style={{ borderWidth: "0px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
            >
              <strong className="text-[#fdd663]">HINT: </strong>{activeChallenge.hint}
            </div>
          </div>

          {/* Flag Submission or Victory Banner */}
          {isCurrentSolved ? (
            <div className="bg-[#00522b]/25 border border-[#a8e6cf]/40 px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 flex-wrap animate-fadeIn">
              <div className="flex items-center gap-2">
                <i className="ph-bold ph-check-circle text-[#a8e6cf] text-lg"></i>
                <span className="text-xs font-bold text-[#a8e6cf]">FLAG CAPTURED:</span>
                <code className="bg-[#000000] px-2 py-0.5 rounded text-white text-xs font-bold select-all border border-[#a8e6cf]/30">
                  {activeChallenge.targetFlag}
                </code>
              </div>
              <div className="flex items-center gap-2">
                {hasNextChallenge ? (
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="m3-btn-primary px-3 py-1 text-xs font-mono cursor-pointer flex items-center gap-1"
                  >
                    <span>NEXT TARGET</span>
                    <i className="ph-bold ph-arrow-right text-xs"></i>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[#fdd663] uppercase">
                    ALL 4 FLAGS CAPTURED!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.play('click');
                    onClose();
                  }}
                  className="px-3 py-1 text-xs font-mono bg-[#2d3039] hover:bg-[#383c48] text-white rounded-lg border border-[#44474f]/40 cursor-pointer"
                >
                  RETURN
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyFlag} className="space-y-1.5 font-mono text-[13px]">
              <div
                className="w-full h-[35px] bg-[#000000] rounded-xl flex items-center pl-3 pr-1 border-0 relative"
                style={{ height: "35px", borderWidth: "0px" }}
              >
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => {
                    setFlagInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onFocus={() => {
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={errorMsg ? "" : "Submit flag: CTF{...}"}
                  className={`flex-1 h-full bg-transparent border-0 font-mono text-xs focus:outline-none transition-colors ${
                    errorMsg ? 'text-transparent' : 'text-white'
                  }`}
                  style={{ borderWidth: "0px" }}
                />

                {errorMsg && (
                  <div className="absolute inset-y-0 left-3 right-10 text-[#ffb4ab] font-mono text-xs flex items-center pointer-events-none truncate">
                    <span className="truncate">{errorMsg}</span>
                  </div>
                )}

                <i
                  onClick={handleVerifyFlag}
                  className="ph-bold ph-paper-plane-right text-[#a8c7fa] hover:text-white active:scale-90 transition-all cursor-pointer shrink-0 flex items-center justify-center"
                  style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}
                  title="Submit flag"
                  aria-label="Submit flag"
                ></i>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

