import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
}

/** Convite para instalar a app, mostrado no telemóvel até ser aceite ou dispensado. */
export function InstallBanner({ onInstall, onDismiss }: InstallBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm lg:hidden">
      <img src="/icon-192.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Instale a app Kamba</p>
        <p className="text-xs text-muted-foreground">Acesso rápido, mesmo sem internet.</p>
      </div>
      <Button size="sm" onClick={onInstall}>
        Instalar
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onDismiss} aria-label="Dispensar">
        <X aria-hidden />
      </Button>
    </div>
  )
}
