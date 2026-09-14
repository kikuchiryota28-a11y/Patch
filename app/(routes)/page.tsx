'use client';
import { Timeline } from '@/components/Timeline';
import { useI18n } from '@/components/I18nProvider';

export default function HomePage(){
  const { t } = useI18n();
  return <main className="min-h-screen"><div className="mx-auto max-w-5xl px-5 pb-24 pt-10 md:px-10 md:pt-14"><section className="mb-9"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>{t('home.live')}</div><h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">{t('home.headline')}<br/><span className="text-zinc-500">{t('home.subheadline')}</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">{t('home.intro')}</p></section><Timeline/></div></main>;
}
