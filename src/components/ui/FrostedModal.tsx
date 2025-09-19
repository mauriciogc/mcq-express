// components/FrostedModal.tsx
import React from 'react';

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode; // opcional
  position?: 'center' | 'bottom'; // default: 'center'
};

export function FrostedModal({
  title,
  description,
  icon,
  position = 'center',
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm h-full"
      aria-hidden="true"
    >
      <div
        className={`pointer-events-auto ${
          position === 'center'
            ? 'fixed inset-0 flex items-center justify-center p-4'
            : 'fixed left-1/2 -translate-x-1/2 bottom-6 w-full max-w-lg px-4'
        }`}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-[var(--color-card)]/80 backdrop-blur-xl border border-white/20 shadow-2xl p-4 sm:p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col items-center">
            {icon && (
              <div className="rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}

            <h3 className="text-[var(--color-text)] font-semibold text-base sm:text-[17px] truncate">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
