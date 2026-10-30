import { forwardRef } from 'react'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Screen-reader suffix, e.g. "(opens in new tab)" */
  newTabLabel: string
  iconClassName?: string
}

/** Plain <a> to another site: new tab, ExternalLink icon and an sr-only announcement. */
export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(function ExternalLink(
  { href, newTabLabel, iconClassName = 'h-3 w-3 flex-shrink-0', children, ...rest },
  ref
) {
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener" {...rest}>
      {children}
      <ExternalLinkIcon aria-hidden="true" className={iconClassName} />
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  )
})
