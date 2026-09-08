cat << 'INNER_EOF' >> src/components/TerminalModal.tsx
                  }
                  return (
                    <div key={idx} className="whitespace-pre-wrap">
                      {prefix}
                      <span className="opacity-90">{rest}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div ref={bottomRef}></div>
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1b21] px-[15px] h-[45px] border-t border-[#44474f]/30 flex items-center gap-2 sm:gap-3">
          <span className="text-[#a8c7fa] font-mono font-semibold text-[12px] leading-[12px] flex items-center shrink-0 gap-1.5">
            <span className="text-[#8e9199] hidden sm:inline">node-{String(cmdHistory.length).padStart(2, '0')}:~</span>
            <i className="ri-money-dollar-box-line text-[16px] text-[#a8c7fa]"></i>
          </span>
          <div className="relative flex-1 flex items-center h-full">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setHistoryIdx(-1);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Type Command"
              className="w-full bg-transparent border-none text-white font-mono text-[12px] leading-[12px] focus:outline-none placeholder:text-[#8e9199] placeholder:text-[12px] placeholder:leading-[12px] min-h-[36px] z-10"
            />
            {ghostText && inputVal.trim() && (
              <span className="absolute left-0 pointer-events-none font-mono text-[12px] leading-[12px] text-[#44474f] whitespace-pre min-h-[36px] flex items-center">
                <span className="opacity-0">{inputVal}</span>
                <span>{ghostText}</span>
                <span className="ml-2 text-[9px] leading-[9px] text-[#a8c7fa]/60 bg-[#004a77]/30 px-1 py-0.5 rounded border border-[#a8c7fa]/20 hidden md:inline">
                  [TAB]
                </span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute top-2 right-4 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={copyTerminalLogs}
          className={`h-7 px-3 rounded text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 ${isCopied ? 'bg-[#a8e6cf]/20 text-[#a8e6cf] border border-[#a8e6cf]/30' : 'bg-[#1a1b21] text-[#a8c7fa] border border-[#a8c7fa]/20 hover:bg-[#a8c7fa]/10'}`}
        >
          <i className={isCopied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
          {isCopied ? 'COPIED' : 'COPY LOGS'}
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.play('click');
            setIsMaximized(!isMaximized);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="h-7 w-7 rounded bg-[#1a1b21] text-[#a8c7fa] border border-[#a8c7fa]/20 flex items-center justify-center hover:bg-[#a8c7fa]/10 transition-all"
        >
          <i className={isMaximized ? 'ri-fullscreen-exit-line text-[14px]' : 'ri-fullscreen-line text-[14px]'}></i>
        </button>
      </div>
    </section>
  );
};
INNER_EOF
