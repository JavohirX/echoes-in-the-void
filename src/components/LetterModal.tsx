import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Letter {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface LetterModalProps {
  letter: Letter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LetterModal = ({ letter, open, onOpenChange }: LetterModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  if (!letter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`max-w-2xl border-0 bg-transparent p-0 transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="paper-texture rounded-lg p-12 shadow-2xl" style={{ boxShadow: 'var(--paper-shadow)' }}>
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-paper-foreground">
              {letter.title}
            </h2>
            <div className="h-px bg-paper-foreground/20" />
            <p className="font-serif text-lg leading-relaxed text-paper-foreground/90 whitespace-pre-wrap">
              {letter.content}
            </p>
            <div className="pt-4 text-right text-sm text-paper-foreground/60">
              {new Date(letter.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
