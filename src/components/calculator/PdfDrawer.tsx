import { FileDown, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/i18n'

export interface PdfFields {
  description: string
  cardholder: string
  payer: string
}

interface PdfDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onGenerate: (fields: PdfFields) => Promise<void>
}

const FIELDS: (keyof PdfFields)[] = ['description', 'cardholder', 'payer']

export function PdfDrawer({ open, onOpenChange, total, onGenerate }: PdfDrawerProps) {
  const { t, f } = useI18n()
  const [fields, setFields] = useState<PdfFields>({ description: '', cardholder: '', payer: '' })
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onGenerate(fields)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <form onSubmit={submit} className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t.pdfDrawer.title}</DrawerTitle>
            <DrawerDescription>{t.pdfDrawer.description(f.kz(total))}</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            {FIELDS.map((id) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={`pdf-${id}`}>{t.pdfDrawer[`${id}_label`]}</Label>
                <Input
                  id={`pdf-${id}`}
                  maxLength={60}
                  placeholder={t.pdfDrawer[`${id}_placeholder`]}
                  value={fields[id]}
                  onChange={(e) => setFields((prev) => ({ ...prev, [id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <DrawerFooter>
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : <FileDown aria-hidden />}
              {t.pdfDrawer.submit}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
