import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-brand-dark/60 backdrop-blur-sm lg:items-center lg:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col bg-canvas text-ink lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-[20px] lg:border lg:border-line"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="tertiary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
