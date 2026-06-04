/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CharacterDetail,
  GameDefinition,
  ConjugationQuestion,
  IrregularVerbPair,
  DialogueBubble,
  SpeedQuestion,
  TranslationQuestion
} from './types';

export const CHARACTERS: Record<'gor' | 'gayane', CharacterDetail> = {
  gor: {
    id: 'gor',
    name: 'Գոռ',
    avatar: '👦🏻',
    color: 'from-orange-500 to-amber-600 border-amber-500 text-amber-600',
    bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-100',
    description: 'Ակտիվ և արկածախնդիր տղա, ով սիրում է իսպաներենը սովորել արագորեն, երբեմն շտապում է, բայց միշտ պատրաստ է մրցակցության:',
    victoryPhrase: 'Ես հաղթեցի՜: Իմ իսպաներեն ապագան պայծառ է: ¡Viva el futuro!',
    lossPhrase: 'Ոչինչ, սա ընդամենը ապագայի մի փոքր փորձություն էր: Հաջորդ անգամ կհաղթեմ:'
  },
  gayane: {
    id: 'gayane',
    name: 'Գայանե',
    avatar: '👧🏻',
    color: 'from-emerald-500 to-teal-600 border-emerald-500 text-teal-600',
    bgPattern: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    description: 'Խելացի և ուշադիր աղջիկ, ով սիրում է քերականության բոլոր կանոնները, անկանոն բայերը գիտի անգիր և վերլուծում է յուրաքանչյուր քայլ:',
    victoryPhrase: 'Ինչպես և կանխատեսում էի՝ ճիշտ քերականությունն ինձ բերեց հաղթանակ: ¡Excelente!',
    lossPhrase: 'Լավ խաղ էր: Գոռը լավ մարզվել էր, բայց իմ կանոնները դեռ ինձ հետ են:'
  }
};

export const GAMES: GameDefinition[] = [
  {
    id: 1,
    titleArm: 'Խոնարհման Կառուցող',
    titleSpan: 'Constructor de Conjugaciones',
    descriptionArm: 'Կառուցիր կանոնավոր բայերի ապառնի ժամանակը՝ ավելացնելով ճիշտ վերջավորություններ անորոշ դերբային:',
    icon: '⚡',
    accentColor: 'amber'
  },
  {
    id: 3,
    titleArm: 'Անկանոն Բայերի Մարտ',
    titleSpan: 'Batalla de Irregulares',
    descriptionArm: 'Իսպաներենում շատ բայեր ունեն հատուկ ապառնի հիմքեր: Գտիր անկանոն բայի ճիշտ ապառնի հիմքը:',
    icon: '⚔️',
    accentColor: 'rose'
  },
  {
    id: 4,
    titleArm: 'Գոռ և Գայանե․ «Կգնանք կինոթատրոն միասին»',
    titleSpan: 'Diálogo — Futuro Simple',
    descriptionArm: 'Օգնիր Գոռին և Գայանեին կառուցել իրենց իսպաներեն խոսակցությունը վաղվա պլանների մասին:',
    icon: '💬',
    accentColor: 'teal'
  },
  {
    id: 5,
    titleArm: 'Արագընթաց Ճիշտ-Սխալ',
    titleSpan: 'Velocidad de Verbos',
    descriptionArm: 'Արագ արձագանքիր: Արդյո՞ք էկրանին հայտնված իսպաներեն ապառնի բայաձևը համապատասխանում է թարգմանությանը:',
    icon: '⏱️',
    accentColor: 'violet'
  },
  {
    id: 6,
    titleArm: 'Ապառնի Թարգմանիչ',
    titleSpan: 'Traductor de Futuro',
    descriptionArm: 'Ընտրիր հայերեն ապառնի նախադասության ճիշտ իսպաներեն թարգմանությունը տրված տարբերակներից:',
    icon: '🌐',
    accentColor: 'emerald'
  }
];

