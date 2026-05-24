import { useState } from 'react';
import { api } from '../api/client';
import type { OperatorRole, OperatorSession } from '../types';

type Props = { onSession: (session: OperatorSession) => void };

export default function ConsentBanner({ onSession }: Props) {
  const [operatorId, setOperatorId] = useState('operator-local');
  const [displayName, setDisplayName] = useState('Local Operator');
  const [role, setRole] = useState<OperatorRole>('operator');
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    if (!operatorId.trim() || !displayName.trim()) return setError('Operator ID and display name are required.');
    if (!checked) return setError('Acknowledgement is required before sensitive actions are enabled.');
    setLoading(true);
    try {
      const res = await api.acknowledge({ operatorId, displayName, role, consentAcknowledged: true, acknowledgedAt: new Date().toISOString() });
      localStorage.setItem('relayjack.session', JSON.stringify(res.session));
      onSession(res.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to acknowledge session.');
    } finally {
      setLoading(false);
    }
  }

  return <section className='rounded-3xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-2xl shadow-black/30'>
    <h2 className='text-xl font-bold text-amber-100'>Authorized-use acknowledgement</h2>
    <p className='mt-2 text-sm leading-6 text-amber-50/80'>Sensitive job, plugin, and shutdown actions are gated until the operator confirms authorization and the backend returns effective permissions. The console only submits requests to backend scope-enforcement routes.</p>
    <div className='mt-4 grid gap-3 md:grid-cols-3'>
      <label className='text-sm text-slate-200'>Operator ID<input className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white' value={operatorId} onChange={(e) => setOperatorId(e.target.value)} /></label>
      <label className='text-sm text-slate-200'>Display name<input className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white' value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></label>
      <label className='text-sm text-slate-200'>Requested role<select className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white' value={role} onChange={(e) => setRole(e.target.value as OperatorRole)}><option value='viewer'>viewer</option><option value='operator'>operator</option><option value='admin'>admin</option></select></label>
    </div>
    <label className='mt-4 flex gap-3 text-sm text-slate-200'><input type='checkbox' checked={checked} onChange={(e) => setChecked(e.target.checked)} /> I confirm I am operating within an explicit approved target allowlist and understand backend validation may reject out-of-scope actions.</label>
    {error && <p className='mt-3 text-sm text-rose-200'>{error}</p>}
    <button disabled={loading} onClick={submit} className='focus-ring mt-4 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950'>{loading ? 'Submitting…' : 'Acknowledge with backend'}</button>
  </section>;
}
