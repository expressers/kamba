import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'

interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
}

/** Convite para instalar a app, mostrado no telemóvel até ser aceite ou dispensado. */
export function InstallBanner({ onInstall, onDismiss }: InstallBannerProps) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm lg:hidden">
      <img src="/icon-192.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t.install.title}</p>
        <p className="text-xs text-muted-foreground">{t.install.subtitle}</p>
      </div>
      <Button size="sm" onClick={onInstall}>
        {t.install.install}
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onDismiss} aria-label={t.install.dismiss}>
        <X aria-hidden />
      </Button>
    </div>
  )
}
