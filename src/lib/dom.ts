/** Foca um campo com o cursor no fim do texto, sem seleccionar (para o cursor piscar). */
export function focusAtEnd(input: HTMLInputElement | null) {
  if (!input) return
  input.focus({ preventScroll: true })
  const end = input.value.length
  input.setSelectionRange(end, end)
}
