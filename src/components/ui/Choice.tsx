// src/components/ui/Choice.tsx
'use client';
import React from 'react';
import { CheckIcon, CircleIcon } from '@phosphor-icons/react';

type BaseProps = {
  label?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

type CheckboxProps = BaseProps;

type RadioProps = BaseProps & {
  name: string;
  onChange: () => void;
};

type SwitchProps = BaseProps;

const baseLabel =
  'flex items-center gap-2 cursor-pointer select-none rounded-[var(--radius-xl)] px-4 py-3 transition-colors focus-within:outline-none';

const selectedCls =
  'bg-[var(--sky-400)] text-[var(--color-text)] border-transparent';
const unselectedCls =
  'text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--sky-400)]/10';

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label
      className={[
        baseLabel,
        'border',
        checked ? selectedCls : unselectedCls,
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className ?? '',
      ].join(' ')}
    >
      <input
        type="checkbox"
        className="sr-only"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={[
          'inline-flex h-5 w-5 items-center justify-center rounded-sm border text-[11px]',
          checked
            ? 'bg-white/20 border-white/70 text-white'
            : 'border-[var(--color-border)] bg-transparent',
        ].join(' ')}
        aria-hidden="true"
      >
        {checked ? <CheckIcon size={12} weight="bold" /> : null}
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function Radio({
  checked,
  onChange,
  label,
  name,
  disabled,
  className,
}: RadioProps) {
  return (
    <label
      className={[
        baseLabel,
        'border',
        checked ? selectedCls : unselectedCls,
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className ?? '',
      ].join(' ')}
    >
      <input
        type="radio"
        className="sr-only"
        name={name}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span
        className={[
          'inline-flex h-5 min-w-5 items-center justify-center rounded-full border text-[11px]',
          checked
            ? 'bg-white/20 border-white/70 text-white'
            : 'border-[var(--color-border)] bg-transparent',
        ].join(' ')}
        aria-hidden="true"
      >
        {/* círculo relleno cuando está seleccionado */}
        {checked ? <CircleIcon size={10} weight="fill" /> : null}
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function Switch({ checked, onChange }: SwitchProps) {
  const clsChecked = checked
    ? 'bg-[var(--lilac-400)]'
    : 'bg-[var(--lilac-100)]';
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${clsChecked}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition
        ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
}
