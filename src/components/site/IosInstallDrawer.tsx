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

interface IosInstallDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** No iPhone não há diálogo de instalação: explicamos os dois toques no Safari. */
export function IosInstallDrawer({ open, onOpenChange }: IosInstallDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle>Instalar no iPhone</DrawerTitle>
            <DrawerDescription>No Safari, são só dois toques:</DrawerDescription>
          </DrawerHeader>
          <ol className="space-y-3 px-4">
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
              <Share className="size-5 shrink-0 text-[#0a84ff]" aria-hidden />
              <span>
                Toque em <strong>Partilhar</strong> na barra do Safari.
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
              <SquarePlus className="size-5 shrink-0" aria-hidden />
              <span>
                Escolha <strong>Adicionar ao ecrã principal</strong>.
              </span>
            </li>
          </ol>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Entendi</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
