import { Download, Menu } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NAV } from '@/content/nav'
import { formatDate } from '@/lib/format'
import { EXCHANGE_SOURCE, PRICING_SOURCE } from '@/lib/kamba'

interface SiteHeaderProps {
  installable: boolean
  onInstall: () => void
}

function Logo() {
  return (
    <a href="#calculadora" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <rect x="6" y="10" width="20" height="13" rx="2.5" fill="var(--gold)" />
        <rect x="6" y="13.5" width="20" height="2.6" fill="var(--brand)" />
      </svg>
      <span>
        Kamba<span className="font-normal text-muted-foreground"> · Calculadora</span>
      </span>
    </a>
  )
}

export function SiteHeader({ installable, onInstall }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pendingTarget = useRef<string | null>(null)

  // O menu repõe o scroll ao fechar; só depois navegamos para a secção escolhida.
  const scrollToPending = () => {
    const id = pendingTarget.current
    pendingTarget.current = null
    if (!id) return
    document.getElementById(id)?.scrollIntoView()
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="app-header sticky top-0 z-30 border-b bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-4 px-4 lg:h-16 lg:max-w-6xl lg:px-8">
        <Logo />

        {/* Desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Button key={item.id} variant="ghost" size="sm" asChild>
              <a href={`#${item.id}`}>{item.label}</a>
            </Button>
          ))}
          {installable && (
            <Button size="sm" variant="outline" className="ml-2" onClick={onInstall}>
              <Download aria-hidden />
              Instalar app
            </Button>
          )}
        </nav>

        {/* Telemóvel */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 lg:hidden" aria-label="Abrir menu">
              <Menu className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] gap-0 pb-[env(safe-area-inset-bottom)]"
            onCloseAutoFocus={(e) => {
              if (!pendingTarget.current) return
              e.preventDefault()
              scrollToPending()
            }}
          >
            <SheetHeader className="border-b">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">Secções e informações da calculadora</SheetDescription>
            </SheetHeader>

            <nav aria-label="Menu" className="flex-1 overflow-y-auto p-2">
              {NAV.map(({ id, label, description, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    pendingTarget.current = id
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted active:bg-muted"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{description}</span>
                  </span>
                </a>
              ))}
            </nav>

            <div className="space-y-3 border-t p-4">
              {installable && (
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false)
                    onInstall()
                  }}
                >
                  <Download aria-hidden />
                  Instalar no telemóvel
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Câmbio de {formatDate(EXCHANGE_SOURCE.date)} · Preçário de {formatDate(PRICING_SOURCE.date)}.
                Ferramenta independente, sem ligação ao BAI.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
