import { NationGenerator } from '@/components/nation-generator';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center selection:bg-primary/40 selection:text-primary-foreground">
      <header className="w-full max-w-4xl mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary text-shadow-gold animate-subtle-glow">
          Architect Universalis
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 font-body">
          Craft your own worlds, one nation at a time, with the power of arcane algorithms.
        </p>
      </header>
      <main className="w-full max-w-3xl">
        <NationGenerator />
      </main>
      <footer className="w-full max-w-4xl mt-16 py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Architect Universalis. Evoked by AI, designed for dreamers.</p>
      </footer>
    </div>
  );
}
