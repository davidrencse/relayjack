type Props = { loading?: boolean; error?: string | null; empty?: boolean; emptyText?: string; onRetry?: () => void; children: React.ReactNode };

export default function StatusView({ loading, error, empty, emptyText = 'No records found.', onRetry, children }: Props) {
  if (loading) return <div className='rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300'>Loading live backend data…</div>;
  if (error) return <div className='rounded-2xl border border-rose-900/70 bg-rose-950/40 p-6'><p className='font-semibold text-rose-100'>{error}</p>{onRetry && <button onClick={onRetry} className='focus-ring mt-4 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white'>Retry</button>}</div>;
  if (empty) return <div className='rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300'>{emptyText}</div>;
  return <>{children}</>;
}
