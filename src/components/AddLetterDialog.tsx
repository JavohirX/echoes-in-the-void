import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLetterDialog = ({ open, onOpenChange }: AddLetterDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('letters')
        .insert([{ title: title.trim(), content: content.trim() }]);

      if (error) throw error;

      toast.success("Your letter has been cast into the void");
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding letter:', error);
      toast.error("Failed to send letter");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">Write into the void</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="From who, to who..."
              className="bg-secondary border-border text-foreground"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Your message
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write what you need to say..."
              className="min-h-[200px] bg-secondary border-border text-foreground resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Sending..." : "Send into the void"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
