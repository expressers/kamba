import { Download, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PAGE_ICONS, PAGE_IDS } from '@/content/routes'
import { useI18n } from '@/i18n'
import { EXCHANGE_SOURCE, PRICING_SOURCE } from '@/lib/kamba'
import { cn } from '@/lib/utils'
import { LanguageSwitch } from './LanguageSwitch'
import { Link } from './Link'
import { PoweredBy } from './PoweredBy'

interface SiteHeaderProps {
  installable: boolean
  onInstall: () => void
}

export function SiteHeader({ installable, onInstall }: SiteHeaderProps) {
  const { t, f, page, href } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="app-header sticky top-0 z-30 border-b bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-4 px-4 lg:h-16 lg:max-w-6xl lg:px-8">
        <Link href={href('calculator')} className="flex items-center gap-2.5 font-semibold tracking-tight">
          <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
            <rect width="32" height="32" rx="8" fill="var(--brand)" />
            <rect x="6" y="10" width="20" height="13" rx="2.5" fill="var(--gold)" />
            <rect x="6" y="13.5" width="20" height="2.6" fill="var(--brand)" />
          </svg>
          <span>
            Kamba<span className="font-normal text-muted-foreground"> · {t.pages.calculator.label}</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav aria-label={t.header.mainNav} className="hidden items-center gap-1 lg:flex">
          {PAGE_IDS.map((id) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              asChild
              className={cn(id === page && 'bg-muted text-foreground')}
            >
              <Link href={href(id)} aria-current={id === page ? 'page' : undefined}>
                {t.pages[id].label}
              </Link>
            </Button>
          ))}
          <LanguageSwitch className="ml-2" />
          {installable && (
            <Button size="sm" variant="outline" className="ml-2" onClick={onInstall}>
              <Download aria-hidden />
              {t.header.installApp}
            </Button>
          )}
        </nav>

        {/* Telemóvel */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitch />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2" aria-label={t.header.openMenu}>
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] gap-0 pb-[env(safe-area-inset-bottom)]">
              <SheetHeader className="border-b">
                <SheetTitle>{t.header.menu}</SheetTitle>
                <SheetDescription className="sr-only">{t.header.menuDescription}</SheetDescription>
              </SheetHeader>

              <nav aria-label={t.header.menu} className="flex-1 overflow-y-auto p-2">
                {PAGE_IDS.map((id) => {
                  const Icon = PAGE_ICONS[id]
                  const active = id === page
                  return (
                    <Link
                      key={id}
                      href={href(id)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted active:bg-muted',
                        active && 'bg-muted',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted',
                          active && 'bg-primary text-primary-foreground',
                        )}
                      >
                        <Icon className="size-4.5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">{t.pages[id].label}</span>
                        <span className="block text-xs text-muted-foreground">{t.pages[id].hint}</span>
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="space-y-4 border-t p-4">
                {installable && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setMenuOpen(false)
                      onInstall()
                    }}
                  >
                    <Download aria-hidden />
                    {t.header.installPhone}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  {t.header.footnote(f.date(EXCHANGE_SOURCE.date), f.date(PRICING_SOURCE.date))}
                </p>
                <PoweredBy />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
