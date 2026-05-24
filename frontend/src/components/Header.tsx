import type { OperatorSession } from '../types';

const nav = [
  ['dashboard', 'Dashboard'],
  ['allowlist', 'Allowlist'],
  ['jobs', 'Jobs'],
  ['plugins', 'Plugins'],
  ['audit', 'Audit'],
  ['exports', 'Exports'],
  ['settings', 'Settings'],
  ['docs', 'Docs']
];

type Props = { page: string; setPage: (page: string) => void; session: OperatorSession | null; online: boolean; wsState: string; };

export default function Header({ page, setPage, session, online, wsState }: Props) {
  return <header className='sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur'>
    <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
      <div>
        <button onClick={() => setPage('dashboard')} className='focus-ring text-left text-2xl font-black tracking-tight text-white'>RelayJack</button>
        <p className='text-sm text-slate-400'>Scoped operator console for approved internal assessment workflows.</p>
      </div>
      <div className='flex flex-wrap items-center gap-2 text-sm'>
        <span className={`rounded-full px-3 py-1 ring-1 ${online ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/30' : 'bg-amber-500/10 text-amber-200 ring-amber-400/30'}`}>{online ? 'API online' : 'Offline / backend unavailable'}</span>
        <span className='rounded-full bg-slate-800 px-3 py-1 text-slate-200 ring-1 ring-slate-700'>WS {wsState}</span>
        {session && <span className='rounded-full bg-sky-500/10 px-3 py-1 text-sky-200 ring-1 ring-sky-400/30'>{session.displayName} · {session.role}</span>}
      </div>
    </div>
    <nav className='mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4'>
      {nav.map(([key, label]) => <button key={key} onClick={() => setPage(key)} className={`focus-ring whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${page === key ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>{label}</button>)}
    </nav>
  </header>;
}
