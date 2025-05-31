import { NationGenerator } from '@/components/nation-generator';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center selection:bg-accent/30 selection:text-background">
      <header className="w-full max-w-4xl mb-8 md:mb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-headline font-semibold text-accent uppercase tracking-wider">
          Architect Universalis
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mt-3 font-headline font-light">
          Crea una nación de fantasía
        </p>
      </header>
      <main className="w-full max-w-4xl"> {/* Increased max-width for wider grid */}
        <NationGenerator />
      </main>
      <footer className="w-full max-w-4xl mt-16 py-8 text-center text-base text-muted-foreground border-t border-border/30">
        <p>&copy; {new Date().getFullYear()} Architect Universalis. Evocado por IA, diseñado para soñadores.</p>
      </footer>
    </div>
  );
}