// Spanish grammar theory to display in a prominent educational sections
export const GRAMMAR_THEORY = {
  generalTitle: 'Իսպաներենի Ապառնի Ժամանակը (El Futuro Simple)',
  intro: 'Իսպաներենում ապառնի ժամանակաձևը (ապագա ժամանակը) շատ հետաքրքիր է և ավելի հեշտ, քան ներկան: Եկեք սովորենք հիմնական կանոնները Գոռի և Գայանեի հետ:',
  rules: [
    {
      title: '1. Կանոնավոր բայերի խոնարհում',
      text: 'Ի տարբերություն ներկա ժամանակի, այստեղ մենք ՉԵՆՔ հեռացնում բայախոնարհման վերջավորությունները (-ar, -er, -ir): Մենք վերջավորությունները ավելացնում ենք անմիջապես ԲԱՅԻ ԱՆՈՐՈՇ ՁԵՎԻՆ (Infinitive):',
      examples: [
        'hablar (խոսել) -> Yo hablaré (ես կխոսեմ)',
        'comer (ուտել) -> Nosotros comeremos (մենք կուտենք)',
        'vivir (ապրել) -> Ellos vivirán (նրանք կապրեն)'
      ]
    },
    {
      title: '2. Ապառնի ժամանակի միասնական վերջավորությունները',
      text: 'Բոլոր երեք խմբերի բայերն էլ (-ar, -er, -ir) ստանում են ՄԻԵՎՆՈՒՅՆ վերջավորությունները. -é, -ás, -á, -emos, -éis, -án. Ուշադրություն դարձրեք՝ բոլոր ձևերը (բացի nosotros-ից) ունեն շեշտի նշան (tilde - ´):',
      table: [
        { pronoun: 'Yo (Ես)', ending: '-é', test: 'cantaré (կերգեմ)' },
        { pronoun: 'Tú (Դու)', ending: '-ás', test: 'cantarás (կերգես)' },
        { pronoun: 'Él/Ella/Ud (Նա)', ending: '-á', test: 'cantará (կերգի)' },
        { pronoun: 'Nosotros (Մենք)', ending: '-emos', test: 'cantaremos (կերգենք)' },
        { pronoun: 'Vosotros (Դուք)', ending: '-éis', test: 'cantaréis (կերգեք)' },
        { pronoun: 'Ellos/Ellas/Uds (Նրանք)', ending: '-án', test: 'cantarán (կերգեն)' }
      ]
    },
    {
      title: '3. Անկանոն բայեր (Los Verbos Irregulares)',
      text: 'Շատ կարևոր բայեր ապառնիում ունեն փոփոխված հիմքեր, բայց վերջավորությունները նույնն են: Օրինակ՝',
      examples: [
        'tener (ունենալ) -> tendr- -> Yo tendré (ես կունենամ)',
        'hacer (անել) -> har- -> Yo haré (ես կանեմ)',
        'decir (ասել) -> dir- -> Yo diré (ես կասեմ)',
        'querer (ցանկանալ) -> querr- -> Yo querré (ես կցանկանամ)'
      ]
    }
  ]
};

