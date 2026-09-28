import { CalculateCta } from '@/components/site/CalculateCta'
import { PageHeader } from '@/components/site/PageHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useI18n } from '@/i18n'

export function FaqPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.pages.faq.heading}>{t.pages.faq.intro}</PageHeader>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4 sm:px-5">
        {t.faq.map((item, i) => (
          <AccordionItem key={item.question} value={`q${i}`}>
            <AccordionTrigger className="py-4 text-left hover:no-underline">
              <h2>{item.question}</h2>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <CalculateCta />
    </div>
  )
}
