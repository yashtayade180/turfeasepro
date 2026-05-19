import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface TourStep {
  mobileTarget?: string;
  desktopTarget?: string;
  placement?: 'top' | 'bottom' | 'center';
  title: string;
  content: string;
}

interface Props {
  steps: TourStep[];
  run: boolean;
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

function findVisibleEl(selectors: (string | undefined)[]): Element | null {
  for (const sel of selectors) {
    if (!sel) continue;
    const els = document.querySelectorAll(sel);
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return els[i];
    }
  }
  return null;
}

const TW = 320; // tooltip width

export const TourOverlay: React.FC<Props> = ({
  steps, run, stepIndex, onNext, onBack, onSkip, onFinish,
}) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[stepIndex];

  useEffect(() => {
    if (!run || !step) return;
    const isCentered = !step.mobileTarget && !step.desktopTarget;
    if (isCentered) { setRect(null); return; }

    const update = () => {
      const el = findVisibleEl([step.mobileTarget, step.desktopTarget]);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex, step?.mobileTarget, step?.desktopTarget]);

  // Lock scroll while tour is open
  useEffect(() => {
    if (run) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [run]);

  if (!run || !step) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const isCentered = !rect;

  // Spotlight geometry
  const cx = rect ? rect.left + rect.width / 2 : 0;
  const cy = rect ? rect.top + rect.height / 2 : 0;
  const cr = rect ? Math.max(rect.width, rect.height) / 2 + 22 : 0;

  const overlayBg = isCentered
    ? 'rgba(0,0,0,0.58)'
    : `radial-gradient(circle at ${cx}px ${cy}px, transparent ${cr}px, rgba(0,0,0,0.62) ${cr + 14}px)`;

  // Tooltip position
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const safeLeft = Math.max(16, Math.min(cx - TW / 2, vw - TW - 16));

  let tipStyle: React.CSSProperties;
  if (isCentered) {
    tipStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: Math.min(340, vw - 32),
      zIndex: 10002,
    };
  } else if (rect && (cy > vh * 0.62 || step.placement === 'top')) {
    // tooltip above target
    tipStyle = {
      position: 'fixed',
      bottom: vh - rect.top + 14,
      left: safeLeft,
      width: Math.min(TW, vw - 32),
      zIndex: 10002,
    };
  } else {
    // tooltip below target
    tipStyle = {
      position: 'fixed',
      top: rect ? rect.bottom + 14 : 0,
      left: safeLeft,
      width: Math.min(TW, vw - 32),
      zIndex: 10002,
    };
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: overlayBg,
          zIndex: 10000,
          transition: 'background 0.35s ease',
          backdropFilter: isCentered ? 'blur(3px)' : undefined,
        }}
      />

      {/* Step 1 — centered welcome card */}
      {isFirst ? (
        <div style={tipStyle}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text mb-2">
                {step.title}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-dark-muted leading-relaxed">
                {step.content}
              </p>
            </div>
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={onNext}
                className="w-full py-3.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all"
              >
                Next →
              </button>
              <button
                onClick={onSkip}
                className="w-full py-2 text-sm text-neutral-400 hover:text-neutral-500 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Steps 2–N — floating tooltip */
        <div style={tipStyle}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-dark-text mb-1.5">
              {step.title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-dark-muted leading-relaxed mb-4">
              {step.content}
            </p>

            <div className="flex items-center justify-between gap-2">
              {/* Step dots */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === stepIndex ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === stepIndex ? '#7c3aed' : '#e5e7eb',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onBack}
                  className="px-3 py-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={isLast ? onFinish : onNext}
                  className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 active:scale-95 transition-all"
                >
                  {isLast ? 'Finish 🎉' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};