// Game 1: Conjugation Builder questions
export const CONJUGATION_QUESTIONS: ConjugationQuestion[] = [
  {
    verb: 'hablar',
    translation: 'խոսել',
    pronoun: 'nosotros',
    pronounTranslation: 'մենք',
    correctAnswer: 'hablaremos',
    options: ['hablaremos', 'hablamos', 'hablarán', 'hablaré'],
    explanation: 'hablar բայի nosotros (մենք) ձևի համար անորոշ ձևին ավելացնում ենք -emos վերջավորությունը -> hablaremos (մենք կխոսենք):'
  },
  {
    verb: 'comer',
    translation: 'ուտել',
    pronoun: 'yo',
    pronounTranslation: 'ես',
    correctAnswer: 'comeré',
    options: ['comeré', 'como', 'comerás', 'comerán'],
    explanation: 'comer բայի yo (ես) ձևի համար անորոշ ձևին ավելացնում ենք -é վերջավորությունը -> comeré (ես կուտեմ):'
  },
  {
    verb: 'vivir',
    translation: 'ապրել',
    pronoun: 'ellos',
    pronounTranslation: 'նրանք',
    correctAnswer: 'vivirán',
    options: ['vivirán', 'viven', 'viviremos', 'vivirá'],
    explanation: 'vivir բայի ellos (նրանք) ձևի համար անորոշ ձևին ավելացնում ենք -án վերջավորությունը -> vivirán (նրանք կապրեն):'
  },
  {
    verb: 'cantar',
    translation: 'երգել',
    pronoun: 'tú',
    pronounTranslation: 'դու',
    correctAnswer: 'cantarás',
    options: ['cantarás', 'cantas', 'cantará', 'cantaréis'],
    explanation: 'cantar բայի tú (դու) ձևի համար անորոշ ձևին ավելացնում ենք -ás վերջավորությունը -> cantarás (դու կերգես):'
  },
  {
    verb: 'beber',
    translation: 'խմել',
    pronoun: 'ella',
    pronounTranslation: 'նա (աղջիկ)',
    correctAnswer: 'beberá',
    options: ['beberá', 'bebe', 'beberemos', 'beberán'],
    explanation: 'beber բայի ella (նա) ձևի համար անորոշ ձևին ավելացնում ենք -á վերջավորությունը -> beberá (նա կխմի):'
  },
  {
    verb: 'abrir',
    translation: 'բացել',
    pronoun: 'nosotros',
    pronounTranslation: 'մենք',
    correctAnswer: 'abriremos',
    options: ['abriremos', 'abrimos', 'abrirán', 'abriré'],
    explanation: 'abrir բայի nosotros (մենք) ձևի համար անորոշ ձևին ավելացնում ենք -emos վերջավորությունը -> abriremos (մենք կբացենք):'
  },
  {
    verb: 'bailar',
    translation: 'պարել',
    pronoun: 'yo',
    pronounTranslation: 'ես',
    correctAnswer: 'bailaré',
    options: ['bailaré', 'bailo', 'bailarás', 'bailarán'],
    explanation: 'bailar բայի yo (ես) ձևի համար անորոշ ձևին ավելացնում ենք -é վերջավորությունը -> bailaré (ես կպարեմ):'
  },
  {
    verb: 'correr',
    translation: 'վազել',
    pronoun: 'tú',
    pronounTranslation: 'դու',
    correctAnswer: 'correrás',
    options: ['correrás', 'corres', 'correrá', 'correréis'],
    explanation: 'correr բայի tú (դու) ձևի համար անորոշ ձևին ավելացնում ենք -ás վերջավորությունը -> correrás (դու կվազես):'
  },
  {
    verb: 'escribir',
    translation: 'գրել',
    pronoun: 'él',
    pronounTranslation: 'նա',
    correctAnswer: 'escribirá',
    options: ['escribirá', 'escribe', 'escribիրե', 'escribirán'],
    explanation: 'escribir բայի él (նա) ձևի համար անորոշ ձևին ավելացնում ենք -á վերջավորությունը -> escribirá (նա կգրի):'
  },
  {
    verb: 'viajar',
    translation: 'ճամփորդել',
    pronoun: 'vosotros',
    pronounTranslation: 'դուք (իսպանիայում)',
    correctAnswer: 'viajaréis',
    options: ['viajaréis', 'viajáis', 'viaջարեմոս', 'viajarán'],
    explanation: 'viajar բայի vosotros (դուք) ձևի համար անորոշ ձևին ավելացնում ենք -éis վերջավորությունը -> viajaréis (դուք կճամփորդեք):'
  }
];

// Game 3: Irregular Verbs Table
export const IRREGULAR_VERBS: IrregularVerbPair[] = [
  { infinitive: 'tener', armenian: 'ունենալ', stem: 'tendr-', example: 'tendré (կունենամ)' },
  { infinitive: 'hacer', armenian: 'անել', stem: 'har-', example: 'harás (կանես)' },
  { infinitive: 'decir', armenian: 'ասել', stem: 'dir-', example: 'dirá (կասի)' },
  { infinitive: 'poder', armenian: 'կարողանալ', stem: 'podr-', example: 'podremos (կկարողանանք)' },
  { infinitive: 'querer', armenian: 'ցանկանալ / սիրել', stem: 'querr-', example: 'querrán (կցանկանան)' },
  { infinitive: 'saber', armenian: 'իմանալ', stem: 'sabr-', example: 'sabréis (կիմանաք)' },
  { infinitive: 'poner', armenian: 'դնել', stem: 'pondr-', example: 'pondré (կդնեմ)' },
  { infinitive: 'salir', armenian: 'դուրս գալ', stem: 'saldr-', example: 'saldremos (դուրս կգանք)' },
  { infinitive: 'venir', armenian: 'գալ', stem: 'vendr-', example: 'vendrán (կգան)' },
  { infinitive: 'valer', armenian: 'արժենալ', stem: 'valdr-', example: 'valdrá (կարժենա)' },
  { infinitive: 'caber', armenian: 'տեղավորվել', stem: 'cabr-', example: 'cabremos (կտեղավորվենք)' },
  { infinitive: 'haber', armenian: 'լինել (օժանդակ)', stem: 'habr-', example: 'habrá (կլինի)' }
];

