"use client";

import {
    Home,
    ShieldCheck,
    Users,
    IndianRupee,
    MapPin,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type CategoryKey = "all" | "safe" | "sharing" | "budget" | "nearby" | "premium";

const categories: { key: CategoryKey; icon: typeof Home; label: string }[] = [
    { key: "all", icon: Home, label: "All" },
    { key: "safe", icon: ShieldCheck, label: "Safe" },
    { key: "sharing", icon: Users, label: "Sharing" },
    { key: "budget", icon: IndianRupee, label: "Budget" },
    { key: "nearby", icon: MapPin, label: "Nearby" },
    { key: "premium", icon: Star, label: "Premium" },
];

interface CategoryBarProps {
    active: CategoryKey;
    onChange: (key: CategoryKey) => void;
}

export function CategoryBar({ active, onChange }: CategoryBarProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5 border-b border-surface-dark">
            {categories.map((cat) => {
                const isActive = cat.key === active;
                return (
                    <button
                        key={cat.key}
                        onClick={() => onChange(cat.key)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap",
                            isActive
                                ? "bg-primary-dark text-white"
                                : "text-text-secondary hover:text-primary-dark hover:bg-primary/10"
                        )}
                    >
                        <cat.icon className="w-3.5 h-3.5 stroke-[2]" />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
