"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: DateRange | null
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value ?? undefined)

  React.useEffect(() => {
    setTempRange(value ?? undefined)
  }, [value])

  const handleOpenChange = (newOpen: boolean) => {
    if (disabled) return
    if (!newOpen) {
      if (tempRange?.from !== value?.from || tempRange?.to !== value?.to) {
        onChange?.(tempRange)
      }
    } else {
      setTempRange(value ?? undefined)
    }
    setOpen(newOpen)
  }

  const handleSelect = (range: DateRange | undefined) => {
    setTempRange(range)
    if (range?.from && range?.to) {
      onChange?.(range)
      setOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTempRange(undefined)
    onChange?.(undefined)
  }

  const displayRange = open ? tempRange : value

  return (
    <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayRange?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {displayRange?.from ? (
              displayRange.to ? (
                <>
                  {format(displayRange.from, "LLL dd, y")} - {format(displayRange.to, "LLL dd, y")}
                </>
              ) : (
                format(displayRange.from, "LLL dd, y")
              )
            ) : (
              placeholder
            )}
          </span>
          {(displayRange?.from || displayRange?.to) && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 shrink-0"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={displayRange?.from}
          selected={displayRange ?? undefined}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
