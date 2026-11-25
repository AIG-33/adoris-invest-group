'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const STORAGE_KEY = 'shop-viena-cookie-consent'
const CHANGE_EVENT = 'cookie-consent-changed'

type Consent = { analytics: boolean; decidedAt: string }

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

function saveConsent(analytics: boolean) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, decidedAt: new Date().toISOString() }))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** undefined until mounted (localStorage is client-only), null when the visitor has not chosen yet. */
function useConsent(): Consent | null | undefined {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)
  useEffect(() => {
    const sync = () => setConsent(readConsent())
    sync()
    window.addEventListener(CHANGE_EVENT, sync)
    return () => window.removeEventListener(CHANGE_EVENT, sync)
  }, [])
  return consent
}

/** Cookie banner plus analytics counters that load only after "Принять". */
export function VienaCookieConsent({
  googleAnalyticsId,
  yandexMetrikaId,
}: {
  googleAnalyticsId?: string | null
  yandexMetrikaId?: string | null
}) {
  const consent = useConsent()

  return (
    <>
      {consent?.analytics && googleAnalyticsId && (
        <>
          <Script
            id="google-analytics-gtag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
          </Script>
        </>
      )}
      {consent?.analytics && yandexMetrikaId && (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${yandexMetrikaId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
        </Script>
      )}

      {consent === null && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-5 pointer-events-none"
          role="dialog"
          aria-label="Настройки cookie и аналитики"
        >
          <div className="pointer-events-auto max-w-[1100px] mx-auto rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-4 md:px-6 md:py-5">
            <p className="text-[13px] md:text-sm leading-relaxed text-neutral-800 mb-4">
              Мы используем необходимые cookie для работы сайта. Аналитические инструменты (Яндекс.Метрика, Google
              Analytics) подключаются только с вашего согласия. Подробнее — в политиках ниже.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 text-xs md:text-[13px]">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href="/privacy" className="font-semibold underline-offset-2 hover:underline">
                  Политика обработки персональных данных
                </Link>
                <span className="text-neutral-400" aria-hidden>
                  ·
                </span>
                <Link href="/cookies" className="font-semibold underline-offset-2 hover:underline">
                  Политика cookie
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => saveConsent(false)}
                  className="px-4 py-2 rounded-lg border-2 border-neutral-300 text-neutral-800 font-semibold hover:bg-neutral-50"
                >
                  Только необходимые
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent(true)}
                  className="px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: 'var(--company-accent, #000000)' }}
                >
                  Принять
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** On the cookie policy page: withdraw analytics consent (reload drops already-loaded counters). */
export function CookieRevokePanel() {
  const consent = useConsent()
  if (consent === undefined) return null

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
      <h2 className="text-lg font-bold text-neutral-900 mb-2">Отзыв согласия на аналитические cookie</h2>
      <p className="text-sm text-neutral-700 leading-relaxed mb-4">
        Если вы ранее разрешили аналитику, можете отозвать разрешение. Страница перезагрузится — сторонние счётчики не
        будут активированы до следующего выбора в баннере.
      </p>
      {consent?.analytics ? (
        <button
          type="button"
          onClick={() => {
            saveConsent(false)
            window.location.reload()
          }}
          className="px-4 py-2 rounded-lg border-2 border-neutral-300 text-neutral-800 text-sm font-semibold hover:bg-white"
        >
          Отозвать согласие на аналитику
        </button>
      ) : (
        <p className="text-sm text-neutral-600">
          Аналитические cookie сейчас не разрешены (или используются только необходимые cookie).
        </p>
      )}
    </div>
  )
}

/** Required personal-data consent checkbox for every form that collects personal data on shop.viena.by. */
export function PdConsentCheckbox({
  checked,
  onChange,
  className = '',
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}) {
  return (
    <label className={`flex items-start gap-2.5 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onInvalid={(e) => e.currentTarget.setCustomValidity('Необходимо дать согласие на обработку персональных данных')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-neutral-800"
      />
      <span className="text-xs text-neutral-700 leading-relaxed text-left">
        Я согласен(а) на обработку персональных данных в соответствии с{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-950">
          Политикой обработки персональных данных
        </a>
        , включая их передачу за пределы Республики Беларусь.
      </span>
    </label>
  )
}
