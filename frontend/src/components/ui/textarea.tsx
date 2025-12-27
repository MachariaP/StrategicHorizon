import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && autoResize) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [autoResize])

    React.useEffect(() => {
      adjustHeight()
    }, [props.value, adjustHeight])

    React.useImperativeHandle(ref, () => textareaRef.current!)

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          autoResize && "resize-none overflow-hidden",
          className
        )}
        ref={textareaRef}
        onInput={adjustHeight}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