// Game 4: Dialogue Duel
export const DIALOGUE_BUBBLES: DialogueBubble[] = [
  {
    id: 1,
    character: 'gor',
    armenianText: 'Գայանե, վաղը կեսօրից հետո ի՞նչ կանես։',
    spanishTemplate: 'Gayane, ¿qué {blank} mañana por la tarde?',
    correctAnswer: 'harás',
    options: ['harás', 'haré', 'hacerás', 'harán'],
    explanation: 'hacer (անել) անկանոն բայի "tú" (դու) ձևն է ապառնիում՝ har- + -ás -> harás:'
  },
  {
    id: 2,
    character: 'gayane',
    armenianText: 'Դեռ չգիտեմ։ Կարծում եմ՝ մի քիչ կսովորեմ, հետո կհանգստանամ։',
    spanishTemplate: 'No lo sé todavía. Creo que {blank} un poco y después descansaré.',
    correctAnswer: 'estudiaré',
    options: ['estudiaré', 'estudia', 'estudiamos', 'estudiarán'],
    explanation: 'estudiar (սովորել) կանոնավոր բայի "yo" (ես) ձևն է ապառնիում՝ estudiar + -é -> estudiaré:'
  },
  {
    id: 3,
    character: 'gor',
    armenianText: 'Կուզե՞ս ինձ հետ գնալ կինոթատրոն։',
    spanishTemplate: '¿{blank} ir al cine conmigo?',
    correctAnswer: 'Querrás',
    options: ['Querrás', 'Quieres', 'Querremos', 'Querrán'],
    explanation: 'querer (ցանկանալ, ուզել) անկանոն բայի "tú" (դու) ձևն է ապառնիում՝ querr- + -ás -> querrás:'
  },
  {
    id: 4,
    character: 'gayane',
    armenianText: 'Այո, իհարկե։ Ի՞նչ ֆիլմ կդիտենք։',
    spanishTemplate: 'Sí, claro. ¿Qué película {blank}?',
    correctAnswer: 'veremos',
    options: ['veremos', 'verán', 'vemos', 'veré'],
    explanation: 'ver (դիտել, տեսնել) կանոնավոր բայի "nosotros" (մենք) ձևն է ապառնիում՝ ver + -emos -> veremos:'
  },
  {
    id: 5,
    character: 'gor',
    armenianText: 'Կդիտենք կատակերգություն։ Կարծում եմ՝ հետաքրքիր և զվարճալի կլինի։',
    spanishTemplate: 'Veremos una comedia. Creo que {blank} interesante y divertida.',
    correctAnswer: 'será',
    options: ['será', 'seré', 'serán', 'serás'],
    explanation: 'ser (լինել) կանոնավոր բայի "él/ella" (նա/այն) ձևն է ապառնիում՝ ser + -á -> será:'
  },
  {
    id: 6,
    character: 'gayane',
    armenianText: 'Հիանալի։ Ժամը քանիսի՞ն կգնանք։',
    spanishTemplate: 'Perfecto. ¿A qué hora {blank}?',
    correctAnswer: 'iremos',
    options: ['iremos', 'iréis', 'vamos', 'irán'],
    explanation: 'ir (գնալ) կանոնավոր բայի "nosotros" (մենք) ձևն է ապառնիում՝ ir + -emos -> iremos:'
  },
  {
    id: 7,
    character: 'gor',
    armenianText: 'Կգնանք երեկոյան ժամը յոթին։',
    spanishTemplate: '{blank} a las siete de la tarde.',
    correctAnswer: 'Iremos',
    options: ['Iremos', 'Iré', 'Irán', 'Vamos'],
    explanation: 'ir (գնալ) բայի "nosotros" (մենք) դեմքն է ապառնիում՝ ir + -emos -> Iremos:'
  },
  {
    id: 8,
    character: 'gayane',
    armenianText: 'Շատ լավ։ Տոմսերը այնտեղ կգնե՞նք։',
    spanishTemplate: 'Muy bien. ¿{blank} las entradas allí?',
    correctAnswer: 'compraremos',
    options: ['compraremos', 'comprarán', 'compraréis', 'compramos'],
    explanation: 'comprar (գնել) կանոնավոր բայի "nosotros" (մենք) ձևն է ապառնիում՝ comprar + -emos -> compraremos:'
  },
  {
    id: 9,
    character: 'gor',
    armenianText: 'Ոչ, ես տոմսերը ինտերնետով կգնեմ։',
    spanishTemplate: 'No, yo {blank} las entradas por internet.',
    correctAnswer: 'compraré',
    options: ['compraré', 'comprarás', 'compra', 'comprarán'],
    explanation: 'comprar (գնել) բայի "yo" (ես) դեմքն է ապառնիում՝ comprar + -é -> compraré:'
  },
  {
    id: 10,
    character: 'gayane',
    armenianText: 'Ուրեմն ես պոպկորն և խմիչքներ կգնեմ։',
    spanishTemplate: 'Entonces, yo {blank} palomitas y bebidas.',
    correctAnswer: 'compraré',
    options: ['compraré', 'compras', 'compraréis', 'comprarán'],
    explanation: 'comprar (գնել) բայի "yo" (ես) դեմքն է ապառնիում՝ comprar + -é -> compraré:'
  },
  {
    id: 11,
    character: 'gor',
    armenianText: 'Հիանալի։ Կհանդիպենք կինոթատրոնի դիմաց ժամը վեց անց կես։',
    spanishTemplate: 'Genial. Nos {blank} delante del cine a las seis y media.',
    correctAnswer: 'encontraremos',
    options: ['encontraremos', 'encontrarán', 'encontramos', 'encontraré'],
    explanation: 'encontrar (գտնել, հանդիպել) բայի "nosotros" (մենք) դեմքն է ապառնիում՝ encontrar + -emos -> encontraremos:'
  },
  {
    id: 12,
    character: 'gayane',
    armenianText: 'Լավ։ Ժամանակին կհասնեմ։',
    spanishTemplate: 'Vale. {blank} a tiempo.',
    correctAnswer: 'Llegaré',
    options: ['Llegaré', 'Llegará', 'Llegamos', 'Llegarán'],
    explanation: 'llegar (հասնել) կանոնավոր բայի "yo" (ես) դեմքն է ապառնիում՝ llegar + -é -> Llegaré:'
  },
  {
    id: 13,
    character: 'gor',
    armenianText: 'Ֆիլմից հետո մի քիչ կքայլենք կենտրոնում։',
    spanishTemplate: 'Después de la película {blank} un poco por el centro.',
    correctAnswer: 'caminaremos',
    options: ['caminaremos', 'caminarás', 'caminaré', 'caminamos'],
    explanation: 'caminar (քայլել) կանոնավոր բայի "nosotros" (մենք) դեմքն է ապառնիում՝ caminar + -emos -> caminaremos:'
  },
  {
    id: 14,
    character: 'gayane',
    armenianText: 'Այո, ինձ շատ դուր կգա։ Շատ գեղեցիկ երեկո կլինի։',
    spanishTemplate: 'Sí, me {blank} mucho. Será una tarde muy bonita.',
    correctAnswer: 'gustará',
    options: ['gustará', 'gustaré', 'gustarán', 'gustarás'],
    explanation: 'gustar (դուր գալ) երրորդ դեմքի եզակի ձևն է ("it will please me") -> gustar + -á -> gustará:'
  }
];

