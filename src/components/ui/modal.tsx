'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  function onDismiss() {
    router.back()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal backdrop:bg-black/80 bg-transparent p-0 open:flex open:items-center open:justify-center max-w-none w-full h-full"
      onClose={onDismiss}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onDismiss()
        }
      }}
    >
      <div className="relative">
        <button
          onClick={onDismiss}
          className="absolute -top-4 -right-4 z-10 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>,
    document.getElementById('modal-root') ?? document.body
  )
}
