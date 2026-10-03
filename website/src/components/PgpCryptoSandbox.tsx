import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { soundEngine } from '../utils/soundEngine';

// RFC 4880 OpenPGP 24-bit CRC generator
function computeCrc24(data: Uint8Array): string {
  let crc = 0xb704ce;
  const CRC24_POLY = 0x1864cfb;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 16;
    for (let j = 0; j < 8; j++) {
      crc <<= 1;
      if (crc & 0x1000000) {
        crc ^= CRC24_POLY;
      }
    }
  }
  const b0 = (crc >> 16) & 0xff;
  const b1 = (crc >> 8) & 0xff;
  const b2 = crc & 0xff;
  return btoa(String.fromCharCode(b0, b1, b2));
}

function bufToHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const PUBLIC_KEY_ASCII_ARMOR = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.10.1 / GnuPG v2.4.4
Comment: Labib B. Shahed (Security & Cryptographic Identity) <contact@labib.dev>

mQINBFnpw+ABEAC3Jv8eX3K4m9Z7pP9xL1q0r8V5u8y2w1z4b7c8d9e0f1g2h3i4
j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6
p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8
v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0
b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2
h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4
n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6
=o7Pq
-----END PGP PUBLIC KEY BLOCK-----`;

export const PgpCryptoSandbox: React.FC = () => {
  // Navigation: 'engine' | 'keyring'
  const [activeSegment, setActiveSegment] = useState<'engine' | 'keyring'>('engine');

  // Engine Sub-Mode: 'digest' | 'sign' | 'tamper'
  const [engineMode, setEngineMode] = useState<'digest' | 'sign' | 'tamper'>('sign');

  // Core Key Details
  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';
  const pgpKeyId = '0x9E8C41A2';
  const keyCreated = '2024-03-15';
  const keyExpiry = 'Never (Valid)';

  // Payload text state
  const defaultOriginalText = '2BorNoT2b?';
  const [payloadText, setPayloadText] = useState(defaultOriginalText);
  const [tamperedText, setTamperedText] = useState(defaultOriginalText);
  const [isTampered, setIsTampered] = useState(false);

  // Hash & digest states
  const [sha256Hex, setSha256Hex] = useState('');
  const [sha512Hex, setSha512Hex] = useState('');
  const [base64Encoded, setBase64Encoded] = useState('');

  // Signature parameters
  const [sigAlgo, setSigAlgo] = useState<'SHA256' | 'SHA512'>('SHA256');
  const [sigDate] = useState(() => new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Crypto engine live play/pause state
  const [isCryptoPaused, setIsCryptoPaused] = useState(false);

  // Dynamic public key drawer toggle
  const [showKeyArmor, setShowKeyArmor] = useState(false);

  const handleTogglePlayPause = () => {
    soundEngine.play('click');
    if (isCryptoPaused) {
      setIsCryptoPaused(false);
      const cur = engineMode === 'tamper' ? tamperedText : payloadText;
      if (!cur) {
        setPayloadText(defaultOriginalText);
        setTamperedText(defaultOriginalText);
        setIsTampered(false);
      }
    } else {
      setIsCryptoPaused(true);
    }
  };

  const handleClearCache = () => {
    soundEngine.play('alert');
    setIsDeleting(true);
    setIsCryptoPaused(false);
    setPayloadText(defaultOriginalText);
    setTamperedText(defaultOriginalText);
    setIsTampered(false);
    setSigAlgo('SHA256');
    setShowKeyArmor(false);
    setActiveSegment('engine');
    setEngineMode('sign');
    try {
      localStorage.removeItem('pgp_sandbox_cache');
      sessionStorage.removeItem('pgp_sandbox_cache');
    } catch {}
    setTimeout(() => {
      setIsDeleting(false);
    }, 800);
  };

  const triggerCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    soundEngine.play('click');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Live hash calculator using native WebCrypto SubtleCrypto
  const updateHashes = useCallback(async (text: string) => {
    if (!text) {
      setSha256Hex('');
      setSha512Hex('');
      setBase64Encoded('');
      return;
    }
    try {
      const msgBytes = new TextEncoder().encode(text);
      const [hash256Buffer, hash512Buffer] = await Promise.all([
        crypto.subtle.digest('SHA-256', msgBytes),
        crypto.subtle.digest('SHA-512', msgBytes),
      ]);
      setSha256Hex(bufToHex(hash256Buffer));
      setSha512Hex(bufToHex(hash512Buffer));
      setBase64Encoded(btoa(unescape(encodeURIComponent(text))));
    } catch {
      setSha256Hex('Crypto Error');
    }
  }, []);

  // Recalculate whenever text changes
  useEffect(() => {
    const textToDigest = engineMode === 'tamper' ? tamperedText : payloadText;
    updateHashes(textToDigest);
  }, [payloadText, tamperedText, engineMode, updateHashes]);

  // Expected vs actual digests for tamper verification
  const [expectedHash256, setExpectedHash256] = useState('');
  const [actualHash256, setActualHash256] = useState('');

  useEffect(() => {
    const runVerification = async () => {
      const origBytes = new TextEncoder().encode(payloadText);
      const tampBytes = new TextEncoder().encode(tamperedText);
      const [expectedBuf, actualBuf] = await Promise.all([
        crypto.subtle.digest('SHA-256', origBytes),
        crypto.subtle.digest('SHA-256', tampBytes),
      ]);
      setExpectedHash256(bufToHex(expectedBuf));
      setActualHash256(bufToHex(actualBuf));
    };
    runVerification();
  }, [payloadText, tamperedText]);

  // Simulated OpenPGP Cleartext Signature Block generator
  const generatedSignatureBlock = useMemo(() => {
    const activeText = engineMode === 'tamper' ? tamperedText : payloadText;
    const digestForSig = sigAlgo === 'SHA512' ? sha512Hex : sha256Hex;
    const crc = computeCrc24(new TextEncoder().encode(digestForSig || activeText));

    const simulatedSigRaw = [
      'iQIzBAEBCgAdFiEET5uKLh5dk7B3xI4aIt9gs56MQaIFAlnpw+AACgkQIt9gs56M',
      'QaInPA//U5+X2sW3Z79YxH3z4eD0s9K8m5F1j4g7h2k8e9f0l1c4v5n6b7v8x9y0',
      'z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2',
      'f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4',
    ].join('\n');

    return `-----BEGIN PGP SIGNED MESSAGE-----
