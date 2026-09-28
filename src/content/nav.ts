import { Calculator, CircleHelp, ListChecks, Receipt, type LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  description: string
  icon: LucideIcon
}

/** Secções da página, usadas no menu do telemóvel e na navegação do desktop. */
export const NAV: NavItem[] = [
  { id: 'calculadora', label: 'Calculadora', description: 'Quanto carregar e gastar', icon: Calculator },
  { id: 'como-carregar', label: 'Como carregar', description: 'Passo a passo no BAI Directo', icon: ListChecks },
  { id: 'taxas', label: 'Taxas', description: 'Comissões, IVA e limites', icon: Receipt },
  { id: 'perguntas', label: 'Perguntas frequentes', description: 'Dúvidas sobre o Kamba', icon: CircleHelp },
]
