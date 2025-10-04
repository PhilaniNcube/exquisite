'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent className="p-0 border-none bg-transparent max-w-none w-auto h-auto shadow-none">
        <DialogTitle className="sr-only">Photo Modal</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}