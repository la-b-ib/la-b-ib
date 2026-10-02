import React, { useState, useEffect } from 'react';

interface DesktopRequestScreenProps {
  latency?: number;
}

export const DesktopRequestScreen: React.FC<DesktopRequestScreenProps> = ({ latency = 14 }) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://la-b-ib.github.io');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=13-14-1a&color=a8-c7-fa&margin=8`;

  return (
    <div
      role="region"
      aria-label="Desktop Mobile-Only Notice"
      className="fixed inset-0 z-[9999] bg-[#060608] text-[#e3e2e6] flex flex-col justify-start select-none overflow-y-auto font-mono"
      style={{
        backgroundColor: '#060608',
        backgroundImage: "url('/textures/diamond-pyramid.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '32px 32px',
        borderColor: '#ff793f',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '8px',
        paddingBottom: '8px',
      }}
    >
      {/* Subtle Ambient Vignette Lighting over the 3D Textured Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15),rgba(0,0,0,0.55))] pointer-events-none" />

      {/* Main Content Area: Merged Single Unified Container anchored at top with 8px gap to screen edge */}
      <main className="relative z-10 mt-0 mb-auto w-full flex items-center justify-center p-0 m-0">
        {/* Merged Unified Container holding both Author Info and Scan QR */}
        <div
          className="w-full rounded-3xl shadow-2xl flex flex-row-reverse items-center justify-between relative group overflow-hidden"
          style={{
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            minHeight: '220px',
            height: 'auto',
            lineHeight: '16px',
            borderWidth: '0px',
            backgroundColor: '#21232b',
          }}
        >
          {/* WhatsApp-style Doodle Pattern Background Layer (faded) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.075] bg-repeat"
            style={{
              backgroundImage: "url('/textures/whatsapp-doodle.svg')",
              backgroundSize: '280px 280px',
            }}
            aria-hidden="true"
          />

          {/* RIGHT SECTION: Scan QR with vertical separator bar (2px thick) */}
          <div
            className="flex flex-col items-center justify-center shrink-0 self-stretch my-2 pl-2.5 border-l-2 border-[#44474f]/50"
            style={{
              width: '122px',
              paddingRight: '0px',
              borderLeftWidth: '2px',
            }}
          >
            {/* QR Code (effect removed) */}
            <div
              className="relative bg-[#090b10] rounded-xl border-0 overflow-hidden flex items-center justify-center shrink-0 shadow-inner"
              style={{
                width: '110px',
                height: '110px',
                paddingLeft: '0px',
                paddingRight: '0px',
                paddingTop: '0px',
                paddingBottom: '0px',
              }}
            >
              <img
                src={qrUrl}
                alt="Scan to open on smartphone"
                width={110}
                height={110}
                className="w-[110px] h-[110px] block relative z-10"
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '0px',
                }}
                loading="lazy"
              />
            </div>

            {/* Headline and text positioned UNDER the QR Code */}
            <div className="pt-2 text-center w-full">
              <h1
                className="font-black font-sans tracking-tight text-center"
                style={{
                  color: '#c23616',
                  fontSize: '25px',
                  lineHeight: '25px',
                }}
              >
                Scan QR
              </h1>
              <p
                className="text-[#8e9199] mx-auto font-sans mt-0.5"
                style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  lineHeight: '18px',
                }}
              >
                Mobile 1st
              </p>
            </div>
          </div>

          {/* LEFT SECTION: Details About Person of this Portfolio */}
          <div
            className="flex-1 min-w-0 flex flex-col justify-center self-stretch gap-2.5 pr-2.5"
            style={{
              paddingRight: '10px',
            }}
          >
            {/* Header Profile Info */}
            <div className="flex items-center gap-3.5">
              <img
                src="https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/intel/intel.JPG"
                alt="Labib Bin Shahed"
                className="object-cover shrink-0 shadow-md"
                style={{
                  width: '230px',
                  height: '110px',
                  borderRadius: '8px',
                }}
              />
              <div className="space-y-1 min-w-0">
                <h2
                  className="font-black font-sans text-white tracking-tight leading-tight"
                  style={{ fontSize: '25px', lineHeight: '25px' }}
                >
                  Labib Bin Shahed
                </h2>
                <p
                  className="font-mono"
                  style={{
                    color: '#a8c7fa',
                    fontSize: '16px',
                    lineHeight: '20px',
                  }}
                >
                  Programmer | Developer
                </p>

                {/* 4 Social Icons placed under Programmer | Developer (GitHub, LinkedIn, Twitter, Reddit) */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://github.com/la-b-ib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#000000] text-white flex items-center justify-center text-sm hover:opacity-80 transition-opacity"
                    style={{ width: '35px', height: '35px' }}
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <i className="ri-github-line text-lg"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/la-b-ib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#0a66c2] text-white flex items-center justify-center text-sm hover:opacity-80 transition-opacity"
                    style={{ width: '35px', height: '35px' }}
                    title="LinkedIn"
                    aria-label="LinkedIn"
                  >
                    <i className="ri-linkedin-box-line text-lg"></i>
                  </a>
                  <a
                    href="https://x.com/la_b_ib_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#1da1f2] text-white flex items-center justify-center text-sm hover:opacity-80 transition-opacity"
                    style={{ width: '35px', height: '35px' }}
                    title="Twitter"
                    aria-label="Twitter"
                  >
                    <i className="ri-twitter-line text-lg"></i>
                  </a>
                  <a
                    href="https://www.reddit.com/u/la-b-ib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#ff4500] text-white flex items-center justify-center text-sm hover:opacity-80 transition-opacity"
                    style={{ width: '35px', height: '35px' }}
                    title="Reddit"
                    aria-label="Reddit"
                  >
                    <i className="ri-reddit-line text-lg"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Bio Description - Showing Full Text without any truncation */}
            <div>
              <p
                className="text-[#c4c6d0] font-sans leading-relaxed"
                style={{ fontSize: '15px', lineHeight: '20px' }}
              >
                CSE @ BRACU | Cybersecurity & Digital Forensics | Research, OSINT & Threat Intelligence | Security Tooling
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

