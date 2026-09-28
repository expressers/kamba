import { useEffect, type ReactNode, type Ref } from 'react'
import { focusAtEnd } from '@/lib/dom'
import styles from './AmountField.module.scss'

interface AmountFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  placeholder?: string
  /** Foca o campo ao montar, com o cursor a piscar no fim do valor. */
  autoFocus?: boolean
  inputRef?: Ref<HTMLInputElement>
  /** Controlo à direita do rótulo (ex: escolha de moeda). */
  action?: ReactNode
  children?: ReactNode
}

/** Campo numérico grande; aceita vírgula ou ponto decimal. */
export function AmountField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = '0',
  autoFocus,
  inputRef,
  action,
  children,
}: AmountFieldProps) {
  useEffect(() => {
    if (autoFocus) focusAtEnd(document.getElementById(id) as HTMLInputElement | null)
  }, [autoFocus, id])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {action}
      </div>
      <div className={styles.field}>
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <input
          id={id}
          ref={inputRef}
          className={styles.input}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>
      {children}
    </div>
  )
}
