'use client';

import type { ContributionDay } from '@/lib/types';

export function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
  const values = new Map(days.map(day => [day.day, day.contributions]));
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());
  const cells: { key:string; count:number }[] = [];
  for (let i=0;i<371;i++) { const d=new Date(start); d.setDate(start.getDate()+i); const key=d.toISOString().slice(0,10); cells.push({key,count:values.get(key)??0}); }
  function tone(count:number){if(count===0)return 'bg-white/5';if(count===1)return 'bg-emerald-950';if(count<=3)return 'bg-emerald-800';if(count<=6)return 'bg-emerald-600';return 'bg-emerald-400';}
  return <section><div className="mb-4"><h2 className="text-lg font-bold">Contributions</h2><p className="mt-1 text-xs text-white/30">Issues, Patches and official merges over the last year.</p></div><div className="overflow-x-auto rounded-3xl border border-white/8 bg-white/[0.02] p-4"><div className="grid min-w-max grid-flow-col grid-rows-7 gap-1">{cells.map(cell=><div key={cell.key} title={`${cell.key} · ${cell.count}`} className={`h-3 w-3 rounded-[3px] ${tone(cell.count)}`}/>)}</div></div></section>;
}
