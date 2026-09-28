import type { ReactNode } from 'react'
import styles from './AmountField.module.scss'

interface AmountFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  placeholder?: string
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
  action,
  children,
}: AmountFieldProps) {
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
          className={styles.input}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))}
          onFocus={(e) => e.target.select()}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>
      {children}
    </div>
  )
}
