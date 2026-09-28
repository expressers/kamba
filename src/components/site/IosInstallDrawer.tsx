import { Share, SquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useI18n } from '@/i18n'

interface IosInstallDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** No iPhone não há diálogo de instalação: explicamos os dois toques no Safari. */
export function IosInstallDrawer({ open, onOpenChange }: IosInstallDrawerProps) {
  const { t } = useI18n()
  const [shareBefore, share, shareAfter] = t.install.iosShare
  const [addBefore, add, addAfter] = t.install.iosAdd
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t.install.iosTitle}</DrawerTitle>
            <DrawerDescription>{t.install.iosDescription}</DrawerDescription>
          </DrawerHeader>
          <ol className="space-y-3 px-4">
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
              <Share className="size-5 shrink-0 text-[#0a84ff]" aria-hidden />
              <span>
                {shareBefore} <strong>{share}</strong> {shareAfter}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
              <SquarePlus className="size-5 shrink-0" aria-hidden />
              <span>
                {addBefore} <strong>{add}</strong>
                {addAfter}
              </span>
            </li>
          </ol>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">{t.install.ok}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
