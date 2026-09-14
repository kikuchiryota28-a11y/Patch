export const messages = {
  en: { live:'Live timeline', headline:'Your awkward message.', subheadline:'The internet patches it.', intro:'Post a real-life communication problem. People rewrite it into something sharper, funnier, more formal, or completely unhinged.', feedLanguage:'Feed language', all:'ALL', patches:'Patches', patch:'Patch', seeRewrites:'See rewrites', postIssue:'Post Issue', hallOfFame:'Hall of Fame', submitPatch:'Submit a Patch', report:'Report', bookmark:'Bookmark' },
  ja: { live:'ライブタイムライン', headline:'あなたの気まずいメッセージ。', subheadline:'インターネットがパッチする。', intro:'現実のコミュニケーション問題を投稿。みんなが、もっと鋭く、面白く、丁寧に、あるいは完全にカオスな文章へ書き換えます。', feedLanguage:'フィードの言語', all:'ALL', patches:'パッチ', patch:'パッチ', seeRewrites:'書き換えを見る', postIssue:'Issueを投稿', hallOfFame:'殿堂入り', submitPatch:'パッチを投稿', report:'報告', bookmark:'保存' },
  es: { live:'Timeline en vivo', headline:'Tu mensaje incómodo.', subheadline:'Internet lo corrige.', intro:'Publica un problema real de comunicación. La gente lo reescribe de forma más clara, divertida, formal o completamente caótica.', feedLanguage:'Idioma del feed', all:'TODO', patches:'Patches', patch:'Patch', seeRewrites:'Ver reescrituras', postIssue:'Publicar Issue', hallOfFame:'Salón de la Fama', submitPatch:'Enviar un Patch', report:'Reportar', bookmark:'Guardar' },
  zh: { live:'实时动态', headline:'你的尴尬消息。', subheadline:'让互联网来修补。', intro:'发布一个真实的沟通难题。大家会把它改写得更犀利、更有趣、更正式，或者彻底失控。', feedLanguage:'动态语言', all:'全部', patches:'Patches', patch:'Patch', seeRewrites:'查看改写', postIssue:'发布 Issue', hallOfFame:'名人堂', submitPatch:'提交 Patch', report:'举报', bookmark:'收藏' }
} as const;

export type Locale = keyof typeof messages;

export function getLocaleFromCookie(value:string|undefined):Locale {
  if (value === 'ja' || value === 'es' || value === 'zh') return value;
  return 'en';
}
