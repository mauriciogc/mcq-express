import {
  SquaresFourIcon as BlockIcon,
  ShuffleIcon,
  SparkleIcon,
  ChatCircleTextIcon as ExplainIcon,
} from '@phosphor-icons/react';
import { FeatureRow } from '../ui/FeatureRow';
import { Switch } from '../ui/Choice';

type Props = {
  settings: {
    blockSize: number;
    shuffleEnabled: boolean;
    allowAIExplain: boolean;
    allowAIAugment: boolean;
    aiAugmentCount?: number;
  };
  setSettings: (updater: (s: Props['settings']) => Props['settings']) => void;
  hasAI: boolean;
};

export default function SetupPanelPretty({
  settings,
  setSettings,
  hasAI,
}: Props) {
  return (
    <div className="p-6 header-card bg-[var(--color-card)]/80 space-y-6 shadow-xl">
      <div>
        <h2 className="text-xl text-[var(--color-text)]">
          Configuración del Quiz
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Define el bloque y mejora con IA
        </p>
      </div>

      <ul className="space-y-4">
        <FeatureRow
          icon={<BlockIcon size={22} />}
          title="Tamaño del bloque"
          desc="Cantidad de preguntas por sesión."
          control={
            <select
              className="w-28 rounded-[var(--radius-lg)] px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--sky-200)]"
              value={settings.blockSize}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  blockSize: Number(e.target.value),
                }))
              }
            >
              {[10, 20, 30, 40, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          }
        />

        <FeatureRow
          icon={<ShuffleIcon size={22} />}
          title="Barajar preguntas"
          desc="Mezcla el orden de las preguntas en cada intento."
          control={
            <Switch
              checked={settings.shuffleEnabled}
              onChange={(v) =>
                setSettings((s) => ({ ...s, shuffleEnabled: v }))
              }
            />
          }
        />

        {hasAI && (
          <FeatureRow
            icon={<ExplainIcon size={22} />}
            title="Explicaciones automáticas con IA"
            desc="Muestra una explicación solo en las respuestas incorrectas al finalizar."
            control={
              <Switch
                checked={settings.allowAIExplain}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, allowAIExplain: v }))
                }
              />
            }
          />
        )}

        {hasAI && (
          <FeatureRow
            icon={<SparkleIcon size={22} />}
            title="Aumentar con IA"
            desc="Genera preguntas nuevas para aumentar tu bloque."
            control={
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.allowAIAugment}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, allowAIAugment: v }))
                  }
                />
                {settings.allowAIAugment && (
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className="w-20 rounded-[var(--radius-lg)] px-3 py-2 bg-[var(--color-card)]
                             border border-[var(--color-border)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--sky-200)]"
                    value={settings.aiAugmentCount ?? 10}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        aiAugmentCount: Number(e.target.value),
                      }))
                    }
                  />
                )}
              </div>
            }
          />
        )}
      </ul>
    </div>
  );
}
