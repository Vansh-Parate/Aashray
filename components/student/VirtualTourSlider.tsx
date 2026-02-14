"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface VirtualTourSliderProps {
  images: string[];
  alt?: string;
}

export function VirtualTourSlider({ images, alt = "Listing" }: VirtualTourSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const list = images?.length ? images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"];

  const go = (dir: number) => {
    setCurrentIndex((i) => (i + dir + list.length) % list.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-dark">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            src={list[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          onClick={() => go(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {list.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
              i === currentIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
