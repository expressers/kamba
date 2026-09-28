import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ } from '@/content/faq'

export function FaqSection() {
  return (
    <section id="perguntas" aria-labelledby="perguntas-titulo" className="scroll-mt-20 space-y-4">
      <h2 id="perguntas-titulo" className="text-lg font-semibold tracking-tight lg:text-xl">
        Perguntas frequentes
      </h2>
      <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
        {FAQ.map((item, i) => (
          <AccordionItem key={item.question} value={`q${i}`}>
            <AccordionTrigger className="py-3.5 text-left hover:no-underline">
              <h3>{item.question}</h3>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
