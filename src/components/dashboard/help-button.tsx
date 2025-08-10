
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingModal } from './onboarding-modal';
import { HelpCircle } from 'lucide-react';

export function HelpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <OnboardingModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsModalOpen(true)}
        className="group/button rounded-full size-10 bg-background/50 dark:bg-zinc-800/80 backdrop-blur-sm border border-black/10 dark:border-white/20 text-black dark:text-white hover:bg-gradient-to-r from-[#AD00EC] to-[#1700E6] dark:hover:bg-gradient-to-r dark:from-[#AD00EC] dark:to-[#1700E6]"
      >
        <HelpCircle className="size-5 text-black dark:text-white group-hover/button:text-white dark:group-hover/button:text-white" />
        <span className="sr-only">Ayuda</span>
      </Button>
    </>
  );
}
