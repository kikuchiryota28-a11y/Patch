export const messages = {
 en: { live:'Live timeline', headline:'Your awkward message.', subheadline:'The internet patches it.', intro:'Post a real-life communication problem. People rewrite it into something sharper, funnier, more formal, or completely unhinged.', feedLanguage:'Feed language', all:'ALL', patches:'Patches', patch:'Patch', seeRewrites:'See rewrites', postIssue:'Post Issue', hallOfFame:'Hall of Fame', submitPatch:'Submit a Patch', report:'Report', bookmark:'Bookmark' },
 ja: { live:'ライブタイムライン', headline:'あなたの気まずいメッセージ。', subheadline:'インターネットがパッチする。', intro:'現実のコミュニケーション問題を投稿。みんなが、もっと鋭く、面白く、丁寧に、あるいは完全にカオスな文章へ書き換えます。', feedLanguage:'フィードの言語', all:'ALL', patches:'パッチ', patch:'パッチ', seeRewrites:'書き換えを見る', postIssue:'Issueを投稿', hallOfFame:'殿堂入り', submitPatch:'パッチを投稿', report:'報告', bookmark:'保存' }
} as const;
export type Locale='en'|'ja';
export function getLocaleFromCookie(value:string|undefined):Locale{return value==='ja'?'ja':'en';}