// Game 5: Speed True/False
export const SPEED_QUESTIONS: SpeedQuestion[] = [
  {
    spanishVerb: 'Tú cantarás',
    armenianMeaning: 'Դու կերգես',
    isCorrect: true,
    explanation: 'Ճիշտ է: cantar (երգել) կանոնավոր բայ է, tú դեմքի համար ստանում է -ás վերջավորություն -> cantarás:'
  },
  {
    spanishVerb: 'Yo teneré',
    armenianMeaning: 'Ես կունենամ',
    isCorrect: false,
    explanation: 'Սխալ է: tener բայը անկանոն է, նրա ապառնիի հիմքը tendr- է, ուստի պետք է լինի Yo tendré:'
  },
  {
    spanishVerb: 'Nosotros escribiremos',
    armenianMeaning: 'Մենք կգրենք',
    isCorrect: true,
    explanation: 'Ճիշտ է: escribir (գրել) կանոնավոր բայ է, nosotros դեմքի համար ստանում է -emos վերջավորություն -> escribiremos:'
  },
  {
    spanishVerb: 'Él hará',
    armenianMeaning: 'Նա կանի',
    isCorrect: true,
    explanation: 'Ճիշտ է: hacer (անել) բայից ստացվում է hará (իր հիմքն է har- + -á):'
  },
  {
    spanishVerb: 'Vosotros comerán',
    armenianMeaning: 'Դուք կուտեք',
    isCorrect: false,
    explanation: 'Սխալ է: Vosotros-ի համար վերջավորությունն է -éis, ուստի պետք է լինի comeréis: Comerán-ը նրանք (ellos) դեմքն է:'
  },
  {
    spanishVerb: 'Ellos dirán',
    armenianMeaning: 'Նրանք կասեն',
    isCorrect: true,
    explanation: 'Ճիշտ է: decir բայը անկանոն է, ապառնի հիմքն է dir- + ellos (-án) -> dirán (նրանք կասեն):'
  },
  {
    spanishVerb: 'Ella saldrá',
    armenianMeaning: 'Նա դուրս կգա',
    isCorrect: true,
    explanation: 'Ճիշտ է: salir (դուրս գալ) անկանոն է, ապառնի հիմքն է saldr- + ella (-á) -> saldrá:'
  },
  {
    spanishVerb: 'Yo queré',
    armenianMeaning: 'Ես կցանկանամ / կսիրեմ',
    isCorrect: false,
    explanation: 'Սխալ է: querer բայը ապառնիում ունի կրկնակի r-ով հիմք՝ querr-, ուստի պետք է լինի Yo querré:'
  },
  {
    spanishVerb: 'Ellos vendrán',
    armenianMeaning: 'Նրանք կգան',
    isCorrect: true,
    explanation: 'Ճիշտ է: venir (գալ) բայը անկանոն է, ապառնի հիմքն է vendr- + ellos (-án) -> vendrán:'
  },
  {
    spanishVerb: 'Nosotros haré',
    armenianMeaning: 'Մենք կանենք',
    isCorrect: false,
    explanation: 'Սխալ է: Nosotros դեմքի համար ճիշտ բայաձևն է haremos, իսկ haré-ն Yo (ես) դեմքն է:'
  }
];

