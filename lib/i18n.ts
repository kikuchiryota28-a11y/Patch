import {dictionary,type Language} from '@/lib/dictionary';

export const messages={
 en:{live:dictionary.en.home.live,headline:dictionary.en.home.title,subheadline:dictionary.en.home.subtitle,intro:dictionary.en.home.intro,feedLanguage:'Feed language',all:'ALL',patches:dictionary.en.home.patches,patch:dictionary.en.home.patch,seeRewrites:dictionary.en.home.seeRewrites,postIssue:dictionary.en.nav.post,hallOfFame:dictionary.en.nav.hall,submitPatch:dictionary.en.issue.submitPatch,report:dictionary.en.issue.report,bookmark:'Bookmark'},
 ja:{live:dictionary.ja.home.live,headline:dictionary.ja.home.title,subheadline:dictionary.ja.home.subtitle,intro:dictionary.ja.home.intro,feedLanguage:'フィードの言語',all:'すべて',patches:dictionary.ja.home.patches,patch:dictionary.ja.home.patch,seeRewrites:dictionary.ja.home.seeRewrites,postIssue:dictionary.ja.nav.post,hallOfFame:dictionary.ja.nav.hall,submitPatch:dictionary.ja.issue.submitPatch,report:dictionary.ja.issue.report,bookmark:'保存'},
} as const;

export type Locale=Language;
export function getLocaleFromCookie(value:string|undefined):Locale{return value==='ja'?'ja':'en'}
