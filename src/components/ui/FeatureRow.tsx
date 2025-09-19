'use client';
import React from 'react';

export function FeatureRow({
  icon,
  title,
  desc,
  control,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  control?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-100/60 flex items-center justify-center ">
          <span className="text-[var(--color-text)]/80">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {title}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{desc}</p>
        </div>
      </div>
      {control ? <div className="shrink-0">{control}</div> : null}
    </li>
  );
}
