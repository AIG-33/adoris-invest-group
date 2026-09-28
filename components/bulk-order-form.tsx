'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ClipboardPaste,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  Package,
  Loader2,
  Sparkles,
  Eraser,
  ImagePlus,
  Upload,
  Camera,
} from 'lucide-react';
import { parseBulkOrderText } from '@/lib/parse-bulk-order';
import {
  OcrImageError,
  recognizeBulkOrderImages,
} from '@/lib/ocr-bulk-order';

interface ProcessedProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
  manufacturer: { name: string; logo?: string | null } | null;
  requestedQuantity: number;
}

interface BulkOrderResult {
  found: ProcessedProduct[];
  notFound: string[];
}

interface BulkOrderTranslations {
  title: string
  subtitle: string
  enterProducts: string
  instructions: string
  process: string
  results: string
  addAllToCart: string
  items?: string
  pasteTitle?: string
  pasteSubtitle?: string
  pastePlaceholder?: string
  pasteFromClipboard?: string
  tryExample?: string
  clear?: string
  processing?: string
  linesDetected?: string
  anyFormat?: string
  found?: string
  notFound?: string
  foundProducts?: string
  notFoundSkus?: string
  errorEmpty?: string
  errorNoItems?: string
  errorGeneric?: string
  photoTitle?: string
  photoSubtitle?: string
  photoDropHint?: string
  photoBrowse?: string
  photoCamera?: string
  photoRecognizing?: string
  photoProgress?: string
  photoSuccess?: string
  photoErrorGeneric?: string
  photoErrorTooLarge?: string
  photoErrorType?: string
  photoErrorEmpty?: string
}

interface BulkOrderFormProps {
  translations: BulkOrderTranslations
}

const EXAMPLE_TEXT = `10446232\t2
07P3203, 5
05031738; 12
Veronal Buffer 10445724 2`;

const FORMAT_SAMPLES = ['10446232  2', '07P3203, 5', '05031738; 12'];

const MIN_GUTTER_ROWS = 12;

const ACCEPT_ATTR = 'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp';

function collectClipboardImages(data: DataTransfer | null): File[] {
  if (!data) return [];
  const files: File[] = [];
  const items = data.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
  }
  if (files.length === 0 && data.files?.length) {
    for (let i = 0; i < data.files.length; i++) {
      const file = data.files[i];
      if (file.type.startsWith('image/')) files.push(file);
    }
  }
  return files;
}

