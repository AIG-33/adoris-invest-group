import Script from 'next/script'
import type { CompanyConfig } from '@/lib/company-types'

interface AnalyticsHeadProps {
  company: CompanyConfig | null
}

/**
 * Server component for analytics scripts
 * Uses Next.js Script with beforeInteractive strategy to load in head
 * This ensures scripts are in head section for proper Google Analytics detection
 */
export function AnalyticsHead({ company }: AnalyticsHeadProps) {
  const googleAnalyticsId = company?.googleAnalyticsId
  const yandexMetrikaId = company?.yandexMetrikaId

  if (!googleAnalyticsId && !yandexMetrikaId) {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 — afterInteractive: keeps GA out of the critical
          rendering path (Next.js docs explicitly recommend this for analytics). */}
      {googleAnalyticsId && (
        <>
          <Script
            id="google-analytics-gtag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Яндекс.Метрика */}
      {yandexMetrikaId && (
        <>
          <Script
            id="yandex-metrika"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                
                ym(${yandexMetrikaId}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
                });
              `,
            }}
          />
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}
    </>
  )
}

