'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import type { Gamezone, GamezoneCategory } from '@/lib/types';

interface CategoryDraft {
  id: string;
  name: string;
  words: string[];
  wordInput: string;
}

export default function EditGamezonePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { t, isRtl } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [gzName, setGzName] = useState('');
  const [categories, setCategories] = useState<CategoryDraft[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/gamezones/${params.id}`)
      .then((r) => r.json())
      .then((gz: Gamezone) => {
        setGzName(gz.name);
        setCategories(gz.categories.map((c) => ({ ...c, wordInput: '' })));
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [user, params.id, router]);

  const addCategory = () => {
    setCategories((prev) => [...prev, { id: crypto.randomUUID(), name: '', words: [], wordInput: '' }]);
  };

  const updateCategoryName = (id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const updateWordInput = (id: string, wordInput: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, wordInput } : c)));
  };

  const addWord = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const word = c.wordInput.trim();
        if (!word || c.words.includes(word)) return { ...c, wordInput: '' };
        return { ...c, words: [...c.words, word], wordInput: '' };
      })
    );
  };

  const removeWord = (catId: string, word: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id !== catId ? c : { ...c, words: c.words.filter((w) => w !== word) }))
    );
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    setError('');
    if (!gzName.trim()) { setError(t('gamezoneNameRequired')); return; }

    for (const cat of categories) {
      if (!cat.name.trim()) { setError(t('allCategoriesNeedName')); return; }
      if (cat.words.length < 2) { setError(t('categoryNeedsWords', { name: cat.name })); return; }
    }

    setSaving(true);
    try {
      const finalCategories: GamezoneCategory[] = categories.map((c) => ({
        id: c.id,
        name: c.name.trim(),
        words: c.words,
      }));

      const res = await fetch(`/api/gamezones/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: gzName, categories: finalCategories }),
      });

      if (!res.ok) { setError(t('failedToSave')); return; }
      router.push('/dashboard');
    } catch {
      setError(t('somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <p className="text-muted font-body">{t('loading')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard" className="text-muted hover:text-text font-body text-sm transition-colors">
            {isRtl ? `${t('dashboardLink')} →` : `← ${t('dashboardLink')}`}
          </Link>
          <h1 className="font-heading text-4xl text-text mt-1">{t('editGamezoneTitle')}</h1>
        </div>

        <div className="bg-card border border-border rounded-[14px] p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs text-muted font-body uppercase tracking-widest">{t('gamezoneNameLabel')}</label>
            <input
              type="text"
              value={gzName}
              onChange={(e) => setGzName(e.target.value)}
              className="w-full bg-bg border border-border rounded-[14px] px-4 py-3 text-text font-body focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-text">{t('categoriesSection')}</h2>
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-[14px] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  placeholder={t('categoryNamePlaceholder')}
                  className="flex-1 bg-bg border border-border rounded-[10px] px-3 py-2 text-text font-body placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="text-muted hover:text-accent font-body text-sm transition-colors px-2"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.words.map((word) => (
                  <span key={word} className="flex items-center gap-1 bg-bg border border-border rounded-[8px] px-3 py-1 text-xs text-text font-body">
                    {word}
                    <button
                      onClick={() => removeWord(cat.id, word)}
                      disabled={cat.words.length <= 2}
                      className="text-muted hover:text-accent disabled:opacity-30 transition-colors ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cat.wordInput}
                  onChange={(e) => updateWordInput(cat.id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addWord(cat.id); } }}
                  placeholder={t('addWordPlaceholder')}
                  className="flex-1 bg-bg border border-border rounded-[10px] px-3 py-2 text-text font-body placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button
                  onClick={() => addWord(cat.id)}
                  className="bg-card hover:bg-border border border-border text-text font-body text-sm px-3 py-2 rounded-[10px] transition-colors"
                >
                  {t('addWord')}
                </button>
              </div>
              {cat.words.length < 2 && (
                <p className="text-xs text-muted font-body">{t('minTwoWords')}</p>
              )}
            </div>
          ))}

          <button
            onClick={addCategory}
            className="w-full border border-dashed border-border rounded-[14px] py-4 text-muted hover:text-text hover:border-text font-body text-sm transition-colors"
          >
            {t('addCategory')}
          </button>
        </div>

        {error && <p className="text-accent text-sm font-body">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-accent hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-4 rounded-[14px] transition-all text-lg"
        >
          {saving ? t('saving') : isRtl ? `← ${t('saveChanges')}` : `${t('saveChanges')} →`}
        </button>
      </div>
    </div>
  );
}
