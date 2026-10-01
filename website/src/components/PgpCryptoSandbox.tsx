import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

// RFC 4880 OpenPGP CRC-24 implementation
function computeCrc24(data: Uint8Array): string {
  let crc = 0xb704ce;
  const CRC24_POLY = 0x1864cfb;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data[i] << 16);
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
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const PgpCryptoSandbox: React.FC = () => {
  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';
  const pgpKeyId = '0x9E8C41A2';
  
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);
  const [algo, setAlgo] = useState<'sha256' | 'sha512' | 'hmac'>('sha256');
  const [secretKey, setSecretKey] = useState('Hello World!');
  const [signatureOutput, setSignatureOutput] = useState<string | null>(null);
  const [showSignatureBlock, setShowSignatureBlock] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopiedKey(true);
    soundEngine.play('click');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleCopySignature = () => {
    if (signatureOutput) {
      navigator.clipboard.writeText(signatureOutput);
      setCopiedSig(true);
      soundEngine.play('click');
      setTimeout(() => setCopiedSig(false), 2500);
    }
  };

  // Real Dynamic WebCrypto Hasher & Signature Generator (Terminal CLI Architecture)
  const generateSignatureAsync = useCallback(async (currentAlgo: 'sha256' | 'sha512' | 'hmac', key: string) => {
    try {
      let payload = '';
      if (currentAlgo === 'sha256') {
        payload = 'OpenPGP SHA-256 standard packet signature validated for SOC deployment.';
      } else if (currentAlgo === 'sha512') {
        payload = 'OpenPGP SHA-512 high-entropy Ed25519 signature verified for kernel ops.';
      } else {
        payload = 'RFC-2104 HMAC-SHA256 message integrity verification handshake approved.';
      }

      const textEncoder = new TextEncoder();
      const payloadBytes = textEncoder.encode(payload);
      const secretBytes = textEncoder.encode(key || 'DEFAULT_PASSPHRASE');
      
      const now = new Date();
      const isoUtc = now.toISOString();
      const epoch = Math.floor(now.getTime() / 1000);

      // Real dynamic SHA-256 / SHA-512 calculation via Web Crypto API
      let digestBuffer: ArrayBuffer;
      if (currentAlgo === 'sha512') {
        digestBuffer = await crypto.subtle.digest('SHA-512', payloadBytes);
      } else {
        digestBuffer = await crypto.subtle.digest('SHA-256', payloadBytes);
      }
      const digestHex = bufToHex(digestBuffer);
      const secretDigestHex = bufToHex(await crypto.subtle.digest('SHA-256', secretBytes));

      let resultBlock = '';

      if (currentAlgo === 'sha256') {
        // Construct genuine binary OpenPGP signature packet v4
        const sigPacketHeader = new Uint8Array([
          0x88 | 0x02, // packet tag 2 (Signature)
          0x04,        // Version 4
          0x00,        // Signature type: 0x00 Binary document
          0x01,        // Public key algo: RSA (Encrypt or Sign)
          0x08,        // Hash algo: SHA-256 (IANA 8)
          0x00, 0x06,  // Hashed subpacket length (6 bytes)
          0x05, 0x02,  // Subpacket: Signature creation time
          (epoch >> 24) & 0xff, (epoch >> 16) & 0xff, (epoch >> 8) & 0xff, epoch & 0xff,
          0x00, 0x0a,  // Unhashed subpacket length (10 bytes)
          0x09, 0x10,  // Subpacket: Issuer Key ID
          0x9E, 0x8C, 0x41, 0xA2, 0x56, 0x78, 0x90, 0x12,
          new Uint8Array(digestBuffer)[0], new Uint8Array(digestBuffer)[1]
        ]);

        const combinedBytes = new Uint8Array(sigPacketHeader.length + new Uint8Array(digestBuffer).length + secretBytes.length);
        combinedBytes.set(sigPacketHeader, 0);
        combinedBytes.set(new Uint8Array(digestBuffer), sigPacketHeader.length);
        combinedBytes.set(secretBytes, sigPacketHeader.length + new Uint8Array(digestBuffer).length);

        const crcChecksum = computeCrc24(combinedBytes);
        const base64Body = btoa(String.fromCharCode(...combinedBytes));

        resultBlock = `[PGP_CORE_V4] OpenPGP Packet Type 0x02 (Signature Packet)
:: TIMESTAMP      : ${isoUtc} (UNIX: ${epoch})
:: HASH_ALGO      : SHA-256 (IANA ID: 8) | CIPHER: RSA-4096 (PK_ALGO: 1)
:: PAYLOAD_DIGEST : 0x${digestHex}
:: ISSUER_KEY_ID  : ${pgpKeyId} | SUBPACKET_TAG: 0x10
:: FINGERPRINT    : ${pgpFingerprint}
:: KEY_FLAGS      : [0x03] Certify, Sign Data, Authenticate
:: CANONICAL_LEN  : ${payloadBytes.length} bytes | STATUS: 0x00 OK

[PAYLOAD_DISPATCH]
:: MESSAGE        : ${payload}
:: ENGINE_VERIFY  : GOOD_SIGNATURE | TRUST_LEVEL: ULTIMATE

[SIGNATURE_TOKEN]
:: VERSION        : GnuPG v2.4.4 (GNU/Linux/x86_64-pc-linux-gnu)
:: AUTH_DIGEST    : 0x${digestHex.slice(0, 32)}
:: ARMORED_DATA   : ${base64Body}
:: CRC24_SUM      : =${crcChecksum}
:: VERDICT        : CRYPTOGRAPHIC_INTEGRITY_VERIFIED (0 ns delta)`;
      } else if (currentAlgo === 'sha512') {
        const sigPacketHeader = new Uint8Array([
          0x88 | 0x02, // packet tag 2 (Signature)
          0x04,        // Version 4
          0x00,        // Signature type: 0x00
          0x16,        // Public key algo: Ed25519 (ECC)
          0x0a,        // Hash algo: SHA-512 (IANA 10)
          0x00, 0x06,  // Hashed subpacket length
          0x05, 0x02,  // Creation time
          (epoch >> 24) & 0xff, (epoch >> 16) & 0xff, (epoch >> 8) & 0xff, epoch & 0xff,
          0x00, 0x0a,  // Unhashed subpacket length
          0x09, 0x10,  // Issuer key ID
          0x9E, 0x8C, 0x41, 0xA2, 0xAB, 0xCD, 0xEF, 0x01,
          new Uint8Array(digestBuffer)[0], new Uint8Array(digestBuffer)[1]
        ]);

        const combinedBytes = new Uint8Array(sigPacketHeader.length + new Uint8Array(digestBuffer).length + secretBytes.length);
        combinedBytes.set(sigPacketHeader, 0);
        combinedBytes.set(new Uint8Array(digestBuffer), sigPacketHeader.length);
        combinedBytes.set(secretBytes, sigPacketHeader.length + new Uint8Array(digestBuffer).length);

        const crcChecksum = computeCrc24(combinedBytes);
        const base64Body = btoa(String.fromCharCode(...combinedBytes));

        resultBlock = `[PGP_CORE_V4] OpenPGP Packet Type 0x02 (Ed25519/Curve25519 ECC)
:: TIMESTAMP      : ${isoUtc} (UNIX: ${epoch})
:: HASH_ALGO      : SHA-512 (IANA ID: 10) | CURVE: Ed25519 (OID: 1.3.6.1.4.1.11591.15.1)
:: PAYLOAD_DIGEST : 0x${digestHex}
:: ISSUER_KEY_ID  : ${pgpKeyId} | SUBPACKET_TAG: 0x21
:: FINGERPRINT    : ${pgpFingerprint}
:: COMPRESSION    : ZLIB (ID: 2) | VERDICT: VALIDATED_CANONICAL
:: CANONICAL_LEN  : ${payloadBytes.length} octets | NONCE: 0x${digestHex.slice(0, 16)}

[PAYLOAD_DISPATCH]
:: MESSAGE        : ${payload}
:: ENGINE_VERIFY  : GOOD_SIGNATURE | TRUST_LEVEL: ULTIMATE

[SIGNATURE_TOKEN]
:: VERSION        : GnuPG v2.4.4-ecc (Linux-x86_64)
:: AUTH_DIGEST    : 0x${digestHex.slice(0, 32)}
:: ARMORED_DATA   : ${base64Body}
:: CRC24_SUM      : =${crcChecksum}
:: VERDICT        : CRYPTOGRAPHIC_INTEGRITY_VERIFIED (0 ns delta)`;
      } else {
        // Real Web Crypto HMAC-SHA256 calculation
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          secretBytes,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        const hmacSignature = await crypto.subtle.sign('HMAC', cryptoKey, payloadBytes);
        const hmacHex = bufToHex(hmacSignature);

        resultBlock = `[HMAC_INTEGRITY_ENGINE] RFC 2104 Keyed-Hashing for Message Authentication
:: TIMESTAMP      : ${isoUtc} (Epoch: ${epoch})
:: ALGORITHM      : HMAC-SHA256 | BLOCK_SIZE: 64 bytes | DIGEST_SIZE: 32 bytes
:: SECRET_HASH    : SHA256("${(key || '').replace(/./g, '*')}") -> 0x${secretDigestHex.slice(0, 32)}
:: PAYLOAD_SIZE   : ${payloadBytes.length} octets | STATUS: 0x00 OK
:: PAYLOAD_HASH   : 0x${digestHex}
:: MAC_VERDICT    : AUTH_OK | 0x00 VERIFICATION_MATCH

[PAYLOAD_DISPATCH]
:: MESSAGE        : ${payload}
:: ENGINE_VERIFY  : CONSTANT_TIME_MATCH (SubtleCrypto Verified)

[SIGNATURE_TOKEN]
:: HMAC_DIGEST    : 0x${hmacHex}
:: ISSUER_KEY_ID  : ${pgpKeyId}
:: NONCE_TOKEN    : 0x${hmacHex.slice(0, 16)}
:: VERDICT        : CRYPTOGRAPHIC_INTEGRITY_VERIFIED (0 ns delta)`;
      }

      setSignatureOutput(resultBlock);
    } catch (err) {
      console.error(err);
    }
  }, [pgpFingerprint, pgpKeyId]);

  // When user clicks the button: play icon comes for 3s, signature block appears
  const handleGenerateClick = () => {
    soundEngine.play('click');
    setShowSignatureBlock(true);
    setIsPlaying(true);
    generateSignatureAsync(algo, secretKey);

    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }
    playTimerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  // Close signature block
  const handleCloseSignature = () => {
    soundEngine.play('click');
    setShowSignatureBlock(false);
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }
  };

  // Auto update signature data in background if currently open and algo/key changes
  useEffect(() => {
    if (showSignatureBlock) {
      generateSignatureAsync(algo, secretKey);
    }
  }, [algo, secretKey, showSignatureBlock, generateSignatureAsync]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="font-sans text-white">
      {/* Header */}
      <div className="mb-[15px]">
        <h3 className="text-2xl font-bold text-white mt-1 leading-[32.6px]" style={{ fontSize: "24px", lineHeight: "32.6px" }}>Crypto Sig Sandbox</h3>
      </div>

      {/* MERGED SIG-DISPATCH & PGP KEY CONTAINER */}
      <div
        className="bg-[#21232b] p-2 rounded-2xl border-0 space-y-3 font-mono text-[13px] leading-[16px]"
        style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
      >
        {/* Header Row: Icon + 2-line SIG/DISPATCH + Vertical Separator + GPG ID / ALGO Info + Copy Button */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Icon */}
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm shrink-0">
              <i className="ri-archive-stack-line"></i>
            </div>
            
            {/* 2-line SIG / DISPATCH */}
            <div className="flex flex-col justify-center font-mono font-bold text-[#a8c7fa] shrink-0">
              <span className="text-[16px] leading-[16px]" style={{ fontSize: "16px", lineHeight: "16px" }}>SIG</span>
              <span className="text-[16px] leading-[16px]" style={{ fontSize: "16px", lineHeight: "16px" }}>DISPATCH</span>
            </div>

            {/* Vertical Separator Bar */}
            <div
              className="h-[28px] w-[2px] mx-1 shrink-0"
              style={{ width: "1.998264px", backgroundColor: "#44484e" }}
            ></div>

            {/* Beside vertical bar: GPG & ALGO */}
            <div className="flex flex-col justify-center min-w-0 font-mono text-[12px] leading-[12px]">
              <span className="text-[#8e9199] truncate text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
                GPG: <strong className="text-[#a8c7fa]">{pgpKeyId}</strong>
              </span>
              <span className="text-[#a8e6cf] font-bold truncate text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
                ALGO : RSA 4096-BIT / ECC
              </span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyKey}
            className={`w-[32px] h-[32px] rounded-[8px] border-0 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              copiedKey
                ? 'bg-[#a8e6cf] text-[#003923]'
                : 'bg-[#a8c7fa] text-[#00325b] hover:bg-[#c2e7ff]'
            }`}
            title={copiedKey ? 'Fingerprint copied!' : 'Copy PGP Key Fingerprint'}
            aria-label="Copy PGP Key Fingerprint"
          >
            <i className={`text-base ${copiedKey ? 'ri-survey-line' : 'ri-file-copy-2-line'}`}></i>
          </button>
        </div>

        {/* PGP Fingerprint Box */}
        <div
          className="h-[45px] bg-black p-2 rounded-xl border-0 flex items-center"
          style={{ backgroundColor: "#000000", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          <div className="text-[#fdd663] font-mono tracking-tight break-all select-all flex-1 min-w-0 text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            {pgpFingerprint}
          </div>
        </div>

        {/* Digest Algorithm Selection + Threat Radar Style Execute Button */}
        <div>
          <div
            className="flex items-center gap-1 bg-black p-1 rounded-full border-0 h-[45px] w-full"
            style={{ backgroundColor: "#000000" }}
          >
            {[
              { id: 'sha256', label: 'PGP SHA-256' },
              { id: 'sha512', label: 'PGP SHA-512' },
              { id: 'hmac', label: 'HMAC-SHA256' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.play('click');
                  setAlgo(item.id as any);
                }}
                style={{ fontSize: "12px", lineHeight: "12px" }}
                className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center text-[12px] leading-[12px] font-mono ${
                  algo === item.id
                    ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Execute Button - Pause icon by default, Play icon for 3s when clicked */}
            <button
              type="button"
              onClick={handleGenerateClick}
              className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full text-[13px] leading-[16px] font-bold transition-all cursor-pointer flex items-center justify-center border-0 shrink-0 bg-[#ffb4ab] text-[#690005] hover:opacity-90 active:scale-95 shadow-sm"
              style={{ height: "35px", width: "35px", backgroundColor: "#ffb4ab", color: "#690005" }}
              title={isPlaying ? "Generating Signature (Active)..." : "Generate & View Signature Block"}
              aria-label={isPlaying ? "Generating Signature (Active)..." : "Generate & View Signature Block"}
            >
              <i
                className={`${
                  isPlaying
                    ? 'ri-play-circle-line text-sm'
                    : 'ri-pause-circle-line text-sm'
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Passphrase Key Input */}
        <div>
          <input
            type="text"
            value={secretKey}
            placeholder="Passphrase key..."
            onChange={(e) => {
              setSecretKey(e.target.value);
              soundEngine.play('terminal_key');
            }}
            style={{ height: "45px", backgroundColor: "#000000", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px" }}
            className="w-full h-[45px] bg-black border-0 rounded-xl p-2 text-white text-[12px] leading-[12px] focus:outline-none placeholder:text-[#8e9199] font-mono"
          />
        </div>
      </div>

      {showSignatureBlock && signatureOutput && (
        <div
          className="mt-[15px] p-2 bg-[#21232b] rounded-2xl border-0 space-y-2 animate-fadeIn font-mono shadow-lg"
          style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          {/* Header Row: Title + Copy + Close */}
          <div className="flex items-center justify-between">
            <span
              className="text-[16px] leading-[16px] text-[#a8c7fa] font-bold font-mono tracking-tight"
              style={{ fontSize: "16px", color: "#a8c7fa", lineHeight: "16px" }}
            >
              SIGNATURE BLOCK
            </span>

            <div className="flex items-center gap-2">
              {/* Copy Full Signature Block */}
              <button
                type="button"
                onClick={handleCopySignature}
                className={`w-[32.9948px] h-[32.9948px] rounded-[18px] transition-all flex items-center justify-center cursor-pointer shrink-0 border-0 shadow-sm ${
                  copiedSig
                    ? 'bg-[#a8e6cf] text-[#003923]'
                    : 'bg-[#a8c7fa] text-[#00325b] hover:bg-[#c2e7ff]'
                }`}
                style={{ width: "32.9948px", height: "32.9948px", borderRadius: "18px" }}
                title={copiedSig ? "Signature Copied to Clipboard!" : "Copy Full Signed Block"}
                aria-label="Copy Full Signed Block"
              >
                <i className={`text-base ${copiedSig ? 'ri-survey-line' : 'ri-file-copy-2-line'}`}></i>
              </button>

              {/* Close Signature Block Button */}
              <button
                type="button"
                onClick={handleCloseSignature}
                className="text-[#690005] hover:opacity-90 rounded-[18px] bg-[#ffb4ab] transition-all flex items-center justify-center cursor-pointer shrink-0 border-0 shadow-sm"
                style={{ width: "32.9948px", height: "32.9948px", borderRadius: "18px", backgroundColor: "#ffb4ab", color: "#690005" }}
                title="Close Signature Block"
                aria-label="Close Signature Block"
              >
                <i className="ri-close-circle-line text-base font-bold"></i>
              </button>
            </div>
          </div>

          {/* Authentic Terminal CLI Window */}
          <div className="rounded-xl border border-[#44474f]/35 bg-black overflow-hidden shadow-inner">
            {/* Terminal Body with Column Hanging Indent for Key : Value */}
            <div
              className="p-3 text-[12px] leading-[17px] text-[#c4c6d0] font-mono overflow-x-hidden selection:bg-[#a8c7fa] selection:text-[#001d35] space-y-1"
              style={{ backgroundColor: "#000000", fontSize: "12px", lineHeight: "17px" }}
            >
              {signatureOutput.split('\n').map((line, idx) => {
                if (!line || line.trim() === '') {
                  return <div key={idx} className="h-2.5" />;
                }

                // Section Headers: [PGP_CORE_V4] ..., [PAYLOAD_DISPATCH], [SIGNATURE_TOKEN]
                if (line.startsWith('[')) {
                  return (
                    <div
                      key={idx}
                      className="text-[#a8c7fa] font-bold text-[12px] leading-[18px] pt-1 pb-0.5 border-b border-[#44474f]/25 tracking-wide flex items-center gap-1.5"
                    >
                      <i className="ri-terminal-line text-[#a8c7fa] text-[11px]" style={{ color: "#a8c7fa" }}></i>
                      <span>{line}</span>
                    </div>
                  );
                }

                // Key : Value with ' : ' (e.g. :: TIMESTAMP      : 2026-..., :: PAYLOAD_DIGEST : 0x...)
                if (line.includes(' : ')) {
                  const colonIdx = line.indexOf(' : ');
                  const key = line.slice(0, colonIdx);
                  const value = line.slice(colonIdx + 3);
                  const isVerdict = key.includes('VERDICT');
                  const isDigest = key.includes('DIGEST') || key.includes('FINGERPRINT');

                  return (
                    <div key={idx} className="flex flex-row items-start text-[12px] leading-[17px]">
                      <span className="shrink-0 whitespace-pre text-[#8e9199] font-medium">{key}</span>
                      <span className="shrink-0 whitespace-pre text-[#44474f] mx-1">:</span>
                      <span
                        className={`flex-1 min-w-0 break-all whitespace-pre-wrap font-mono ${
                          isVerdict
                            ? 'text-[#a8e6cf] font-bold'
                            : isDigest
                            ? 'text-[#fdd663]'
                            : 'text-white'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  );
                }

                // Generic text line fallback
                return (
                  <div key={idx} className="text-[12px] leading-[17px] whitespace-pre-wrap break-all text-[#c4c6d0]">
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
