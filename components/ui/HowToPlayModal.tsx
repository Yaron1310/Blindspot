'use client';

import { useState } from 'react';

type LangCode = 'en' | 'he' | 'es' | 'ru' | 'ar';

interface LangContent {
  title: string;
  rtl: boolean;
  steps: string[];
}

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'he', label: '🇮🇱 עברית' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'ar', label: '🇸🇦 العربية' },
];

const CONTENT: Record<LangCode, LangContent> = {
  en: {
    title: 'How to Play',
    rtl: false,
    steps: [
      'Each round, one player secretly becomes the Spy.',
      'Every player privately sees a word on their own screen. The Spy receives a different word from the same category — they don\'t know for certain that they\'re the Spy.',
      'Players speak in turns. Each player says one sentence describing their word. Listen carefully — someone\'s description might not quite fit.',
      'After everyone has spoken, all players vote for who they think has the different word. You can even vote for yourself if you suspect you\'re the Spy.',
      'The Spy is revealed. Every player who voted for the Spy earns +1 point. Points accumulate across all rounds.',
      'A new Spy is chosen each round — never the same person twice in a row.',
    ],
  },
  he: {
    title: 'איך משחקים',
    rtl: true,
    steps: [
      'בכל סיבוב, שחקן אחד הופך בסתר למרגל.',
      'כל שחקן רואה מילה על המסך שלו בנפרד. המרגל מקבל מילה שונה מאותה קטגוריה — הוא לא יודע בוודאות שהוא המרגל.',
      'השחקנים מדברים בתורות. כל שחקן אומר משפט אחד שמתאר את המילה שלו. תקשיבו היטב — אולי תשמעו משהו שלא ממש מתאים.',
      'אחרי שכולם דיברו, כל השחקנים מצביעים על מי שלדעתם קיבל מילה שונה. אפשר גם להצביע על עצמכם אם אתם חושדים שאתם המרגל.',
      'המרגל נחשף. כל מי שהצביע על המרגל מקבל +1 נקודה. הנקודות מצטברות לאורך כל הסיבובים.',
      'בכל סיבוב נבחר מרגל חדש — אף פעם לא אותו אדם פעמיים ברצף.',
    ],
  },
  es: {
    title: 'Cómo jugar',
    rtl: false,
    steps: [
      'Cada ronda, un jugador se convierte en secreto en el Espía.',
      'Cada jugador ve una palabra en su pantalla de forma privada. El Espía recibe una palabra diferente de la misma categoría — no sabe con certeza que es el Espía.',
      'Los jugadores hablan por turnos. Cada uno dice una sola frase describiendo su palabra. Escucha con atención — la descripción de alguien podría no encajar del todo.',
      'Después de que todos han hablado, todos los jugadores votan por quien creen que tiene la palabra diferente. Puedes votarte a ti mismo si sospechas que eres el Espía.',
      'Se revela al Espía. Cada jugador que votó por el Espía gana +1 punto. Los puntos se acumulan a lo largo de todas las rondas.',
      'Cada ronda se elige un nuevo Espía — nunca la misma persona dos veces seguidas.',
    ],
  },
  ru: {
    title: 'Как играть',
    rtl: false,
    steps: [
      'Каждый раунд один игрок тайно становится Шпионом.',
      'Каждый игрок видит слово на своём экране наедине с собой. Шпион получает другое слово из той же категории — он не знает наверняка, что он Шпион.',
      'Игроки говорят по очереди. Каждый описывает своё слово одним предложением. Слушайте внимательно — чьё-то описание может не совсем подходить.',
      'После того как все высказались, каждый голосует за того, у кого, по его мнению, другое слово. Можно проголосовать за себя, если вы подозреваете, что вы Шпион.',
      'Шпион раскрывается. Каждый, кто проголосовал за Шпиона, получает +1 очко. Очки накапливаются на протяжении всех раундов.',
      'Каждый раунд выбирается новый Шпион — никогда не один и тот же человек дважды подряд.',
    ],
  },
  ar: {
    title: 'كيف تلعب',
    rtl: true,
    steps: [
      'في كل جولة، يصبح أحد اللاعبين سراً هو الجاسوس.',
      'يرى كل لاعب كلمة على شاشته الخاصة. يتلقى الجاسوس كلمة مختلفة من نفس الفئة — لا يعرف على وجه اليقين أنه الجاسوس.',
      'يتحدث اللاعبون بالتناوب. يصف كل لاعب كلمته بجملة واحدة. استمع جيداً — قد يكون وصف أحدهم غير متناسب تماماً.',
      'بعد أن يتحدث الجميع، يصوّت كل لاعب لمن يعتقد أن لديه الكلمة المختلفة. يمكنك التصويت لنفسك إذا كنت تشك في أنك الجاسوس.',
      'يُكشف الجاسوس. كل من صوّت للجاسوس يحصل على +1 نقطة. تتراكم النقاط على مدار جميع الجولات.',
      'يُختار جاسوس جديد في كل جولة — لا يكون الشخص نفسه مرتين متتاليتين.',
    ],
  },
};

const STEP_ICONS = ['1', '2', '3', '4', '5', '6'];

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  const [lang, setLang] = useState<LangCode>('en');
  const content = CONTENT[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md bg-card border border-border rounded-[14px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading text-xl text-text">{content.title}</h2>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              className="bg-surface border border-border text-text font-body text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Steps */}
        <div
          className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto"
          dir={content.rtl ? 'rtl' : 'ltr'}
        >
          {content.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-heading text-accent text-sm mt-0.5 shrink-0 w-4 text-center">
                {STEP_ICONS[i]}
              </span>
              <p className="text-text font-body text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
