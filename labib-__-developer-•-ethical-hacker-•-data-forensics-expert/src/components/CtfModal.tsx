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
    <section className="w-full flex-1 flex flex-col bg-[#0f0e13] min-h-[calc(100dvh-92px)] border-t border-white/10 text-white font-mono animate-fadeIn">
      {/* CTF Section Header Bar */}
      <div className="bg-[#1a1b21] px-4 py-3 border-b border-[#44474f]/30 flex items-center justify-between select-none">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-semibold text-white flex items-center space-x-2">
            <i className="ri-flag-2-line text-[#ffb870] text-sm"></i>
            <span>DECIPHER CHALLENGE ENGINE</span>
            <span className="hidden sm:inline-block text-[10px] text-[#ffb870] bg-[#4a2800]/40 px-2.5 py-0.5 rounded-full border border-[#ffb870]/30 font-medium">
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
            className="bg-[#21232b] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white w-8 h-8 rounded-full border border-[#44474f]/50 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            title="Exit CTF section [ESC]"
          >
            <i className="ri-close-line text-sm leading-none"></i>
          </button>
        </div>
      </div>

      {/* Main CTF Body */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 flex flex-col justify-start space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/30 pb-4">
          <div>
            <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase mb-1">Capture The Flag</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Base64 Matrix Flag Verification
            </h2>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border inline-block ${solved ? 'bg-[#00522b]/30 text-[#a8e6cf] border-[#a8e6cf]/30' : 'bg-[#4a2800]/30 text-[#ffb870] border-[#ffb870]/30'}`}>
              {solved ? 'CAPTURED' : 'IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Challenge Box */}
        <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#44474f]/40 space-y-4 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between text-[#c4c6d0] font-semibold">
            <span>CHALLENGE HINT & BASE64 CIPHER PAYLOAD:</span>
            <span className="text-[10px] text-[#a8e6cf]">ENCODING: UTF-8 BASE64</span>
          </div>
          <div className="bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/30 text-[#a8e6cf] text-xs sm:text-sm break-all font-mono select-all flex items-center justify-between">
            <span>Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=');
                soundEngine.play('click');
              }}
              className="ml-2 p-2 text-[#c4c6d0] hover:text-white bg-[#21232b] hover:bg-[#2b2d36] rounded-lg border border-[#44474f]/40 shrink-0 cursor-pointer transition-colors"
              title="Copy cipher payload"
            >
              <i className="ri-file-copy-2-line text-sm leading-none"></i>
            </button>
          </div>
          <p className="text-[#8e9199] text-xs leading-relaxed font-sans">
            Decipher the Base64 string payload above and enter the resulting CTF flag in the input format <code className="text-[#ffb870] font-bold font-mono">CTF{'{...}'}</code>.
          </p>
        </div>

        {solved ? (
          <div className="bg-[#00522b]/20 border border-[#a8e6cf]/40 p-6 sm:p-8 rounded-2xl text-center space-y-4 shadow-md animate-fadeIn">
            <div className="text-[#a8e6cf] font-bold text-xl sm:text-2xl flex items-center justify-center">
              <i className="ri-trophy-line text-[#ffb870] mr-2.5 text-2xl sm:text-3xl"></i>
              <span>FLAG CAPTURED & VERIFIED!</span>
            </div>
            <div className="text-sm font-mono text-white bg-[#0f0e13] py-2.5 px-5 rounded-xl border border-[#a8e6cf]/30 inline-block font-extrabold select-all">
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
          <form onSubmit={handleVerifyFlag} className="space-y-4 font-mono text-xs">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#c4c6d0]">ENTER DECRYPTED FLAG KEY:</label>
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="CTF{...}"
                className="w-full bg-[#0f0e13] border border-[#44474f]/50 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#a8c7fa] transition-colors"
              />
            </div>

            {errorMsg && (
              <div className="bg-[#60000e]/30 border border-[#ffb4ab]/30 p-3.5 rounded-xl text-[#ffb4ab] text-xs font-mono font-medium flex items-center space-x-2">
                <i className="ri-error-warning-line text-base"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="m3-btn-primary w-full justify-center text-xs sm:text-sm tracking-wider py-3.5 cursor-pointer"
            >
              SUBMIT & DECRYPT FLAG
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

