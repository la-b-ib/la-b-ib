import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface CtfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CtfModal: React.FC<CtfModalProps> = ({ isOpen, onClose }) => {
  const [flagInput, setFlagInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

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

  const targetFlag = 'CTF{L4B1B_Z3R0_TRU5T_2026}';

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = flagInput.trim();

    if (clean === targetFlag || clean.toUpperCase() === 'CTF{L4B1B_Z3R0_TRU5T_2026}') {
      setSolved(true);
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
      setErrorMsg('[-] INVALID FLAG KEY. RE-PARSE BASE64 CRYPTO MATRIX HINT.');
    }
  };

  return (
    <section className="w-full flex-1 flex flex-col bg-[#000000] min-h-full text-white font-mono animate-fadeIn pb-[calc(94px+env(safe-area-inset-bottom,0px))] sm:pb-0">
      {/* CTF Section Header Bar */}
      <div className="bg-[#21232b] px-4 h-[45px] flex items-center justify-between select-none">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-semibold text-white flex items-center space-x-2">
            <button className="w-[32px] h-[32px] rounded-lg flex items-center justify-center text-base font-bold transition-colors shrink-0 bg-[#fdd663] text-[#3b2f00] cursor-default">
              <i className="ri-flag-line"></i>
            </button>
            <span className="text-[16px]">DECIPHER CHALLENGE ENGINE</span>
            <span className="hidden sm:inline-block text-[10px] text-[#ffb870] bg-[#4a2800]/40 px-2.5 py-0.5 rounded-full border border-[#ffb870]/30 font-medium ml-2">
              LEVEL: 01_CRYPTO
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              soundEngine.play('click');
              onClose();
            }}
            className="w-[32px] h-[32px] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 bg-[#ffb4ab] text-[#690005] shadow-md hover:opacity-90 shrink-0"
            title="Exit CTF section [ESC]"
          >
            <i className="ri-close-circle-line text-base font-bold leading-none"></i>
          </button>
        </div>
      </div>

      {/* Main CTF Body */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-[15px] pb-8 flex flex-col justify-start">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-[15px]">
          <div>
            <div className="flex items-center gap-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)] animate-pulse"></span>
              Capture The Flag
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-[20px]">
              Base64 Matrix Verification
            </h2>
          </div>

          <div className="text-right">
            {solved && (
              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full border inline-block bg-[#00522b]/30 text-[#a8e6cf] border-[#a8e6cf]/30">
                CAPTURED
              </span>
            )}
          </div>
        </div>

        {/* Challenge Box */}
        <div className="bg-[#21232b] p-[15px] h-[170px] rounded-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between text-[#c4c6d0] font-semibold">
            <span>CHALLENGE HINT & BASE64 CIPHER PAYLOAD:</span>
          </div>
          <div className="h-[45px] bg-[#000000] px-[15px] mb-[15px] rounded-xl border border-[#44474f]/30 text-[#fdd663] text-xs sm:text-sm font-mono select-all flex items-center justify-between gap-2 overflow-hidden">
            <span className="truncate whitespace-nowrap">Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=');
                soundEngine.play('click');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              title="Copy cipher payload"
            >
              <i className={`${copied ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'} text-sm leading-none`}></i>
            </button>
          </div>
          {solved ? (
            <div className="bg-[#00522b]/20 border border-[#a8e6cf]/40 p-6 sm:p-8 rounded-2xl text-center space-y-4 shadow-md animate-fadeIn mt-4">
              <div className="text-[#a8e6cf] font-bold text-xl sm:text-2xl flex items-center justify-center">
                <i className="ri-trophy-line text-[#ffb870] mr-2.5 text-2xl sm:text-3xl"></i>
                <span>FLAG CAPTURED & VERIFIED!</span>
              </div>
              <div className="text-sm font-mono text-white bg-[#000000] py-2.5 px-5 rounded-xl border border-[#a8e6cf]/30 inline-block font-extrabold select-all">
                CTF{'{L4B1B_Z3R0_TRU5T_2026}'}
              </div>
              <div className="text-xs text-[#a8e6cf] font-mono font-semibold">
                +500 SEC_OPS EXP POINTS AWARDED TO YOUR CLEARANCE RECORD
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundEngine.play('click');
                    onClose();
                  }}
                  className="m3-btn-primary px-6 py-2.5 text-xs cursor-pointer"
                >
                  RETURN TO SYSTEM
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyFlag} className="space-y-4 font-mono text-xs pt-0">
              <div className="relative">
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
                  placeholder={errorMsg ? "" : "CTF{...}"}
                  className={`w-full h-[45px] bg-[#000000] rounded-xl px-[15px] pr-12 ${errorMsg ? 'text-transparent' : 'text-white'} font-mono text-[12px] focus:outline-none transition-colors`}
                />
                
                {errorMsg && (
                  <div className="absolute inset-y-0 left-0 right-10 text-[#ffb4ab] font-mono font-medium flex items-center px-[15px] pointer-events-none overflow-hidden">
                    <span className="text-[12px] leading-[12px] whitespace-normal break-words line-clamp-2">{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  title="Submit & Decrypt Flag"
                >
                  <i className="ri-play-circle-line text-base leading-none text-[#a8c7fa]"></i>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