// Game 6: Translation Questions
export const TRANSLATION_QUESTIONS: TranslationQuestion[] = [
  {
    armenianSentence: 'Վաղը ես կճամփորդեմ Մադրիդ:',
    correctAnswer: 'Mañana yo viajaré a Madrid.',
    options: [
      'Mañana yo viajaré a Madrid.',
      'Mañana yo viajo a Madrid.',
      'Mañana yo viajaría a Madrid.',
      'Mañana yo viajarán a Madrid.'
    ],
    explanation: 'viajar (ճամփորդել) կանոնավոր բայ է: Yo (ես) դեմքի համար անորոշ բային ավելացնում ենք -é վերջավորությունը -> viajaré:'
  },
  {
    armenianSentence: 'Մենք կիմանանք իսպաներենի բոլոր կանոնները հաջորդ ամիս:',
    correctAnswer: 'Nosotros sabremos todas las reglas de español el próximo mes.',
    options: [
      'Nosotros sabremos todas las reglas de español el próximo mes.',
      'Nosotros sabemos todas las reglas.',
      'Nosotros sabrán todas las reglas.',
      'Nosotros saberemos todas las reglas.'
    ],
    explanation: 'saber (իմանալ) բայը ապառնիում անկանոն է, հիմքը դառնում է sabr- + nosotros (-emos) -> sabremos:'
  },
  {
    armenianSentence: 'Նրանք կունենան շատ հետաքրքիր արկածներ:',
    correctAnswer: 'Ellos tendrán muchas aventuras interesantes.',
    options: [
      'Ellos tendrán muchas aventuras interesantes.',
      'Ellos tenerán muchas aventuras.',
      'Ellos tienen muchas aventuras.',
      'Ellos tendremos muchas aventuras.'
    ],
    explanation: 'tener (ունենալ) բայը անկանոն է, հիմքը դառնում է tendr- + ellos (-án) -> tendrán:'
  },
  {
    armenianSentence: 'Դու կխոսես իսպաներեն վաղը:',
    correctAnswer: '¿Hablarás español mañana?',
    options: [
      '¿Hablarás español mañana?',
      '¿Hablarás español ayer?',
      '¿Hablas español mañana?',
      '¿Hablará español mañana?'
    ],
    explanation: 'hablar բայի tú (դու) դեմքի համար անորոշ ձևին ավելացնում ենք -ás -> hablarás:'
  },
  {
    armenianSentence: 'Գայանեն և Գոռը կանեն իրենց տնային աշխատանքները:',
    correctAnswer: 'Gayane y Gor harán sus deberes.',
    options: [
      'Gayane y Gor harán sus deberes.',
      'Gayane y Gor hacerán sus deberes.',
      'Gayane y Gor hacemos sus deberes.',
      'Gayane y Gor hará sus deberes.'
    ],
    explanation: 'hacer (անել) բայը անկանոն է, հիմքը դառնում է har- + ellos (-án) -> harán:'
  },
  {
    armenianSentence: 'Երեկոյան ես դուրս կգամ իմ ընկերների հետ:',
    correctAnswer: 'Por la tarde yo saldré con mis amigos.',
    options: [
      'Por la tarde yo saldré con mis amigos.',
      'Por la tarde yo saliré con mis amigos.',
      'Por la tarde yo salgo con mis amigos.',
      'Por la tarde yo saldrá con mis amigos.'
    ],
    explanation: 'salir (դուրս գալ) բայը անկանոն է, հիմքը դառնում է saldr- + yo (-é) -> saldré:'
  },
  {
    armenianSentence: 'Արդյո՞ք դուք (vosotros) կուտեք տակո Մադրիդում:',
    correctAnswer: '¿Comeréis tacos en Madrid?',
    options: [
      '¿Comeréis tacos en Madrid?',
      '¿Comerán tacos en Madrid?',
      '¿Coméis tacos en Madrid?',
      '¿Comeremos tacos en Madrid?'
    ],
    explanation: 'comer (ուտել) բայի vosotros դեմքի ձևի համար անորոշ բային ավելացնում ենք -éis -> comeréis:'
  },
  {
    armenianSentence: 'Մենք կգրենք մի գեղեցիկ նամակ նրանց համար:',
    correctAnswer: 'Nosotros escribiremos una carta bonita para ellos.',
    options: [
      'Nosotros escribiremos una carta bonita para ellos.',
      'Nosotros escribiremos una carta bonita.',
      'Nosotros escribimos una carta.',
      'Nosotros escribirán una carta.'
    ],
    explanation: 'escribir (գրել) կանոնավոր բայ է, nosotros դեմքի համար անորոշ բային ավելացնում ենք -emos -> escribiremos:'
  },
  {
    armenianSentence: 'Նա կասի ինձ ճշմարտությունը:',
    correctAnswer: 'Él me dirá la verdad.',
    options: [
      'Él me dirá la verdad.',
      'Él me decirá la verdad.',
      'Él me dice la verdad.',
      'Él me dirán la verdad.'
    ],
    explanation: 'decir (ասել) բայը անկանոն է, հիմքը դառնում է dir- + él (-á) -> dirá:'
  },
  {
    armenianSentence: 'Ես կապրեմ Վալենսիայում հաջորդ տարի:',
    correctAnswer: 'Yo viviré en Valencia el próximo año.',
    options: [
      'Yo viviré en Valencia el próximo año.',
      'Yo vivo en Valencia el próximo año.',
      'Yo viviría en Valencia el próximo año.',
      'Yo viviremos en Valencia.'
    ],
    explanation: 'vivir (ապրել) բայի yo դեմքի ձևի համար անորոշ բային ավելացնում ենք -é -> viviré:'
  }
];

