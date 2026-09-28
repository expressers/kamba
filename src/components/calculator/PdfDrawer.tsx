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
import { formatKz } from '@/lib/format'

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

const FIELDS: { id: keyof PdfFields; label: string; placeholder: string }[] = [
  { id: 'description', label: 'Para que é a compra?', placeholder: 'Ex: Subscrição Netflix' },
  { id: 'cardholder', label: 'Titular do cartão Kamba', placeholder: 'Quem recebe o dinheiro' },
  { id: 'payer', label: 'Quem paga', placeholder: 'Quem entrega o dinheiro' },
]

export function PdfDrawer({ open, onOpenChange, total, onGenerate }: PdfDrawerProps) {
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
            <DrawerTitle>Enviar a quem vai pagar</DrawerTitle>
            <DrawerDescription>
              O PDF mostra que é preciso entregar{' '}
              <strong className="text-foreground tabular-nums">{formatKz(total)}</strong> ao titular do
              cartão, com o cálculo completo. Os campos abaixo são opcionais.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            {FIELDS.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={`pdf-${f.id}`}>{f.label}</Label>
                <Input
                  id={`pdf-${f.id}`}
                  maxLength={60}
                  placeholder={f.placeholder}
                  value={fields[f.id]}
                  onChange={(e) => setFields((prev) => ({ ...prev, [f.id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <DrawerFooter>
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : <FileDown aria-hidden />}
              Gerar e partilhar PDF
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
