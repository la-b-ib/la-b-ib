import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface Question {
  id: number;
  category: string;
  question: string;
  options: { text: string; points: number; explanation: string }[];
}

export const ArchitectureReadinessQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 1,
      category: 'ZERO-TRUST NETWORKING',
      question: 'How do your internal microservices authenticate traffic between each other?',
      options: [
        { text: 'Unencrypted HTTP over private VPC subnets', points: 0, explanation: 'Internal VPCs are vulnerable to lateral movement if an attacker breaches an edge node.' },
        { text: 'Shared API Keys / Basic Auth headers', points: 10, explanation: 'Static secrets carry significant leak risk and lack automatic rotation.' },
        { text: 'Mutual TLS (mTLS) with automated short-lived X.509 cert rotation', points: 25, explanation: 'Gold Standard. Zero-trust identity established per-request regardless of network locality.' },
      ],
    },
    {
      id: 2,
      category: 'MEMORY & EXPLOIT RESILIENCE',
      question: 'What automated safeguards exist in your CI/CD pipeline against memory leaks & injection vulnerabilities?',
      options: [
        { text: 'Manual code reviews prior to production deployments', points: 5, explanation: 'Human review misses subtle race conditions and memory safety issues.' },
        { text: 'Linters + Basic SAST vulnerability scanners', points: 15, explanation: 'Good baseline, but misses AST-level sanitization and memory corruption vectors.' },
        { text: 'SAST + DAST + AST Sanitizers + ASLR/DEP Kernel safeguards', points: 25, explanation: 'Maximum resilience. Catches memory unsafe paths before binaries reach production.' },
      ],
    },
    {
      id: 3,
      category: 'LOGGING & INCIDENT FORENSICS',
      question: 'If an adversary compromises a production service, where are your audit logs stored?',
      options: [
        { text: 'Standard stdout / log files on the local application server', points: 0, explanation: 'Adversaries overwrite local disk logs immediately upon gaining elevated privileges.' },
        { text: 'Centralized log aggregator (Elasticsearch / CloudWatch)', points: 15, explanation: 'Effective for searchability, but susceptible to deletion if credentials leak.' },
        { text: 'WORM (Write Once Read Many) immutable storage with eBPF kernel event tracking', points: 25, explanation: 'Forensic integrity guaranteed. Logs cannot be tampered with even by root users.' },
      ],
    },
    {
      id: 4,
      category: 'HIGH-AVAILABILITY & FAILOVER',
      question: 'What happens when your primary database region experiences a network outage?',
      options: [
        { text: 'Manual failover procedure managed by on-call engineers', points: 5, explanation: 'Manual failovers incur significant downtime (RTO > 30 minutes).' },
        { text: 'Active-Passive replication with scriptable DNS updates', points: 15, explanation: 'Reasonable, but DNS TTL propagation delays user requests.' },
        { text: 'Multi-Region Active-Active consensus with sub-second health checks', points: 25, explanation: 'Resilient architecture. Continuous sync guarantees < 1s failover.' },
      ],
    },
  ];

  const handleSelect = (questionId: number, optionIndex: number) => {
    soundEngine.play('click');
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCalculateScore = () => {
    soundEngine.play('click');
    setSubmitted(true);
  };

  const handleReset = () => {
    soundEngine.play('click');
    setAnswers({});
    setSubmitted(false);
  };

  const totalScore = Object.entries(answers).reduce((acc, [qId, optIdx]) => {
    const q = questions.find((item) => item.id === Number(qId));
    if (q && typeof optIdx === 'number' && q.options[optIdx]) {
      return acc + q.options[optIdx].points;
    }
    return acc;
  }, 0);

  const getRank = (score: number) => {
    if (score >= 90) return { title: 'ZERO-TRUST FORTRESS', color: '#a8e6cf', desc: 'Your architecture adheres strictly to immutable, defense-in-depth security principles.' };
    if (score >= 60) return { title: 'HARDENED SYSTEM', color: '#a8c7fa', desc: 'Solid defensive foundation with minor operational exposure in logging or failover speed.' };
    if (score >= 30) return { title: 'PERIMETER DEFENDED', color: '#ffb951', desc: 'Relies heavily on edge security. High risk of lateral movement upon internal breach.' };
    return { title: 'VULNERABLE INFRASTRUCTURE', color: '#ff1744', desc: 'Critical security gaps. Requires immediate zero-trust refactoring and log immutability.' };
  };

  const rank = getRank(totalScore);

  return (
    <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#44474f]/60 space-y-6 shadow-2xl font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] uppercase tracking-wider">
            <i className="ri-shield-check-line text-sm"></i>
            <span>ARCHITECTURAL RESILIENCE AUDIT</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">System Security & Zero-Trust Stress Test</h3>
          <p className="text-xs text-[#c4c6d0] mt-0.5">
            Evaluate your infrastructure against Labib Bin Shahed's 4 Architectural Pillars.
          </p>
        </div>

        {submitted && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-[#0f0e13] hover:bg-[#21232b] border border-[#44474f] text-xs font-mono text-[#a8c7fa] rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <i className="ri-refresh-line"></i>
            <span>RE-TAKE AUDIT</span>
          </button>
        )}
      </div>

      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q) => {
            const selectedOpt = answers[q.id];
            return (
              <div key={q.id} className="bg-[#0f0e13] p-4 sm:p-5 rounded-2xl border border-[#44474f]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a8c7fa] font-bold">QUESTION 0{q.id} // {q.category}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">{q.question}</h4>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(q.id, idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#004a77]/40 border-[#a8c7fa] text-white shadow-md'
                            : 'bg-[#1a1b21] border-[#44474f]/50 text-[#c4c6d0] hover:text-white hover:border-[#a8c7fa]/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-white">{opt.text}</div>
                          <div className="text-[11px] text-[#8e9199] font-sans">{opt.explanation}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-[#a8c7fa] bg-[#a8c7fa] text-[#042e60]' : 'border-[#44474f]'
                          }`}
                        >
                          {isSelected && <i className="ri-check-line text-xs font-bold"></i>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleCalculateScore}
            disabled={Object.keys(answers).length < questions.length}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              Object.keys(answers).length === questions.length
                ? 'bg-[#a8c7fa] text-[#042e60] hover:bg-[#c2e7ff] shadow-xl'
                : 'bg-[#21232b] text-[#8e9199] border border-[#44474f]/40 cursor-not-allowed'
            }`}
          >
            <i className="ri-calculator-line text-base"></i>
            <span>
              {Object.keys(answers).length === questions.length
                ? 'COMPUTE ARCHITECTURAL RESILIENCE SCORE'
                : `ANSWER ALL QUESTIONS (${Object.keys(answers).length}/${questions.length})`}
            </span>
          </button>
        </div>
      ) : (
        /* AUDIT RESULTS REPORT */
        <div className="bg-[#0f0e13] p-6 rounded-2xl border border-[#a8c7fa]/50 space-y-6 animate-fadeIn font-mono">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1a1b21] p-5 rounded-xl border border-[#44474f]">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs text-[#8e9199]">EVALUATED AUDIT RATING:</span>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: rank.color }}>
                {rank.title}
              </div>
              <p className="text-xs text-[#c4c6d0] max-w-lg font-sans">{rank.desc}</p>
            </div>

            <div className="text-center bg-[#0f0e13] px-6 py-4 rounded-xl border border-[#44474f]/50">
              <div className="text-xs text-[#8e9199]">RESILIENCE INDEX</div>
              <div className="text-4xl font-extrabold text-white mt-1">
                {totalScore} <span className="text-xs text-[#8e9199]">/ 100</span>
              </div>
            </div>
          </div>

          {/* Breakdown Per Question */}
          <div className="space-y-3">
            <h4 className="text-xs text-[#a8c7fa] uppercase font-bold">DETAILED RECOMMENDATIONS BREAKDOWN</h4>
            {questions.map((q) => {
              const userOptIdx = answers[q.id];
              const userOpt = typeof userOptIdx === 'number' && q.options[userOptIdx] ? q.options[userOptIdx] : q.options[0];
              return (
                <div key={q.id} className="p-3.5 bg-[#1a1b21] rounded-xl border border-[#44474f]/40 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white font-bold">
                    <span>{q.category}</span>
                    <span className="text-[#a8e6cf]">+{userOpt.points} PTS</span>
                  </div>
                  <div className="text-xs text-[#c4c6d0] font-sans">
                    <span className="text-[#8e9199]">Selected:</span> {userOpt.text}
                  </div>
                  <div className="text-[11px] text-[#a8c7fa] font-sans italic">
                    💡 Recommendation: {userOpt.explanation}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
