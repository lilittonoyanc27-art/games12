/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GRAMMAR_THEORY, IRREGULAR_VERBS } from './data';
import { BookOpen, Table, Flame, X, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from './SoundManager';

interface GrammarGuideProps {
  onClose?: () => void;
}

export default function GrammarGuide({ onClose }: GrammarGuideProps) {
  const [activeTab, setActiveTab] = useState<'regular' | 'table' | 'irregular'>('regular');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  const handleTabChange = (tab: 'regular' | 'table' | 'irregular') => {
    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden max-w-4xl mx-auto my-4"
    >
      {/* Header section */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white relative">
        {onClose && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            id="close-grammar-btn"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-100 font-bold">Քերականության Դասարան</span>
            <h2 className="text-2xl font-black tracking-tight">{GRAMMAR_THEORY.generalTitle}</h2>
          </div>
        </div>
        <p className="mt-2 text-sm text-yellow-50">{GRAMMAR_THEORY.intro}</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 bg-amber-50/50 p-2 gap-2">
        <button
          onClick={() => handleTabChange('regular')}
          id="tab-regular-btn"
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'regular'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
              : 'text-gray-600 hover:bg-amber-100/50 hover:text-gray-900'
          }`}
        >
          <BookOpen size={16} />
          Կանոնավոր բայեր
        </button>
        <button
          onClick={() => handleTabChange('table')}
          id="tab-table-btn"
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'table'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
              : 'text-gray-600 hover:bg-amber-100/50 hover:text-gray-900'
          }`}
        >
          <Table size={16} />
          Վերջավորությունների Աղյուսակ
        </button>
        <button
          onClick={() => handleTabChange('irregular')}
          id="tab-irregular-btn"
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'irregular'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
              : 'text-gray-600 hover:bg-amber-100/50 hover:text-gray-900'
          }`}
        >
          <Flame size={16} />
          Անկանոն բայեր
        </button>
      </div>

      {/* Content wrapper */}
      <div className="p-6 md:p-8 min-h-[350px]">
        <AnimatePresence mode="wait">
          {activeTab === 'regular' && (
            <motion.div
              key="regular-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-gray-800 border-b border-amber-100 pb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">1</span>
                  Ի՞նչ է ապառնի ժամանակը
                </h3>
                <p className="text-gray-600 mt-2 leading-relaxed text-sm">
                  Իսպաներենում ապառնի կամ ապագա ժամանակը (El Futuro Simple) օգտագործվում է ապագայում կատարվելիք գործողությունները նկարագրելու համար (օրինակ՝ «վաղը ես կգրեմ», «մենք կգնանք»): Հայերենում այս ժամանակը կազմվում է <strong className="text-amber-600">«կ-»</strong> մասնիկի օգնությամբ (կխոսեմ, կուտենք):
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-800 border-b border-amber-100 pb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">2</span>
                  Կանոնավոր բայերի ոսկե կանոնը
                </h3>
                <p className="text-gray-600 mt-2 leading-relaxed text-sm">
                  Սա իսպաներենի ամենահեշտ կանոնն է: Այլևս պետք չէ կտրել բայի վերջից <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 text-xs font-mono">-ar</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 text-xs font-mono">-er</code> կամ <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 text-xs font-mono">-ir</code> մասնիկները: Վերջավորությունը ավելացվում է <strong className="text-emerald-600">ԱՆՄԻՋԱՊԵՍ ԱՆՈՐՈՇ ՁԵՎԻՆ (Infinitive)</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100">
                    <span className="text-xs font-bold text-amber-700 uppercase">Անորոշ ձև</span>
                    <h4 className="text-xl font-bold text-gray-800 font-mono">hablar <span className="text-xs font-sans text-gray-500 font-normal">(-ar / խոսել)</span></h4>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-700">
                      <ChevronRight size={14} className="text-amber-500" />
                      <span>hablar + <strong className="font-mono text-amber-600">-é</strong></span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Yo hablaré (ես կխոսեմ)</span>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Անորոշ ձև</span>
                    <h4 className="text-xl font-bold text-gray-800 font-mono">comer <span className="text-xs font-sans text-gray-500 font-normal">(-er / ուտել)</span></h4>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-700">
                      <ChevronRight size={14} className="text-emerald-500" />
                      <span>comer + <strong className="font-mono text-emerald-600">-emos</strong></span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Nosotros comeremos (մենք կուտենք)</span>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-4 rounded-2xl border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Անորոշ ձև</span>
                    <h4 className="text-xl font-bold text-gray-800 font-mono">vivir <span className="text-xs font-sans text-gray-500 font-normal">(-ir / ապրել)</span></h4>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-700">
                      <ChevronRight size={14} className="text-indigo-500" />
                      <span>vivir + <strong className="font-mono text-indigo-600">-án</strong></span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Ellos vivirán (նրանք կապրեն)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'table' && (
            <motion.div
              key="table-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <p className="text-gray-600 text-sm">
                Բոլոր երեք խմբերի բայերն էլ ունեն <strong className="text-amber-600">միևնույն վերջավորությունները</strong> ապառնի ժամանակում: Սա նշանակում է՝ պետք է սովորել ընդամենը 6 վերջավորություն.
              </p>

              <div className="overflow-hidden border border-gray-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-amber-500/10 text-gray-800">
                      <th className="p-3 text-sm font-black">Դերանուն (Pronoun)</th>
                      <th className="p-3 text-sm font-black text-center">Վերջավորություն</th>
                      <th className="p-3 text-sm font-black">Օրինակ (cantar - երգել)</th>
                      <th className="p-3 text-sm font-black">Հայերեն Թարգմանություն</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRAMMAR_THEORY.rules[1].table?.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-amber-50/20">
                        <td className="p-3 text-sm font-medium text-gray-700">{row.pronoun}</td>
                        <td className="p-3 text-sm font-bold text-center text-amber-600 font-mono">{row.ending}</td>
                        <td className="p-3 text-sm font-mono text-gray-800 font-bold">{row.test}</td>
                        <td className="p-3 text-sm text-gray-600">{row.pronoun} {row.test.includes('cantaré') ? 'կերգեմ' : row.test.includes('cantarás') ? 'կերգես' : row.test.includes('cantará') ? 'կերգի' : row.test.includes('cantaremos') ? 'կերգենք' : row.test.includes('cantaréis') ? 'կերգեք' : 'կերգեն'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-xs text-yellow-800 leading-relaxed font-sans flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  <strong>ՈՒՇԱԴՐՈՒԹՅՈՒՆ:</strong> Բոլոր ձևերը (բացի <code className="bg-yellow-100 px-1 rounded font-bold">nosotros (-emos)</code>-ից) իրենց վերջին ձայնավորի վրա ունեն <strong>գրավոր շեշտի նշան (tilde ´)</strong>: Սա չափազանց կարևոր է ճիշտ արտասանության և գրելու համար:
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'irregular' && (
            <motion.div
              key="irregular-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <p className="text-gray-600 text-sm">
                Որոշ հաճախական բայեր ապառնի ժամանակում փոխում են իրենց հիմքը (անորոշ ձևի փոխարեն օգտագործվում է հատուկ հիմք), սակայն վերջավորությունները մնում են <strong className="text-emerald-600">ճիշտ նույնը</strong>: Մտապահե՛ք այս պատմական 9 անկանոն հիմքերը.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {IRREGULAR_VERBS.map((verb, idx) => (
                  <div key={idx} className="border border-gray-100 hover:border-emerald-200 hover:shadow-sm rounded-2xl p-3 bg-white transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold font-mono text-emerald-600 text-sm">{verb.infinitive}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-medium">{verb.armenian}</span>
                      </div>
                      <div className="text-xs text-gray-400">Ապառնիի հիմքը՝</div>
                      <div className="text-base font-bold text-gray-800 font-mono my-0.5">{verb.stem}</div>
                    </div>
                    <div className="text-xs font-mono bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100/50 mt-2">
                      <span className="text-gray-500 text-[10px] block">Օրինակ՝</span>
                      <strong className="font-bold">{verb.example}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer quick memo */}
      <div className="bg-slate-50 border-t border-gray-100 p-4 text-xs text-gray-500 text-center flex items-center justify-center gap-2">
        <Check size={14} className="text-green-500" />
        <span>Իսպաներեն ապառնիի բոլոր 6 խաղերում այս կանոնները հաղթելու բանալին են: Սովորիր և անցի՛ր մրցությանը:</span>
      </div>
    </motion.div>
  );
}
