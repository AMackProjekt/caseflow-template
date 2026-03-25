"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface TourStep {
  target: string; // CSS selector, e.g. '[data-tour="staff-dashboard"]'
  title: string;
  body: string;
  placement?: "right" | "left" | "top" | "bottom";
}

interface Props {
  steps: TourStep[];
  onComplete: () => void;
}

const BUBBLE_W = 292;
const GAP = 14;

export default function OnboardingTour({ steps, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = steps[current];
  const placement = step.placement ?? "right";

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(step.target);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step.target]);

  useEffect(() => {
    const t = setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  const next = () => {
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else onComplete();
  };

  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  if (!rect) return null;

  // Compute bubble position
  let top = 0;
  let left = 0;
  if (placement === "right") {
    top = Math.max(8, rect.top + rect.height / 2 - 110);
    left = rect.right + GAP;
  } else if (placement === "left") {
    top = Math.max(8, rect.top + rect.height / 2 - 110);
    left = rect.left - BUBBLE_W - GAP;
  } else if (placement === "bottom") {
    top = rect.bottom + GAP;
    left = Math.max(8, rect.left + rect.width / 2 - BUBBLE_W / 2);
  } else {
    // top
    top = Math.max(8, rect.top - GAP - 200);
    left = Math.max(8, rect.left + rect.width / 2 - BUBBLE_W / 2);
  }

  return (
    <>
      {/* Dim overlay — pointer-events-none keeps page interactive */}
      <div className="fixed inset-0 z-[180] bg-slate-900/50 pointer-events-none" />

      {/* Spotlight ring around target element */}
      <div
        className="fixed z-[181] rounded-xl pointer-events-none transition-all duration-300"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          boxShadow: "0 0 0 3px #14b8a6, 0 0 0 8px rgba(20,184,166,0.25)",
        }}
      />

      {/* Tooltip bubble */}
      <div
        className="fixed z-[182] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in fade-in zoom-in-95 duration-200"
        style={{ top, left, width: BUBBLE_W }}
      >
        {/* Arrow */}
        {placement === "right" && (
          <div className="absolute -left-[7px] top-8 w-3.5 h-3.5 bg-white border-l border-b border-slate-200 rotate-45" />
        )}
        {placement === "left" && (
          <div className="absolute -right-[7px] top-8 w-3.5 h-3.5 bg-white border-r border-t border-slate-200 rotate-45" />
        )}
        {placement === "bottom" && (
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-l border-t border-slate-200 rotate-45" />
        )}
        {placement === "top" && (
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r border-b border-slate-200 rotate-45" />
        )}

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
            Step {current + 1} of {steps.length}
          </span>
          <button
            onClick={onComplete}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.body}</p>

        {/* Progress dots — clickable */}
        <div className="flex gap-1.5 justify-center mb-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "w-5 bg-teal-500" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          {current > 0 && (
            <button
              onClick={prev}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
          >
            {current === steps.length - 1 ? (
              "Got it! ✓"
            ) : (
              <>
                Next <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
