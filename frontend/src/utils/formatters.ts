export function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function statusClass(status?: string): string {
  switch (status) {
    case 'approved':
    case 'ready':
    case 'completed':
    case 'running':
      return 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30';
    case 'queued':
    case 'paused':
    case 'validating':
      return 'bg-amber-500/15 text-amber-200 ring-amber-400/30';
    case 'revoked':
    case 'terminated':
    case 'failed':
      return 'bg-rose-500/15 text-rose-200 ring-rose-400/30';
    default:
      return 'bg-slate-500/15 text-slate-200 ring-slate-400/30';
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
