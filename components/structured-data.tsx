import type { StructuredData as StructuredDataType } from '@/lib/seo'

interface StructuredDataProps {
  data: StructuredDataType | StructuredDataType[]
}

/**
 * Component to render JSON-LD structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}

