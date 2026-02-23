import { Building2, Atom, Book, Globe, Library } from "lucide-react";

const universities = [
  { name: "MIT", icon: Building2 },
  { name: "Stanford", icon: Atom },
  { name: "Harvard", icon: Book },
  { name: "IIT Bombay", icon: Globe },
  { name: "BITS Pilani", icon: Library },
];

export function SocialProofMarquee() {
  const items = [...universities, ...universities];

  return (
    <section className="py-6 sm:py-10 border-y border-text/5 bg-surface/30 overflow-hidden">
      <div className="relative w-full flex items-center">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-16 animate-marquee whitespace-nowrap items-center px-4 w-max">
          {items.map((u, i) => {
            const Icon = u.icon;
            return (
              <span
                key={`${u.name}-${i}`}
                className="text-2xl font-semibold text-text/20 uppercase tracking-widest font-accent flex items-center gap-2"
              >
                <Icon className="h-6 w-6" />
                {u.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
