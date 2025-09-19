export function FriendlySummary({
  total,
  baseCount,
  aiCount,
  blockSize,
  shuffleEnabled,
  allowAIExplain,
}: {
  total: number;
  baseCount: number;
  aiCount?: number;
  blockSize: number;
  shuffleEnabled: boolean;
  allowAIExplain: boolean;
}) {
  return (
    <p className="text-xs leading-relaxed text-[var(--color-muted)]">
      Tienes un total de{' '}
      <span className="font-bold text-[var(--lilac-600)]"> {total}</span>{' '}
      preguntas
      {aiCount ? (
        <>
          . Donde <span className="font-bold">{baseCount}</span> son de la base
          y <span className="font-bold">{aiCount} generadas con IA</span>
        </>
      ) : null}
      . Se mostrarán en bloques de{' '}
      <span className="font-bold">{blockSize}</span> preguntas,{' '}
      {shuffleEnabled ? (
        <span className="font-bold">mezcladas aleatoriamente.</span>
      ) : (
        <span className="">sin mezclar.</span>
      )}
      {allowAIExplain ? (
        <>
          {' '}
          <span className="text-[var(--accent-600)] font-bold">
            Al finalizar, verás explicaciones generadas por IA en las respuestas
            incorrectas.
          </span>
        </>
      ) : null}
    </p>
  );
}
