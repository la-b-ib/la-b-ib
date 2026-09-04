import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const CvSection: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.play('click');
    setIsPressed(true);

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 4000);

    const cvUrl = 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/CV/cv.pdf';

    try {
      const response = await fetch(cvUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Labib_Bin_Shahed_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct link fallback
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = 'Labib_Bin_Shahed_CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div id="cv" className="pt-4">
      {/* Resume Container */}
      <div
        className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
            <i className="ri-file-text-line"></i>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-[16px] leading-[20px] font-bold text-white truncate">
              Resume
            </h3>
            <div className="text-[12px] leading-[15px] text-[#a8c7fa] font-semibold mt-0.5">
              Labib Bin Shahed
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className={`w-[32px] h-[32px] rounded-[8px] border-0 shadow-sm flex items-center justify-center text-base font-bold shrink-0 cursor-pointer focus:outline-none transition-colors ${
            isPressed
              ? 'bg-[#a8e6cf] text-[#003923]'
              : 'bg-[#a8c7fa] text-[#00325b]'
          }`}
          title="Download Resume"
          aria-label="Download Resume"
        >
          <i className="text-lg ri-archive-stack-line"></i>
        </button>
      </div>
    </div>
  );
};
