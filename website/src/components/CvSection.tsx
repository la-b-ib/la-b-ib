import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { soundEngine } from '../utils/soundEngine';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

const CV_URL = 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/CV/cv.pdf';

export const CvSection: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resizeTrigger, setResizeTrigger] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Resize listener for responsive canvas scaling
  useEffect(() => {
    const handleResize = () => {
      setResizeTrigger((prev) => prev + 1);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  // Load PDF document using PDF.js
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: CV_URL,
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });
        const doc = await loadingTask.promise;
        if (!isMounted) return;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error loading PDF with PDF.js:', err);
        if (isMounted) {
          setLoadError(err?.message || 'Failed to load PDF preview');
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, []);

  // Render active page to canvas
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || isLoading) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDocRef.current!.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const containerWidth = containerRef.current?.clientWidth || 600;
        const unscaledViewport = page.getViewport({ scale: 1.0 });

        // Calculate scale to fit container width cleanly with padding
        const dpr = window.devicePixelRatio || 1;
        const fitScale = (containerWidth - 16) / unscaledViewport.width;
        const baseScale = Math.max(fitScale, 0.5);

        const viewport = page.getViewport({ scale: baseScale * dpr });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [currentPage, numPages, isLoading, resizeTrigger]);

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.play('click');
    setIsPressed(true);

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 4000);

    try {
      const response = await fetch(CV_URL);
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
      const link = document.createElement('a');
      link.href = CV_URL;
      link.download = 'Labib_Bin_Shahed_CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrevPage = () => {
    soundEngine.play('click');
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    soundEngine.play('click');
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div id="cv" className="space-y-[15px]">
      {/* Resume Header Container */}
      <div
        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', height: 'auto' }}
        className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex items-center justify-between gap-3 h-auto"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="rounded-[8px] bg-[#a8c7fa] text-[#00325b] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0"
            style={{ width: '32.9948px', height: '32.9948px' }}
          >
            <i className="ri-file-text-line"></i>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-[16px] leading-[20px] font-bold text-white truncate">
              Resume
            </h3>
            <div className="text-[13px] leading-[16px] text-[#a8c7fa] font-semibold mt-0.5">
              Labib Bin Shahed
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.play('click')}
            className="w-[32px] h-[32px] rounded-[8px] bg-[#000000] text-[#a8c7fa] border border-[#44474f]/40 shadow-sm flex items-center justify-center text-base font-bold shrink-0 cursor-pointer hover:text-white transition-colors"
            title="Open PDF in New Tab"
            aria-label="Open PDF in New Tab"
          >
            <i className="ri-external-link-line"></i>
          </a>

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

      {/* PDF.js Resume Preview Container */}
      <div
        ref={containerRef}
        className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col items-center gap-3 overflow-hidden shadow-md"
        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
      >
        {/* Pagination & Viewer Bar */}
        {numPages > 1 && (
          <div
            className="w-full bg-[#000000] border border-[#44474f]/30 rounded-xl px-3 py-1.5 flex items-center justify-between font-mono text-[12px] text-[#a8c7fa]"
            style={{ height: '36px' }}
          >
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={handlePrevPage}
              className="px-2 py-0.5 rounded bg-[#21232b] text-[#c4c6d0] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-s-line align-middle mr-1"></i>PREV
            </button>

            <span className="font-semibold text-white tracking-wider text-[12px]">
              PAGE {currentPage} / {numPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= numPages}
              onClick={handleNextPage}
              className="px-2 py-0.5 rounded bg-[#21232b] text-[#c4c6d0] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-semibold transition-colors cursor-pointer"
            >
              NEXT<i className="ri-arrow-right-s-line align-middle ml-1"></i>
            </button>
          </div>
        )}

        {/* Canvas Display Frame */}
        <div
          className="w-full bg-[#000000] border border-[#44474f]/30 rounded-xl p-0 flex flex-col items-center justify-center min-h-[300px] overflow-auto"
          style={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px', paddingBottom: '0px' }}
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-[#a8c7fa] font-mono">
              <i className="ri-loader-4-line text-2xl animate-spin text-[#a8c7fa]"></i>
              <span className="text-[12px] uppercase tracking-wider">Rendering PDF Document...</span>
            </div>
          )}

          {loadError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
              <i className="ri-error-warning-line text-2xl text-[#ffb4ab]"></i>
              <p className="text-[12px] text-[#ffb4ab] font-mono">{loadError}</p>
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#a8c7fa] text-[#00325b] font-mono text-[12px] font-bold"
              >
                Open Direct PDF
              </a>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={`max-w-full rounded-lg shadow-sm block transition-opacity duration-300 ${
              isLoading || loadError ? 'hidden' : 'opacity-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
