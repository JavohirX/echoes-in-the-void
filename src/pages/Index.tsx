import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LetterModal } from "@/components/LetterModal";
import { AddLetterDialog } from "@/components/AddLetterDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Letter {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const Index = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetchLetters();
    setupRealtimeSubscription();
    playAudio();
  }, []);

  const fetchLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching letters:', error);
      toast.error("Failed to load letters");
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('letters-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'letters'
        },
        (payload) => {
          setLetters((current) => [payload.new as Letter, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log('Audio autoplay prevented:', error);
      });
    }
  };

  const handleScreenClick = () => {
    // Ensure audio plays on user interaction
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    }
    
    if (letters.length === 0) return;
    
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setSelectedLetter(randomLetter);
    setIsLetterModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        src="/bg.m4a"
      />

      {/* Clickable Area */}
      <div
        onClick={handleScreenClick}
        className="fixed inset-0 cursor-pointer transition-all hover:bg-white/5"
        role="button"
        aria-label="Click to read a letter"
      />

      {/* Add Letter Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setIsAddDialogOpen(true);
        }}
        size="lg"
        className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-primary shadow-2xl transition-all hover:scale-110 hover:bg-primary/90"
      >
        <Plus className="h-8 w-8 text-primary-foreground" />
      </Button>

      {/* Modals */}
      <LetterModal
        letter={selectedLetter}
        open={isLetterModalOpen}
        onOpenChange={setIsLetterModalOpen}
      />
      
      <AddLetterDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Index;
