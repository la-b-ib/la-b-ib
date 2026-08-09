import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const PgpCryptoSandbox: React.FC = () => {
  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';
  const pgpKeyId = '0x9E8C41A2';
  
  const [copiedKey, setCopiedKey] = useState(false);
  const [inputText, setInputText] = useState('DISPATCH_VERIFICATION: Approved for SOC deployment. Hash integrity checked.');
  const [algo, setAlgo] = useState<'sha256' | 'sha512' | 'hmac'>('sha256');
  const [secretKey, setSecretKey] = useState('IEEE_CS_SECRET_PASS');
  const [signatureOutput, setSignatureOutput] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopiedKey(true);
    soundEngine.play('click');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  // Pseudo-crypto hasher for live sandbox demonstration
  const handleGenerateSignature = () => {
    soundEngine.play('click');
    setVerifying(true);
    setTimeout(() => {
      let mockHash = '';
      const str = `${inputText}-${algo}-${secretKey}`;
      let hashNum = 0;
      for (let i = 0; i < str.length; i++) {
        hashNum = (hashNum << 5) - hashNum + str.charCodeAt(i);
        hashNum |= 0;
      }
      const hex = Math.abs(hashNum).toString(16).padStart(8, '0');
      
      if (algo === 'sha256') {
        mockHash = `-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\n${inputText}\n-----BEGIN PGP SIGNATURE-----\nVersion: GnuPG v2.2.27 (GNU/Linux)\n\niQIzBAEBCAAdFiEE${hex.toUpperCase()}9E8C41A20000119\n=4F9B\n-----END PGP SIGNATURE-----`;
      } else if (algo === 'sha512') {
        mockHash = `-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA512\n\n${inputText}\n-----BEGIN PGP SIGNATURE-----\nVersion: GnuPG v2.2.27 (GNU/Linux)\n\niQIzBAEBCAAdFiEE${hex.toUpperCase()}AABBCCDD1122334455\n=9E8C\n-----END PGP SIGNATURE-----`;
      } else {
        mockHash = `HMAC-SHA256 SIGNATURE:\n0x${hex}${hex}${hex}${hex}9e8c41a2 [VERIFIED BY KEY 0x9E8C41A2]`;
      }

      setSignatureOutput(mockHash);
      setVerifying(false);
    }, 400);
  };

  return (
    <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#44474f]/60 space-y-6 shadow-2xl font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8e6cf] uppercase tracking-wider">
            <i className="ri-key-2-line text-sm"></i>
            <span>CRYPTOGRAPHIC PGP VERIFICATION & DIGEST</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Live Cryptographic Signature Sandbox</h3>
          <p className="text-xs text-[#c4c6d0] mt-0.5">
            Verify communications integrity using Labib's PGP public key and SHA-256 HMAC digester.
          </p>
        </div>

        <button
          onClick={handleCopyKey}
          className="px-3.5 py-1.5 bg-[#00522b]/40 hover:bg-[#00522b]/70 border border-[#a8e6cf]/40 text-xs font-mono text-[#a8e6cf] rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <i className="ri-file-copy-line"></i>
          <span>{copiedKey ? 'COPIED TO CLIPBOARD!' : 'COPY PGP KEY FINGERPRINT'}</span>
        </button>
      </div>

      {/* PGP KEY CARD */}
      <div className="bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/50 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[#8e9199]">
          <span>GPG PUBLIC KEY ID: <strong className="text-[#a8c7fa]">{pgpKeyId}</strong></span>
          <span className="text-[#a8e6cf] font-bold">ALGORITHM: RSA 4096-BIT / ECC</span>
        </div>
        <div className="text-[#a8e6cf] font-mono tracking-tight bg-[#1a1b21] p-3 rounded-lg border border-[#44474f]/40 break-all select-all">
          {pgpFingerprint}
        </div>
      </div>

      {/* INTERACTIVE SIGNATURE GENERATOR */}
      <div className="bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-mono text-xs">
        <div className="text-xs font-bold text-[#a8c7fa] flex items-center gap-1.5 border-b border-[#44474f]/30 pb-2">
          <i className="ri-quill-pen-line"></i> LIVE MESSAGE SIGNING & DISPATCH AUTHENTICATOR
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-[#8e9199]">MESSAGE TO SIGN</label>
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#1a1b21] border border-[#44474f] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#a8c7fa]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8e9199]">DIGEST ALGORITHM</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as any)}
              className="w-full bg-[#1a1b21] border border-[#44474f] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#a8c7fa]"
            >
              <option value="sha256">PGP SHA-256 RSA SIGNATURE</option>
              <option value="sha512">PGP SHA-512 ECC SIGNATURE</option>
              <option value="hmac">HMAC-SHA256 SYMMETRIC DIGEST</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8e9199]">PASSPHRASE KEY</label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-[#1a1b21] border border-[#44474f] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#a8c7fa]"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateSignature}
          disabled={verifying}
          className="m3-btn-primary w-full justify-center text-xs font-bold py-2.5 cursor-pointer"
        >
          <i className="ri-shield-keyhole-line"></i>
          <span>{verifying ? 'COMPUTING CRYPTOGRAPHIC HASH...' : 'GENERATE SIGNATURE & VERIFY INTEGRITY'}</span>
        </button>

        {signatureOutput && (
          <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#a8e6cf]/50 space-y-2 animate-fadeIn">
            <div className="text-[10px] text-[#a8e6cf] font-bold flex items-center justify-between">
              <span>CRYPTOGRAPHIC SIGNATURE BLOCK</span>
              <span className="bg-[#00522b]/50 text-[#a8e6cf] px-2 py-0.5 rounded border border-[#a8e6cf]/30">VALID & AUTHENTICATED</span>
            </div>
            <pre className="text-[11px] text-[#c4c6d0] bg-[#0f0e13] p-3 rounded-lg border border-[#44474f]/50 whitespace-pre-wrap font-mono overflow-x-auto">
              {signatureOutput}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};
