'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import type { CompanyConfig } from '@/lib/company-types'

interface AnalyticsHeadProps {
  company: CompanyConfig | null
}

/**
 * Client component for analytics scripts
 * Uses Next.js Script with beforeInteractive strategy to load in head
 */
export function AnalyticsHead({ company }: AnalyticsHeadProps) {
  const googleAnalyticsId = company?.googleAnalyticsId
  const yandexMetrikaId = company?.yandexMetrikaId

  // Move scripts to head using useEffect
  useEffect(() => {
    if (googleAnalyticsId && typeof window !== 'undefined') {
      // Create and append gtag.js script
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      document.head.appendChild(script1)

      // Create and append config script
      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}');
      `
      document.head.appendChild(script2)

      return () => {
        // Cleanup on unmount
        document.head.removeChild(script1)
        document.head.removeChild(script2)
      }
    }
  }, [googleAnalyticsId])

  if (!googleAnalyticsId && !yandexMetrikaId) {
    return null
  }

  return (
    <>
      {/* Яндекс.Метрика - using Script component */}
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