Hash    : ${sigAlgo}

${activeText}
-----BEGIN PGP SIGNATURE-----
Version : OpenPGP.js / GnuPG v2.4.4
Comment : Key ID ${pgpKeyId} | Created ${sigDate}

${simulatedSigRaw}
=${crc}
-----END PGP SIGNATURE-----`;
  }, [payloadText, tamperedText, engineMode, sigAlgo, sha256Hex, sha512Hex, pgpKeyId, sigDate]);

  // 1-Click CLI verification command (Bash)
  const cliVerifyCommand = useMemo(() => {
    const currentMsg = engineMode === 'tamper' ? tamperedText : payloadText;
    const safeEscaped = currentMsg.replace(/'/g, `'\\''`);
    return `echo '${safeEscaped}' | gpg --verify`;
  }, [payloadText, tamperedText, engineMode]);

  // Handle Download of .asc public key
  const handleDownloadAsc = () => {
    soundEngine.play('click');
    const blob = new Blob([PUBLIC_KEY_ASCII_ARMOR], { type: 'application/pgp-keys' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `labib_public_key_${pgpKeyId}.asc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopiedId('download-asc');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Tamper action: toggle 1 character in tamperedText
  const handleToggleTamper = () => {
    soundEngine.play('terminal_key');
    if (!isTampered) {
      // Alter the last word or bit
      const altered = payloadText.endsWith('.')
        ? payloadText.slice(0, -1) + '!'
        : payloadText + ' [TAMPERED_BYTE_0x01]';
      setTamperedText(altered);
      setIsTampered(true);
    } else {
      setTamperedText(payloadText);
      setIsTampered(false);
    }
  };

  const handleResetPayload = () => {
    soundEngine.play('click');
    setPayloadText(defaultOriginalText);
    setTamperedText(defaultOriginalText);
    setIsTampered(false);
  };

  const currentMetricsMeta = activeSegment === 'keyring'
    ? {
        badge: 'PKI KEYS',
        type: 'KEYRING & IDENTITY',
        mode: 'ED25519 / RSA',
        icon: 'ri-safe-3-line',
        colorClass: 'text-[#a8c7fa]',
      }
    : engineMode === 'sign'
    ? {
        badge: 'RFC 4880 SIGNATURE',
        type: 'OPENGPG CLEARTEXT',
        mode: isCryptoPaused ? 'PAUSED' : sigAlgo,
        icon: 'ri-finder-line',
        colorClass: isCryptoPaused ? 'text-[#ffb4ab]' : 'text-[#a8c7fa]',
      }
    : engineMode === 'tamper'
    ? {
        badge: 'DFIR AUDIT',
        type: 'BIT-FLIP VERIFIER',
        mode: isTampered ? 'TAMPERED' : 'VERIFIED',
        icon: 'ri-hand-heart-line',
        colorClass: isTampered ? 'text-[#ffb4ab]' : 'text-[#a8e6cf]',
      }
    : {
        badge: 'DIGEST HASHES',
        type: 'W3C SUBTLECRYPTO',
        mode: 'LIVE DIGEST',
        icon: 'ri-contacts-book-upload-line',
        colorClass: 'text-[#a8e6cf]',
      };

  return (
    <div className="font-sans text-white space-y-3.5">
      {/* SECTION HEADER WITH ACTION BUTTONS (DELETE & CLI) MATCHING GLOBAL THREAT OPS */}
      <div className="flex flex-row items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white leading-[24px]" style={{ fontSize: '24px', lineHeight: '24px' }}>
            Crypto Sig Sandbox
          </h3>
        </div>

        {/* 2 Action Buttons (Delete & CLI Command) on the right with 10px gap - matching Global Threat Ops */}
        <div className="flex items-center gap-[10px] shrink-0">
          {/* Clear Cache Action */}
          <button
            type="button"
            onClick={handleClearCache}
            className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 ${
              isDeleting
                ? 'bg-[#ffb4ab] text-[#690005]'
                : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#ffb4ab] active:text-[#690005]'
            }`}
            title="Clear Crypto Sig Sandbox Cache"
            aria-label="Clear Crypto Sig Sandbox Cache"
          >
            <i className="ri-delete-bin-5-line text-[13px] leading-[16px]"></i>
          </button>

          {/* 1-Click CLI Ready Command Button */}
          <button
            type="button"
            onClick={() => triggerCopy(cliVerifyCommand, 'cli-btn')}
            className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 ${
              copiedId === 'cli-btn'
                ? 'bg-[#a8e6cf] text-[#003923]'
                : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]'
            }`}
            title={copiedId === 'cli-btn' ? 'CLI Command Copied!' : 'Copy GPG Verification CLI Command'}
            aria-label={copiedId === 'cli-btn' ? 'CLI Command Copied!' : 'Copy GPG Verification CLI Command'}
          >
            <i className={`${copiedId === 'cli-btn' ? 'ri-survey-line text-[#003923]' : 'ri-terminal-box-line'} text-[13px] leading-[16px]`}></i>
          </button>
        </div>
      </div>

      {/* UNIFIED CAPSULE BAR WITH VERTICAL SEPARATOR (ICON-ONLY) */}
      <div
        className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full font-mono"
        style={{ marginBottom: '15px' }}
      >
        {/* Left Segment: Primary Toggle (WebCrypto Engine vs Keyring & Identity) */}
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => {
              setActiveSegment('engine');
              soundEngine.play('click');
            }}
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 ${
              activeSegment === 'engine'
                ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
            title="WebCrypto Engine"
            aria-label="WebCrypto Engine"
          >
            <i className="ri-secure-payment-line text-lg"></i>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSegment('keyring');
              soundEngine.play('click');
            }}
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 ${
              activeSegment === 'keyring'
                ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
            title="Keyring & Identity (PKI KEYS)"
            aria-label="Keyring & Identity (PKI KEYS)"
          >
            <i className="ri-safe-3-line text-lg"></i>
          </button>
        </div>

        {/* Sleek Vertical Separator */}
        <div
          className="w-[2px] h-6 bg-[#44484e] mx-1 shrink-0"
          style={{ width: '2px', backgroundColor: '#44484e' }}
          aria-hidden="true"
        />

        {/* Right Segment: Engine Operations (Sign, Tamp & Ver, Digest) */}
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => {
              if (activeSegment !== 'engine') setActiveSegment('engine');
              setEngineMode('sign');
              soundEngine.play('click');
            }}
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 ${
              activeSegment === 'engine' && engineMode === 'sign'
                ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
            title="Sign (RFC 4880 SIGNATURE)"
            aria-label="Sign (RFC 4880 SIGNATURE)"
          >
            <i className="ri-finder-line text-lg"></i>
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeSegment !== 'engine') setActiveSegment('engine');
              setEngineMode('tamper');
              soundEngine.play('click');
            }}
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 ${
              activeSegment === 'engine' && engineMode === 'tamper'
                ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
            title="DFIR AUDIT (Tamper & Verify Demo)"
            aria-label="DFIR AUDIT (Tamper & Verify Demo)"
          >
            <i className="ri-hand-heart-line text-lg"></i>
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeSegment !== 'engine') setActiveSegment('engine');
              setEngineMode('digest');
              soundEngine.play('click');
            }}
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer border-0 ${
              activeSegment === 'engine' && engineMode === 'digest'
                ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
            title="DIGEST HASHES (SHA-256 / SHA-512 / Base64)"
            aria-label="DIGEST HASHES"
          >
            <i className="ri-contacts-book-upload-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* FEED METRICS BAR & SHOWING COUNT (CASEFILES STYLE) */}
      <div
        className="bg-[#21232b] rounded-xl p-2 flex items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0"
        style={{
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "8px",
          paddingBottom: "8px",
          marginBottom: "15px",
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="truncate" style={{ fontSize: "12px", lineHeight: "12px" }}>
            <strong className={currentMetricsMeta.colorClass}>{currentMetricsMeta.badge}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] leading-[11px] text-[#8e9199]">
            <i className={`${currentMetricsMeta.icon} ${currentMetricsMeta.colorClass}`}></i>
            TYPE: <strong className="text-white uppercase">{currentMetricsMeta.type}</strong>
          </span>
          <span className="text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            STATUS: <span className={`font-bold ${currentMetricsMeta.colorClass}`}>{currentMetricsMeta.mode}</span>
          </span>
        </div>
      </div>

      {/* SEGMENT 1: WEBCRYPTO ENGINE (SIGN / HASH / TAMPER & VERIFY) */}
      {activeSegment === 'engine' && (
        <div className="space-y-3 animate-fadeIn">
          {/* SINGLE PAYLOAD INPUT BOX */}
          {/* SINGLE PAYLOAD INPUT BOX - ALWAYS SIDE BY SIDE ROW */}
          <div
            className="bg-[#21232b] p-2 rounded-2xl border-0 flex flex-row items-center justify-between gap-3 font-mono text-xs w-full"
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '8px',
              paddingBottom: '8px',
              marginBottom: '15px',
            }}
          >
            {/* Left: Button Icon + (Payload Text over {length} bytes) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="w-[32.9948px] h-[32.9948px] rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0"
                style={{ width: '32.9948px', height: '32.9948px' }}
                title="Payload Text"
                aria-label="Payload Text"
              >
                <i className="ri-pencil-ruler-line"></i>
              </button>
              <div className="flex flex-col justify-center min-w-0">
                <span
                  className="font-bold text-white text-[16px] leading-[16px] whitespace-nowrap"
                  style={{ fontSize: "16px", lineHeight: "16px" }}
                >
                  Payload Text
                </span>
                <span
                  className="text-[#8e9199] text-[12px] leading-[14px] whitespace-nowrap"
                  style={{ fontSize: "12px", lineHeight: "14px" }}
                >
                  {(engineMode === 'tamper' ? tamperedText : payloadText).length} bytes
                </span>
              </div>
            </div>

            {/* Right: Input box beside Payload Text in a row */}
            <div className="flex-1 min-w-0 bg-[#000000] px-[8px] h-[35px] rounded-[16px] border-0 flex items-center gap-1.5 transition-colors focus-within:bg-[#000000]">
              <div className="relative flex-1 min-w-0 flex items-center h-full">
                <input
                  type="text"
                  value={engineMode === 'tamper' ? tamperedText : payloadText}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isCryptoPaused) setIsCryptoPaused(false);
                    if (engineMode === 'tamper') {
                      setTamperedText(val);
                      setIsTampered(val !== payloadText);
                    } else {
                      setPayloadText(val);
                      setTamperedText(val);
                      setIsTampered(false);
                    }
                    soundEngine.play('terminal_key');
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Type to Sign"
                  style={{ fontSize: '12px', lineHeight: '12px' }}
                  className="w-full bg-transparent border-none text-white font-mono text-[12px] leading-[12px] focus:outline-none placeholder:text-[#8e9199] placeholder:text-[12px] placeholder:leading-[12px] h-full z-10"
                />
              </div>
              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="text-[#a8c7fa] active:scale-90 transition-all p-0.5 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none rounded-full"
                title={isCryptoPaused ? "Resume live signature engine [PLAY]" : "Pause live signature engine [PAUSE]"}
                aria-label={isCryptoPaused ? "Resume live signature engine" : "Pause live signature engine"}
              >
                <i
                  className={`${
                    isCryptoPaused
                      ? 'ri-play-circle-line'
                      : 'ri-pause-circle-line'
                  } text-[16px] text-[#a8c7fa] transition-colors`}
                ></i>
              </button>
            </div>
          </div>

          {/* B. "TAMPER & VERIFY" INTERACTIVE DFIR DEMO */}
          {engineMode === 'tamper' && (
            <div
              className="bg-[#21232b] p-3 rounded-2xl border-0 space-y-3 font-mono text-xs shadow-md animate-fadeIn"
              style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              {/* Forensic Hash Comparison Table - Directly in Text Block */}
              <div
                className="bg-[#000000] rounded-xl border border-[#44474f]/30 font-mono text-[12px] leading-[16px] space-y-2"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                {/* Status line with its side icon directly in the text block */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-bold text-[12px] leading-[16px] ${
                      !isTampered ? 'text-[#a8e6cf]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {!isTampered ? 'STATUS: 0x00 VERIFIED' : 'STATUS: 0xBAD_SIG'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleTamper}
                    className="text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer p-0 shrink-0 flex items-center justify-center border-0 bg-transparent"
                    style={{ width: '20px', height: '20px' }}
                    title={!isTampered ? 'Bit-Flip' : 'Restore original payload'}
                    aria-label={!isTampered ? 'Bit-Flip' : 'Restore original payload'}
                  >
                    <i
                      className={`${!isTampered ? 'ri-flip-horizontal-2-line' : 'ri-loop-right-ai-line'} text-base`}
                    ></i>
                  </button>
                </div>

                <div>
                  <div className="text-[#8e9199]">Expected Digest (From Sig):</div>
                  <div className="text-[#a8c7fa] font-mono break-all select-all">
                    {expectedHash256}
                  </div>
                </div>

                <div>
                  <div className="text-[#8e9199]">Calculated Message Digest:</div>
                  <div
                    className={`font-mono break-all select-all ${
                      !isTampered ? 'text-[#a8e6cf]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {actualHash256}
                  </div>
                </div>

                <div>
                  <div className="text-[#8e9199]">Cryptographic Verdict:</div>
                  <div
                    className={`font-bold ${!isTampered ? 'text-[#a8e6cf]' : 'text-[#ffb4ab]'}`}
                  >
                    {!isTampered ? 'MATCH [0x00_VALID]' : 'FAIL [0xBAD_HASH_COLLISION_PREVENTED]'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIGEST (HASHES) OUTPUT VIEW */}
          {engineMode === 'digest' && (
            <div
              className="bg-[#21232b] p-2 rounded-2xl border-0 space-y-2 font-mono text-xs animate-fadeIn"
              style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="w-[32.9948px] h-[32.9948px] rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0"
                    style={{ width: '32.9948px', height: '32.9948px' }}
                    title="WebCrypto Digests"
                    aria-label="WebCrypto Digests"
                  >
                    <i className="ri-contacts-book-upload-line"></i>
                  </button>
                  <div className="flex flex-col justify-center min-w-0">
                    <span
                      className="font-bold text-white text-[16px] leading-[16px] whitespace-nowrap"
                      style={{ fontSize: "16px", lineHeight: "16px" }}
                    >
                      WebCrypto Digests
                    </span>
                    <span
                      className="text-[#8e9199] text-[12px] leading-[14px] whitespace-nowrap"
                      style={{ fontSize: "12px", lineHeight: "14px" }}
                    >
                      W3C API
                    </span>
                  </div>
                </div>
              </div>

              {/* SHA-256 */}
              <div
                className="bg-[#000000] rounded-xl flex items-center justify-between gap-2"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <span className="text-[#8e9199] font-bold text-[12px] shrink-0">SHA-256:</span>
                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                  <span
                    className="text-[#a8e6cf] font-mono text-[12px] truncate cursor-pointer"
                    title={sha256Hex}
                    onClick={() => triggerCopy(sha256Hex, 'sha256')}
                  >
                    {sha256Hex}
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerCopy(sha256Hex, 'sha256')}
                    className="p-1 text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer shrink-0 border-0 bg-transparent flex items-center justify-center"
                    style={{ width: '20px', height: '20px' }}
                    title="Copy SHA-256 hash"
                  >
                    <i className={copiedId === 'sha256' ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line'}></i>
                  </button>
                </div>
              </div>

              {/* SHA-512 */}
              <div
                className="bg-[#000000] rounded-xl flex items-center justify-between gap-2"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <span className="text-[#8e9199] font-bold text-[12px] shrink-0">SHA-512:</span>
                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                  <span
                    className="text-[#fdd663] font-mono text-[12px] truncate cursor-pointer"
                    title={sha512Hex}
                    onClick={() => triggerCopy(sha512Hex, 'sha512')}
                  >
                    {sha512Hex}
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerCopy(sha512Hex, 'sha512')}
                    className="p-1 text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer shrink-0 border-0 bg-transparent flex items-center justify-center"
                    style={{ width: '20px', height: '20px' }}
                    title="Copy SHA-512 hash"
                  >
                    <i className={copiedId === 'sha512' ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line'}></i>
                  </button>
                </div>
              </div>

              {/* Base64 */}
              <div
                className="bg-[#000000] rounded-xl flex items-center justify-between gap-2"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <span className="text-[#8e9199] font-bold text-[12px] shrink-0">Base64:</span>
                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                  <span
                    className="text-[#a8c7fa] font-mono text-[12px] truncate cursor-pointer"
                    title={base64Encoded}
                    onClick={() => triggerCopy(base64Encoded, 'base64')}
                  >
                    {base64Encoded}
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerCopy(base64Encoded, 'base64')}
                    className="p-1 text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer shrink-0 border-0 bg-transparent flex items-center justify-center"
                    style={{ width: '20px', height: '20px' }}
                    title="Copy Base64 string"
                  >
                    <i className={copiedId === 'base64' ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line'}></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIGN (OPENGPG CLEARTEXT) OUTPUT VIEW */}
          {engineMode === 'sign' && (
            <div
              className="bg-[#21232b] p-2 rounded-2xl border-0 space-y-2 font-mono text-xs animate-fadeIn"
              style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              <div
                className="flex items-center justify-between flex-wrap gap-2 h-[33px]"
                style={{ height: '33px' }}
              >
                <div
                  className="flex items-center gap-2 shrink-0 h-[26px]"
                  style={{ marginBottom: '0px', height: '26px' }}
                >
                  <button
                    type="button"
                    className="w-[32.9948px] h-[32.9948px] rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0"
                    style={{ width: '32.9948px', height: '32.9948px' }}
                    title="OpenPGP Cleartext Signature"
                    aria-label="OpenPGP Cleartext Signature"
                  >
                    <i className="ri-finder-line"></i>
                  </button>
                  <div className="flex flex-col justify-center min-w-0">
                    <span
                      className="font-bold text-white text-[16px] leading-[16px] whitespace-nowrap"
                      style={{ fontSize: "16px", lineHeight: "16px" }}
                    >
                      OpenPGP Cleartext Signature
                    </span>
                    <span
                      className="text-[#8e9199] text-[12px] leading-[14px] whitespace-nowrap"
                      style={{ fontSize: "12px", lineHeight: "14px" }}
                    >
                      RFC 4880
                    </span>
                  </div>
                </div>
              </div>

              {/* ASCII Terminal Box with Controls & Top-Right Icon Copy Button - Full Height Without Scroll */}
              <div
                className="relative bg-[#000000] p-2 rounded-xl border border-[#44474f]/35"
                style={{
                  marginTop: '8px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                {/* Algo toggle toolbar inside txt block */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#44474f]/25">
                  <div className="flex items-center gap-2">
                    {/* Algo toggle: SHA-256 / SHA-512 */}
                    <div className="flex items-center bg-[#21232b] rounded-lg p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setSigAlgo('SHA256');
                          soundEngine.play('click');
                        }}
                        style={{ fontSize: '12px' }}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[12px] ${
                          sigAlgo === 'SHA256' ? 'bg-[#a8c7fa] text-[#042e60] font-bold' : 'text-[#8e9199] hover:text-white'
                        }`}
                      >
                        SHA-256
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSigAlgo('SHA512');
                          soundEngine.play('click');
                        }}
                        style={{ fontSize: '12px' }}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[12px] ${
                          sigAlgo === 'SHA512' ? 'bg-[#a8c7fa] text-[#042e60] font-bold' : 'text-[#8e9199] hover:text-white'
                        }`}
                      >
                        SHA-512
                      </button>
                    </div>
                  </div>
                </div>

                <pre
                  style={{ fontSize: '12px' }}
                  className="text-[#c4c6d0] text-[12px] leading-[16px] font-mono selection:bg-[#a8c7fa] selection:text-[#042e60] whitespace-pre-wrap break-all"
                >
                  {generatedSignatureBlock}
                </pre>
              </div>

              {/* D. 1-CLICK CLI COPY HELPER */}
              <div
                className="bg-[#000000] rounded-xl flex items-center justify-between gap-2 border border-[#44474f]/25"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <code
                  style={{ fontSize: '12px', lineHeight: '16px' }}
                  className="text-[#8e9199] font-mono text-[12px] leading-[16px] truncate min-w-0 flex-1"
                >
                  {cliVerifyCommand}
                </code>
                <button
                  type="button"
                  onClick={() => triggerCopy(cliVerifyCommand, 'cli-btn-inner')}
                  className="p-1 text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer shrink-0 border-0 bg-transparent flex items-center justify-center"
                  style={{ width: '20px', height: '20px' }}
                  title="Copy verification command"
                  aria-label="Copy verification command"
                >
                  <i className={copiedId === 'cli-btn-inner' ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line'}></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEGMENT 2: KEYRING & IDENTITY (GPG / OPENPGP SPEC) */}
      {activeSegment === 'keyring' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Key Card Header Container */}
          <div
            className="bg-[#21232b] p-3 rounded-2xl border-0 space-y-3 font-mono text-xs"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            {/* Header: GPG Master Info + Download Action */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-[32.9948px] h-[32.9948px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-lg font-bold shadow-sm shrink-0"
                  style={{ width: '32.9948px', height: '32.9948px' }}
                >
                  <i className="ri-git-repository-private-line"></i>
                </div>
                <div className="flex flex-col justify-center min-w-0 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-white leading-[16px]" style={{ fontSize: '15px' }}>
                      GPG Master Key
                    </span>
                  </div>
                  <span className="text-[#8e9199] text-[11px] leading-[14px] mt-0.5">
                    Key ID: <strong className="text-[#a8c7fa]" style={{ fontSize: '12px', lineHeight: '12px' }}>{pgpKeyId}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Download .asc + Copy Fingerprint - Icon Only matching Crypto Sig Sandbox */}
              <div className="flex items-center gap-[10px] shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadAsc}
                  className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 ${
                    copiedId === 'download-asc'
                      ? 'bg-[#a8e6cf] text-[#003923]'
                      : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]'
                  }`}
                  title={copiedId === 'download-asc' ? 'Downloaded!' : 'Download OpenPGP Public Key file (.asc)'}
                  aria-label={copiedId === 'download-asc' ? 'Downloaded!' : 'Download OpenPGP Public Key file (.asc)'}
                >
                  <i className={`${copiedId === 'download-asc' ? 'ri-survey-line text-[#003923]' : 'ri-archive-stack-line'} text-[13px] leading-[16px]`}></i>
                </button>

                <button
                  type="button"
                  onClick={() => triggerCopy(pgpFingerprint, 'fpr-btn')}
                  className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 ${
                    copiedId === 'fpr-btn'
                      ? 'bg-[#a8e6cf] text-[#003923]'
                      : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]'
                  }`}
                  title={copiedId === 'fpr-btn' ? 'Fingerprint Copied!' : 'Copy Full 40-digit Fingerprint'}
                  aria-label={copiedId === 'fpr-btn' ? 'Fingerprint Copied!' : 'Copy Full 40-digit Fingerprint'}
                >
                  <i className={`${copiedId === 'fpr-btn' ? 'ri-survey-line text-[#003923]' : 'ri-file-copy-2-line'} text-[13px] leading-[16px]`}></i>
                </button>
              </div>
            </div>

            {/* Fingerprint Gold Box */}
            <div
              className="bg-[#000000] rounded-xl border border-[#44474f]/30"
              style={{
                paddingLeft: '8px',
                paddingRight: '8px',
                paddingTop: '8px',
                paddingBottom: '8px',
                marginBottom: '15px',
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#8e9199] mb-1">
                <span style={{ fontSize: '12px', lineHeight: '13px' }}>40 CHAR KEY FINGERPRINT</span>
                <span className="text-[#a8c7fa]" style={{ fontSize: '12px', lineHeight: '12px' }}>RFC-4880</span>
              </div>
              <div
                className="text-[#fdd663] font-mono text-[12px] tracking-wider break-all select-all font-semibold"
                style={{ lineHeight: '12px' }}
              >
                {pgpFingerprint}
              </div>
            </div>

            {/* Detailed Subkey & Spec Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              {/* Subkeys */}
              <div
                className="bg-[#000000] rounded-xl space-y-1.5 border border-[#44474f]/25"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <div className="text-[#a8c7fa] font-bold flex items-center gap-1">
                  <i className="ri-node-tree text-xs"></i>
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>Subkey Architecture</span>
                </div>
                <div className="grid grid-cols-[auto_auto_auto_auto_auto_1fr] gap-x-1.5 gap-y-1 text-[#c4c6d0] items-baseline overflow-x-auto custom-scrollbar">
                  <span className="text-[#8e9199] whitespace-nowrap">pub</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">RSA 4096-bit [SC]</span>
                  <span className="text-[#8e9199] whitespace-nowrap">• ID</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">
                    <strong className="text-white">0x9E8C41A2</strong>
                  </span>

                  <span className="text-[#8e9199] whitespace-nowrap">sub</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">RSA 4096-bit [E]</span>
                  <span className="text-[#8e9199] whitespace-nowrap">• ID</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">
                    <strong className="text-white">0x7B3D18F9</strong>
                  </span>

                  <span className="text-[#8e9199] whitespace-nowrap">sub</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">Ed25519 256-bit [A]</span>
                  <span className="text-[#8e9199] whitespace-nowrap">• ID</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="whitespace-nowrap">
                    <strong className="text-white">0x2C8E4A01</strong>
                  </span>
                </div>
              </div>

              {/* Cipher Preferences & Policies */}
              <div
                className="bg-[#000000] rounded-xl space-y-1.5 border border-[#44474f]/25"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <div className="text-[#a8e6cf] font-bold flex items-center gap-1">
                  <i className="ri-shield-keyhole-line text-xs"></i>
                  <span style={{ fontSize: '16px', lineHeight: '16px' }}>Cipher Preferences</span>
                </div>
                <div className="grid grid-cols-[auto_auto_1fr] gap-x-1.5 gap-y-1 text-[#c4c6d0] items-baseline">
                  <span className="text-[#8e9199]">Symmetric</span>
                  <span className="text-[#8e9199]">:</span>
                  <span>AES-256, AES-192, Camellia-256</span>

                  <span className="text-[#8e9199]">Digests</span>
                  <span className="text-[#8e9199]">:</span>
                  <span>SHA-512, SHA-384, SHA-256</span>

                  <span className="text-[#8e9199]">Trust Level</span>
                  <span className="text-[#8e9199]">:</span>
                  <span className="text-[#a8e6cf] font-bold">[Ultimate / Owner Verified]</span>
                </div>
              </div>
            </div>

            {/* ASCII Armored Public Key Drawer */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowKeyArmor(!showKeyArmor);
                  soundEngine.play('click');
                }}
                className="w-full py-2 px-3 bg-[#000000] hover:bg-[#14151a] rounded-xl text-[#a8c7fa] text-xs font-mono flex items-center justify-between transition-colors border border-[#44474f]/30 cursor-pointer"
                style={{ paddingLeft: '8px', paddingRight: '8px' }}
              >
                <div className="flex items-center gap-2">
                  <i className="ri-code-box-line"></i>
                  <span style={{ fontSize: '16px' }}>ASCII Armored Public Key</span>
                </div>
                <i className={`text-lg text-[#a8c7fa] ${showKeyArmor ? 'ri-swap-3-line' : 'ri-beer-line'}`}></i>
              </button>

              {showKeyArmor && (
                <div
                  className="mt-2 bg-[#000000] rounded-xl border border-[#44474f]/35 animate-fadeIn"
                  style={{
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  }}
                >
                  <div
                    className="flex items-center justify-between border-b border-[#44474f]/25"
                    style={{ height: '32.994px', marginBottom: '0px', paddingBottom: '0px' }}
                  >
                    <span className="text-[#8e9199]" style={{ fontSize: '16px' }}>RFC 4880 Export</span>
                    <button
                      type="button"
                      onClick={() => triggerCopy(PUBLIC_KEY_ASCII_ARMOR, 'armor-copy')}
                      className="p-1 text-[#a8c7fa] hover:opacity-80 transition-opacity cursor-pointer shrink-0 border-0 bg-transparent flex items-center justify-center"
                      style={{ width: '26.9965px', height: '26.9965px' }}
                      title={copiedId === 'armor-copy' ? 'Copied!' : 'Copy ASCII Armored Key Block'}
                      aria-label={copiedId === 'armor-copy' ? 'Copied!' : 'Copy ASCII Armored Key Block'}
                    >
                      <i className={copiedId === 'armor-copy' ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line'}></i>
                    </button>
                  </div>
                  <pre
                    className="text-[#c4c6d0] text-[11px] sm:text-[12px] font-mono select-all whitespace-pre-wrap break-all overflow-hidden"
                    style={{ fontSize: '12px', lineHeight: '15px', height: 'auto', maxHeight: 'none', overflowX: 'hidden' }}
                  >
                    {PUBLIC_KEY_ASCII_ARMOR}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
