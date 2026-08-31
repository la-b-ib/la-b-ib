import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const PgpCryptoSandbox: React.FC = () => {
 const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';
 const pgpKeyId = '0x9E8C41A2';
 
 const [copiedKey, setCopiedKey] = useState(false);
 const [inputText, setInputText] = useState('DISPATCH_VERIFICATION: Approved for SOC deployment. Hash integrity checked.');
 const [algo, setAlgo] = useState<'sha256' | 'sha512' | 'hmac'>('sha256');
 const [secretKey, setSecretKey] = useState('Hello World!');
 const [signatureOutput, setSignatureOutput] = useState<string | null>(null);
 const [verifying, setVerifying] = useState(false);
 const [justGenerated, setJustGenerated] = useState(false);

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
 const now = new Date();
 const isoUtc = now.toISOString();
 const epoch = Math.floor(now.getTime() / 1000);

 const str = `${inputText}-${algo}-${secretKey}-${epoch}`;
 let h1 = 0xdeadbeef, h2 = 0x41c64e6d, h3 = 0x9e3779b9, h4 = 0x1337c0de;
 for (let i = 0; i < str.length; i++) {
 const c = str.charCodeAt(i);
 h1 = Math.imul(h1 ^ c, 2654435761);
 h2 = Math.imul(h2 ^ (c << 3), 1597334677);
 h3 = Math.imul(h3 ^ (c >> 2), 3812015801);
 h4 = Math.imul(h4 ^ (c << 5), 2860486313);
 }
 const hex1 = Math.abs(h1).toString(16).padStart(8, '0').toUpperCase();
 const hex2 = Math.abs(h2).toString(16).padStart(8, '0').toUpperCase();
 const hex3 = Math.abs(h3).toString(16).padStart(8, '0').toUpperCase();
 const hex4 = Math.abs(h4).toString(16).padStart(8, '0').toUpperCase();
 const crc = Math.abs(h1 ^ h2).toString(16).slice(-4).toUpperCase();

 let mockBlock = '';
 if (algo === 'sha256') {
 mockBlock = `▒▒▒▒▒▒▐███████▌
▒▒▒▒▒▒▐░▀░▀░▀░▌
▒▒▒▒▒▒▐▄▄▄▄▄▄▄▌
▄▀▀▀█▒▐░▀▀▄▀▀░▌▒█▀▀▀▄
▌▌▌▌▐▒▄▌░▄▄▄░▐▄▒▌▐▐▐▐

[PGP_CORE_V4] OpenPGP Packet Type 0x02 (Signature Packet)
:: TIMESTAMP : ${isoUtc} (UNIX: ${epoch})
:: HASH_ALGO : SHA-256 (IANA ID: 8) | CIPHER: RSA-4096 (PK_ALGO: 1)
:: ISSUER_KEY_ID : ${pgpKeyId} | SUBPACKET_TAG: 0x10
:: FINGERPRINT : ${pgpFingerprint}
:: KEY_FLAGS : [0x03] Certify, Sign Data, Authenticate
:: CANONICAL_LEN : ${inputText.length} bytes | STATUS: 0x00 OK

-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

${inputText}
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4.4 (GNU/Linux/x86_64-pc-linux-gnu)
Comment: Host node: strat-acad.labib.sec :: Auth Token: ${hex1}

iQIzBAEBCAAdFiEE4F9B8A2C1E5D93B077C48E1A22DF60B39E8C41A2FA${hex1}
w${hex2}+yQe${hex3}v7dK${hex4}qN1a9Z0b${hex1}C5xXw7jRkL1oPqS8t
UvW${hex3}mNoP2qR${hex2}sTuV3wXyZ4aB${hex4}cDeF5gHiJkL6mNoP
qRsT7uVwX8yZ0aBc1dEf2gHi${hex1}3jKl4mNo5pQr6sTu7vWx8yZ
=${crc}
-----END PGP SIGNATURE-----`;
 } else if (algo === 'sha512') {
 mockBlock = `█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█

[PGP_CORE_V4] OpenPGP Packet Type 0x02 (Ed25519/Curve25519 ECC)
:: TIMESTAMP : ${isoUtc} (UNIX: ${epoch})
:: HASH_ALGO : SHA-512 (IANA ID: 10) | CURVE: Ed25519 (OID: 1.3.6.1.4.1.11591.15.1)
:: ISSUER_KEY_ID : ${pgpKeyId} | SUBPACKET_TAG: 0x21
:: FINGERPRINT : ${pgpFingerprint}
:: COMPRESSION : ZLIB (ID: 2) | VERDICT: VALIDATED_CANONICAL
:: PAYLOAD_LEN : ${inputText.length} octets | NONCE: 0x${hex3}${hex4}

-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

${inputText}
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4.4-ecc (Linux-x86_64)
Comment: Labib Ed25519 Identity Token [Signature Subpacket v4]

iQKzBAEBCgAdFiEE${hex1}${hex2}${hex3}${hex4}FA${hex1}00009E8C
${hex4}AABBCCDDEEFF00112233445566778899AABBCCDDEEFF001122334455
66778899${hex2}0102030405060708090A0B0C0D0E0F${hex3}FEEDBEEF
=${crc}
-----END PGP SIGNATURE-----`;
 } else {
 mockBlock = `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████

[HMAC_INTEGRITY_ENGINE] RFC 2104 Keyed-Hashing for Message Authentication
:: TIMESTAMP : ${isoUtc} (Epoch: ${epoch})
:: ALGORITHM : HMAC-SHA256 | BLOCK_SIZE: 64 bytes | DIGEST_SIZE: 32 bytes
:: SECRET_HASH : SHA256("${secretKey.replace(/./g, '*')}") -> 0x${hex1}${hex2}
:: PAYLOAD_SIZE : ${inputText.length} octets
:: INNER_PAD : 0x36 x 64 -> ${hex1}
:: OUTER_PAD : 0x5C x 64 -> ${hex2}
:: MAC_VERDICT : AUTH_OK | 0x00 VERIFICATION_MATCH

HMAC_DIGEST_SIGNATURE:
0x${hex1}${hex2}${hex3}${hex4}${hex2}${hex1}${hex4}${hex3}

VERIFICATION RECORD:
- Key ID : ${pgpKeyId}
- Nonce : 0x${hex4}${hex1}
- Status : MATCH (Constant-Time String Compare: 0 ns delta)`;
 }

 setSignatureOutput(mockBlock);
 setVerifying(false);
 setJustGenerated(true);
 setTimeout(() => setJustGenerated(false), 2500);
 }, 400);
 };

 return (
 <div className="font-sans text-white">
 
 {/* Header */}
 <div>
 <div className="flex items-center space-x-2 text-xs font-mono text-[#a8e6cf] uppercase tracking-wider">
 <i className="ri-key-line text-sm"></i>
 <span>PKI-LAB</span>
 </div>
 <h3 className="text-xl font-bold text-white mt-1">Crypto Sig Sandbox</h3>
 <p className="text-xs text-[#c4c6d0] mt-0.5 mb-[15px]">
 Verify communications integrity using PGP public key and SHA-256 HMAC digester.
 </p>
 </div>

 {/* PGP KEY CARD - Container with bg #21232b */}
 <div className="h-[120px] bg-[#21232b] p-3.5 rounded-2xl border-0 flex flex-col justify-between font-mono text-xs">
 <div className="flex items-center justify-between text-[#8e9199] gap-2 pb-0">
 <div className="flex items-center gap-2.5 flex-wrap">
 <span>GPG PUBLIC KEY ID: <strong className="text-[#a8c7fa]">{pgpKeyId}</strong></span>
 <span className="text-[#a8e6cf] font-bold">ALGO : RSA 4096-BIT / ECC</span>
 </div>
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
 <div className="h-[45px] bg-[#13141a] px-3 py-1.5 rounded-xl border-0 flex items-center">
 <div className="text-[#fdd663] font-mono tracking-tight break-all select-all flex-1 min-w-0 text-xs">
 {pgpFingerprint}
 </div>
 </div>
 </div>

 {/* INTERACTIVE SIGNATURE GENERATOR */}
 <div className="font-mono text-xs mt-[15px] space-y-[15px]">
 {/* Container for Input Form Controls */}
 <div className="bg-[#21232b] p-3.5 rounded-2xl border-0 space-y-3">
          <div className="text-xs font-bold text-[#a8c7fa] flex items-center gap-2">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm shrink-0">
 <i className="ri-archive-stack-line"></i>
 </div>
            <span className="text-[16px]">SIG-DISPATCH</span>
 </div>

 <div>
 <textarea
 rows={2}
 value={inputText}
 placeholder="Message payload to sign..."
 onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: "12px", lineHeight: "12px" }}
            className="w-full h-[45px] leading-[12px] bg-[#13141a] border-0 rounded-xl p-3 text-white !text-[12px] text-[12px] focus:outline-none placeholder:text-[#8e9199] resize-none font-mono"
 />
 </div>

 {/* Digest Algorithm Selection + Generate Button beside HMAC */}
 <div>
 <div className="flex items-center gap-1 bg-[#13141a] p-1 rounded-full border-0 h-[45px] w-full">
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
 className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center text-xs font-mono ${
 algo === item.id
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}

 {/* Generate Signature Button beside HMAC-SHA256 inside capsule */}
 <button
 type="button"
 onClick={handleGenerateSignature}
 disabled={verifying}
 className={`w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full border-0 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
 justGenerated
 ? 'bg-[#a8e6cf] text-[#003923]'
 : 'bg-[#a8c7fa] text-[#00325b] hover:bg-[#c2e7ff]'
 }`}
 title={justGenerated ?"Signature Generated!":"Generate Signature"}
 aria-label={justGenerated ?"Signature Generated!":"Generate Signature"}
 >
 <i
 className={`text-base ${
 verifying
 ? 'ri-loader-4-line animate-spin'
 : justGenerated
 ? 'ri-file-shield-2-line'
 : 'ri-safe-3-line'
 }`}
 ></i>
 </button>
 </div>
 </div>

 <div>
 <input
 type="text"
 value={secretKey}
 placeholder="Passphrase key..."
 onChange={(e) => setSecretKey(e.target.value)}
            style={{ fontSize: "12px" }}
            className="w-full h-[46px] bg-[#13141a] border-0 rounded-xl px-3 py-2.5 text-white !text-[12px] text-[12px] focus:outline-none placeholder:text-[#8e9199] font-mono"
 />
 </div>
 </div>

 {signatureOutput && (
 <div className="p-3 bg-[#21232b] rounded-xl border-0 space-y-2 animate-fadeIn">
 <div className="text-[10px] text-[#a8e6cf] font-bold flex items-center justify-between">
 <span>SIGNATURE BLOCK</span>
 <span className="bg-[#a8e6cf] text-[#003923] px-2.5 py-0.5 rounded-full border-0 font-bold text-[10px]">
 AUTHENTICATED
 </span>
 </div>
 <pre className="text-[12px] leading-[13px] text-[#c4c6d0] bg-[#0f0e13] p-[10px] rounded-lg border-0 whitespace-pre-wrap break-words break-all font-mono overflow-x-hidden">
 {signatureOutput}
 </pre>
 </div>
 )}

 </div>

 </div>
 );
};

