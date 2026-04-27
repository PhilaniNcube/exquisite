"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function CopySchoolLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API isn't available
      const el = document.createElement("textarea")
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Parent Access Link</p>
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
        <p className="flex-1 truncate text-sm font-mono break-all">{url}</p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={handleCopy}
          aria-label="Copy parent access link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
    </div>
  )
}