export default function BulkOrderForm({ translations }: BulkOrderFormProps) {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BulkOrderResult | null>(null);
  const [error, setError] = useState('');
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrSuccess, setOcrSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const ocrBusyRef = useRef(false);

  const t = translations;
  const parsedCount = useMemo(() => parseBulkOrderText(inputText).length, [inputText]);
  const lineNumbers = useMemo(() => {
    const rows = Math.max(inputText.split('\n').length, MIN_GUTTER_ROWS);
    return Array.from({ length: rows }, (_, i) => i + 1);
  }, [inputText]);

  const focusEditor = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  };

  const mapOcrError = useCallback((err: unknown): string => {
    if (err instanceof OcrImageError) {
      if (err.message === 'FILE_TOO_LARGE') {
        return t.photoErrorTooLarge || 'Image is too large (max 10 MB).';
      }
      if (err.message === 'UNSUPPORTED_TYPE') {
        return t.photoErrorType || 'Unsupported file type. Use PNG, JPEG, or WebP.';
      }
      if (err.message === 'NO_IMAGE') {
        return t.photoErrorGeneric || 'Could not read text from that image.';
      }
    }
    return t.photoErrorGeneric || 'Could not read text from that image. Try a clearer photo or paste the text instead.';
  }, [t.photoErrorGeneric, t.photoErrorTooLarge, t.photoErrorType]);

  const applyOcrText = useCallback((text: string) => {
    setInputText((prev) => {
      const trimmed = text.trim();
      if (!trimmed) return prev;
      if (!prev.trim()) return trimmed;
      return `${prev.replace(/\s+$/, '')}\n${trimmed}`;
    });
  }, []);

  const runOcr = useCallback(async (images: File[]) => {
    if (images.length === 0 || ocrBusyRef.current) return;

    ocrBusyRef.current = true;
    setIsOcrRunning(true);
    setOcrProgress(0);
    setOcrSuccess('');
    setError('');
    setResult(null);

    try {
      const text = await recognizeBulkOrderImages(images, ({ progress }) => {
        setOcrProgress(Math.max(0, Math.min(1, progress)));
      });

      if (!text.trim()) {
        setError(t.photoErrorEmpty || 'No readable text found in the image.');
        return;
      }

      applyOcrText(text);
      setOcrSuccess(t.photoSuccess || 'Text extracted — review the editor below, then Process Items.');
      setOcrProgress(1);
      requestAnimationFrame(() => focusEditor());
    } catch (err) {
      setError(mapOcrError(err));
    } finally {
      ocrBusyRef.current = false;
      setIsOcrRunning(false);
    }
  }, [applyOcrText, mapOcrError, t.photoErrorEmpty, t.photoSuccess]);

  // Image paste (Ctrl/Cmd+V) anywhere inside the form card — text paste stays native.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const root = formCardRef.current;
      if (!root) return;
      const target = e.target as Node | null;
      if (target && !root.contains(target) && document.activeElement && !root.contains(document.activeElement)) {
        return;
      }

      const images = collectClipboardImages(e.clipboardData);
      if (images.length === 0) return;

      e.preventDefault();
      void runOcr(images);
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [runOcr]);

  const handleProcess = async () => {
    setError('');
    setOcrSuccess('');
    setResult(null);

    if (!inputText.trim()) {
      setError(t.errorEmpty || 'Please enter catalog numbers and quantities');
      focusEditor();
      return;
    }

    setIsProcessing(true);

    try {
      const items = parseBulkOrderText(inputText).map((item) => ({
        sku: item.sku,
        quantity: String(item.quantity),
      }));

      if (items.length === 0) {
        setError(t.errorNoItems || 'No valid items found. Please enter a catalog number and quantity on each line.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/bulk-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.errorGeneric);
      }

      const data: BulkOrderResult = await response.json();
      setResult(data);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    } catch (err: any) {
      setError(err.message || t.errorGeneric || 'An error occurred while processing your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      // Prefer image from clipboard when available (async Clipboard API).
      if (navigator.clipboard && 'read' in navigator.clipboard) {
        try {
          const items = await navigator.clipboard.read();
          const images: File[] = [];
          for (const item of items) {
            const imageType = item.types.find((type) => type.startsWith('image/'));
            if (!imageType) continue;
            const blob = await item.getType(imageType);
            images.push(new File([blob], `clipboard.${imageType.split('/')[1] || 'png'}`, { type: imageType }));
          }
          if (images.length > 0) {
            await runOcr(images);
            return;
          }
        } catch {
          // Fall through to text clipboard — permission or empty image.
        }
      }

      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setInputText((prev) => (prev.trim() ? `${prev.replace(/\s+$/, '')}\n${text}` : text));
        setOcrSuccess('');
      }
    } catch {
      // Clipboard permission denied — fall back to a manual paste.
    } finally {
      focusEditor();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length > 0) void runOcr(files);
  };

  const addToCart = () => {
    if (!result || result.found.length === 0) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    result.found.forEach(product => {
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.requestedQuantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          price: product.price,
          image: product.imageUrl || '',
          imageUrl: product.imageUrl,
          category: product.category?.name,
          manufacturer: {
            name: product.manufacturer?.name || '',
            logo: product.manufacturer?.logo || null,
          },
          quantity: product.requestedQuantity,
        });
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    router.push('/cart');
  };

  const isIdle = inputText.length === 0 && !result;
  const progressPct = Math.round(ocrProgress * 100);

  return (
    <div className="relative">
      {/* Colored halo so the paste card lifts off the page even when the
          tenant brand is grayscale. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.25rem] blur-2xl"
        style={{
          background:
            'radial-gradient(60% 70% at 15% 0%, var(--accent-blue-soft), transparent 70%), radial-gradient(60% 70% at 90% 100%, var(--accent-mint-soft), transparent 70%)',
        }}
      />

      <div
        ref={formCardRef}
        className="rounded-[1.75rem] p-[1.5px] shadow-[0_34px_90px_-46px_rgba(15,15,30,0.55)]"
        style={{ background: 'var(--brand-grad)' }}
      >
        <div className="rounded-[1.68rem] bg-white p-5 sm:p-7">
          {/* ─── Header ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-white"
                style={{ background: 'var(--brand-grad)' }}
              >
                <ClipboardPaste className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                  {t.pasteTitle || t.enterProducts}
                </h2>
                <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-neutral-600">
                  {t.pasteSubtitle || t.instructions}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="text-[11px] font-medium text-neutral-400">
                {t.anyFormat || 'Any format works'}
              </span>
              {['TAB', ',', ';', '␣'].map((sep) => (
                <span
                  key={sep}
                  className="font-mono-brand rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500"
                >
                  {sep}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Photo / OCR drop zone ──────────────────────────────── */}
          <div
            role="button"
            tabIndex={0}
            aria-label={t.photoTitle || 'Upload or paste a photo of your list'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepthRef.current += 1;
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
              if (dragDepthRef.current === 0) setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragDepthRef.current = 0;
              setIsDragging(false);
              const files = Array.from(e.dataTransfer.files || []).filter((f) =>
                f.type.startsWith('image/') || !f.type
              );
              if (files.length > 0) void runOcr(files);
            }}
            className={`mt-5 rounded-2xl border-2 border-dashed px-4 py-5 transition-colors sm:px-5 ${
              isDragging
                ? 'border-[color:var(--brand-1)] bg-[color:var(--brand-1)]/[0.06]'
                : 'border-neutral-200 bg-neutral-50/80 hover:border-neutral-300'
            } ${isOcrRunning ? 'pointer-events-none opacity-80' : ''}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                  style={{
                    background: 'var(--accent-blue-soft)',
                    color: 'var(--brand-1)',
                  }}
                >
                  <ImagePlus className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {t.photoTitle || 'Or paste / upload a photo of your list'}
                  </div>
                  <p className="mt-0.5 max-w-md text-[12.5px] leading-relaxed text-neutral-600">
                    {t.photoSubtitle ||
                      'Photograph a paper list or screenshot — OCR fills the editor.'}
                  </p>
                  <p className="mt-1.5 text-[11px] text-neutral-400">
                    {t.photoDropHint || 'Drop images here, or press Ctrl/Cmd+V to paste a screenshot'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                <button
                  type="button"
                  disabled={isOcrRunning}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {t.photoBrowse || 'Upload image'}
                </button>
                <button
                  type="button"
                  disabled={isOcrRunning}
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 sm:hidden"
                >
                  <Camera className="h-4 w-4" />
                  {t.photoCamera || 'Take photo'}
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              multiple
              className="hidden"
              onChange={onFileInputChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileInputChange}
            />

            {isOcrRunning && (
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-neutral-700">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: 'var(--brand-1)' }} />
                    {t.photoRecognizing || 'Reading text from image…'}
                  </span>
                  <span className="font-mono-brand text-neutral-500">
                    {t.photoProgress || 'OCR progress'} {progressPct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full transition-[width] duration-200"
                    style={{
                      width: `${progressPct}%`,
                      background: 'var(--brand-grad)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── Editor ─────────────────────────────────────────────── */}
          <div
            className={`paste-editor relative mt-5 overflow-hidden rounded-2xl border-2 bg-neutral-950 ${
              isIdle ? 'paste-editor--idle' : ''
            }`}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-11 select-none overflow-hidden border-r border-white/10 bg-white/[0.04]">
              <div
                ref={gutterRef}
                className="font-mono-brand px-2 py-4 text-right text-[12px] leading-6 text-white/25"
              >
                {lineNumbers.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (ocrSuccess) setOcrSuccess('');
              }}
              onScroll={(e) => {
                if (gutterRef.current) {
                  gutterRef.current.style.transform = `translateY(${-e.currentTarget.scrollTop}px)`;
                }
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleProcess();
                }
              }}
              wrap="off"
              spellCheck={false}
              aria-label={t.pasteTitle || t.enterProducts}
              placeholder={t.pastePlaceholder || `10446232\t2\n07P3203, 5`}
              className="font-mono-brand relative block h-56 w-full resize-none bg-transparent py-4 pl-14 pr-4 text-[13px] leading-6 text-neutral-100 outline-none sm:h-64"
            />

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.04] px-4 py-2.5">
              <span className="font-mono-brand text-[11px] text-white/50">
                <span className="font-semibold text-white/80">{parsedCount}</span>{' '}
                {t.linesDetected || 'items recognised'}
              </span>
              <span className="hidden font-mono-brand text-[11px] text-white/35 sm:block">
                ⌘/Ctrl + Enter
              </span>
            </div>
          </div>

          {/* ─── Actions ────────────────────────────────────────────── */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleProcess}
              disabled={isProcessing || isOcrRunning || !inputText.trim()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              style={{ background: 'var(--brand-grad)', boxShadow: '0 10px 28px var(--brand-1-dim)' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.processing || 'Processing…'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t.process}
                </>
              )}
            </button>

            <button
              onClick={pasteFromClipboard}
              disabled={isOcrRunning}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
            >
              <ClipboardPaste className="h-4 w-4" />
              {t.pasteFromClipboard || 'Paste from clipboard'}
            </button>

            {inputText ? (
              <button
                onClick={() => {
                  setInputText('');
                  setResult(null);
                  setError('');
                  setOcrSuccess('');
                  focusEditor();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
              >
                <Eraser className="h-4 w-4" />
                {t.clear || 'Clear'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setInputText(EXAMPLE_TEXT);
                  setError('');
                  setOcrSuccess('');
                  focusEditor();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
              >
                {t.tryExample || 'Fill in an example'}
              </button>
            )}
          </div>

          {/* Format samples — show, rather than describe, what to paste. */}
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
            <span className="text-[11px] font-medium text-neutral-400">
              {t.anyFormat || 'Any format works'}:
            </span>
            {FORMAT_SAMPLES.map((sample) => (
              <code
                key={sample}
                className="font-mono-brand rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10.5px] text-neutral-500"
              >
                {sample}
              </code>
            ))}
          </div>

          {ocrSuccess && !error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-800">{ocrSuccess}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* ─── Results ────────────────────────────────────────────── */}
          {result && (
            <div ref={resultsRef} className="mt-7 border-t border-neutral-200 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold tracking-tight text-neutral-900">
                  {t.results}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {result.found.length} {t.found || 'found'}
                  </span>
                  {result.notFound.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[12px] font-semibold text-red-700">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {result.notFound.length} {t.notFound || 'not found'}
                    </span>
                  )}
                </div>
              </div>

              {result.found.length > 0 && (
                <div className="mt-4">
                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {result.found.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          {product.imageUrl && product.imageUrl.length > 0 ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name || 'Product'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-neutral-900">
                            {product.name}
                          </div>
                          <div className="font-mono-brand text-xs text-neutral-500">{product.sku}</div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-mono-brand text-sm font-bold text-neutral-900">
                            ×{product.requestedQuantity}
                          </div>
                          <div className="font-mono-brand text-xs text-neutral-500">
                            €{(Number(product.price || 0) * product.requestedQuantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addToCart}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
                    style={{ background: 'var(--brand-grad)', boxShadow: '0 10px 28px var(--brand-1-dim)' }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t.addAllToCart} ({result.found.length} {t.items || 'items'})
                  </button>
                </div>
              )}

              {result.notFound.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {t.notFoundSkus || 'Not found'}
                  </div>
                  <div className="flex flex-wrap gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    {result.notFound.map((sku, index) => (
                      <span
                        key={index}
                        className="font-mono-brand rounded-md border border-red-300 bg-white px-2 py-1 text-xs text-red-700"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
