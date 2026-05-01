/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Library, LayoutGrid, List, ChevronRight, PlayCircle } from 'lucide-react';
import { BOOKS } from './data/books';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BOOKS.map((b) => b.category)));
    return cats.sort();
  }, []);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const openReading = (book: any) => {
    if (book.readingUrl) {
      window.open(book.readingUrl, '_blank', 'noreferrer');
    } else {
      // Fallback: Search on YouTube for audiokitob
      const query = encodeURIComponent(`${book.title} audiokitob`);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noreferrer');
    }
  };

  const searchOnGoogle = (book: any) => {
    if (book.googleUrl) {
      window.open(book.googleUrl, '_blank', 'noreferrer');
    } else {
      const query = encodeURIComponent(`site:ziyouz.com ${book.title} pdf mutolaa`);
      window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noreferrer');
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-primary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-primary/10 flex flex-col p-6 bg-brand-sidebar">
        <div className="mb-10 text-center">
          <h1 className="font-serif italic text-2xl border-b border-brand-primary pb-2 leading-tight">
            Muhammadali<br/>Kutubxonasi
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] mt-2 opacity-60 font-bold">Raqamli Arxiv</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-4 opacity-40">Kategoriyalar</div>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-all ${
              selectedCategory === null 
                ? 'bg-brand-primary text-white' 
                : 'hover:bg-white/50'
            }`}
          >
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-all truncate ${
                selectedCategory === cat 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'hover:bg-white/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-brand-primary/10 text-[11px] leading-relaxed opacity-70 font-medium">
          <p>Katalog: 2024</p>
          <p>Holat: Onlayn</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-brand-primary/10 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-4 bg-white px-3 py-1.5 rounded-full border border-brand-primary/10 w-full max-w-md group focus-within:border-brand-primary/30 transition-all">
            <Search size={16} className="opacity-40" />
            <input
              type="text"
              placeholder="Kitob nomi yoki muallif..."
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium">
            <div className="flex items-center gap-2 bg-brand-primary/5 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'opacity-40'}`}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'opacity-40'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase opacity-50 leading-none mb-1 font-bold">Jami</span>
                <span className="font-bold">{BOOKS.length} ta</span>
              </div>
              <div className="h-8 w-[1px] bg-brand-primary/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase opacity-50 leading-none mb-1 font-bold">Topildi</span>
                <span className="font-bold text-orange-700">{filteredBooks.length} ta</span>
              </div>
            </div>
          </div>
        </header>

        <section className="p-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-serif text-3xl">Asarlar Katalogi</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-1.5 border border-brand-primary text-[10px] font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors">
                Eksport (CSV)
              </button>
              <button className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                Yangi Kitob
              </button>
            </div>
          </div>

          <div className="bg-white border border-brand-primary/10 flex-1 overflow-hidden flex flex-col shadow-sm rounded-sm">
            {viewMode === 'list' ? (
              <>
                <div className="grid grid-cols-[60px_2fr_1.5fr_1fr_100px] gap-4 p-4 border-b border-brand-primary bg-brand-primary text-white text-[10px] uppercase tracking-widest font-bold sticky top-0 z-10">
                  <span>#</span>
                  <span>Nomi</span>
                  <span>Turkum</span>
                  <span>Holati</span>
                  <span className="text-right">Harakat</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar text-[13px]">
                  <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book, idx) => (
                      <motion.div
                        layout
                        key={book.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-[60px_2fr_1.5fr_1fr_100px] gap-4 p-4 border-b border-brand-primary/5 items-center hover:bg-brand-bg cursor-pointer transition-colors group"
                      >
                        <span className="opacity-40 font-mono">{(idx + 1).toString().padStart(4, '0')}</span>
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold group-hover:text-brand-primary transition-colors">{book.title}</span>
                          {book.readingUrl && <PlayCircle size={14} className="text-orange-600 animate-pulse" />}
                        </div>
                        <span className="italic opacity-60">{book.category}</span>
                        <span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                            Mavjud
                          </span>
                        </span>
                        <span className="text-right flex items-center justify-end gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openReading(book); }}
                            className="text-[10px] font-bold text-orange-700 hover:underline flex items-center gap-1 group/btn"
                            title="YouTube'dan qidirish"
                          >
                             MUTOLAA {book.readingUrl ? '' : '(YT)'}
                          </button>
                          {(!book.readingUrl || book.googleUrl) && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); searchOnGoogle(book); }}
                               className="text-[10px] font-bold text-blue-700 hover:underline"
                               title={book.googleUrl ? "To'g'ridan-to'g'ri mutolaa" : "Google'dan qidirish"}
                             >
                               GOOGLE
                             </button>
                          )}
                          <button className="p-1 hover:bg-brand-primary/10 rounded">
                            <ChevronRight size={14} />
                          </button>
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredBooks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                      <Search size={40} className="mb-4" />
                      <p className="font-serif italic text-lg transition-all">Qidiruv natija bermadi</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book) => (
                      <motion.div
                        layout
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-brand-primary/10 bg-brand-surface hover:border-brand-primary/30 transition-all cursor-pointer group flex flex-col h-full"
                        onClick={() => openReading(book)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <Library size={16} className="opacity-20" />
                          <div className={`w-2 h-2 rounded-full ${book.readingUrl ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                        </div>
                        <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-brand-primary underline-offset-4 decoration-brand-primary/20 group-hover:underline">
                          {book.title}
                        </h3>
                        <p className="text-[10px] uppercase tracking-tighter opacity-50 font-bold mb-4">
                          {book.category}
                        </p>
                        
                        <div className="mt-auto pt-3 border-t border-brand-primary/5 flex items-center justify-between text-[10px] font-bold">
                          <div className="flex gap-2">
                             <span onClick={(e) => { e.stopPropagation(); openReading(book); }} className="text-orange-700 hover:underline">MUTOLAA (YT)</span>
                             {(!book.readingUrl || book.googleUrl) && <span onClick={(e) => { e.stopPropagation(); searchOnGoogle(book); }} className="text-blue-700 hover:underline ml-2">GOOGLE</span>}
                          </div>
                          <PlayCircle size={14} className={book.readingUrl ? 'text-orange-600' : 'opacity-20'} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {filteredBooks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <Search size={40} className="mb-4" />
                    <p className="font-serif italic text-lg">Hech narsa topilmadi</p>
                  </div>
                )}
              </div>
            )}
          </div>


          <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
            <p>Ko'rsatilmoqda: 1-{filteredBooks.length} dan {BOOKS.length} tadan</p>
            <div className="flex space-x-4">
              <button className="hover:text-brand-primary transition-colors cursor-pointer">Oldingi</button>
              <div className="flex space-x-3">
                <span className="underline underline-offset-4">1</span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
              </div>
              <button className="hover:text-brand-primary transition-colors cursor-pointer">Keyingi</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

