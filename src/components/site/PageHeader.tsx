import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  children?: ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-1.5 lg:mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">{title}</h1>
      {children && <p className="text-sm text-pretty text-muted-foreground lg:text-base">{children}</p>}
    </div>
  )
}
