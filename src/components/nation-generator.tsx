"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { AlchemicalIcon, type AlchemicalSymbol } from '@/components/alchemical-icon';
import { generateNationDetails, type GenerateNationDetailsOutput } from '@/ai/flows/generate-nation-details';
import { generateNationSymbol, type GenerateNationSymbolOutput } from '@/ai/flows/generate-nation-symbol';
import { Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Please describe your nation in at least 10 characters." }).max(500, { message: "Prompt must be 500 characters or less." }),
});

type FormValues = z.infer<typeof formSchema>;

type NationData = GenerateNationDetailsOutput & { symbolUrl?: string };

export function NationGenerator() {
  const [nationData, setNationData] = useState<NationData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingSymbol, setIsLoadingSymbol] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayNation, setDisplayNation] = useState<NationData | null>(null);

  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (nationData) {
      // Trigger animation by setting displayNation after a short delay or when data is ready
      // This allows CSS transitions on initial appearance
      const timer = setTimeout(() => setDisplayNation(nationData), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayNation(null);
    }
  }, [nationData]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoadingDetails(true);
    setError(null);
    setNationData(null); // Clear previous data for animation

    try {
      toast({
        title: "Summoning Scribes...",
        description: "Generating nation details. This may take a moment.",
      });
      const details = await generateNationDetails({ prompt: data.prompt });
      
      let currentNationData: NationData = { ...details };
      setNationData(currentNationData); // Set details first
      setIsLoadingDetails(false);

      if (details.visualAesthetic) {
        setIsLoadingSymbol(true);
        toast({
          title: "Consulting the Symbolists...",
          description: "Crafting a unique emblem for your nation.",
        });
        const symbolPrompt = `A flag or banner in a fantasy art style, suitable for a mystical codex. It represents the nation of ${details.name}. The nation's culture is ${details.culture}, with a ${details.politicalSystem} political system, and a strong ${details.visualAesthetic} visual aesthetic. The flag should prominently feature elements reflecting these aspects. Avoid text.`;
        
        try {
            const symbolResult = await generateNationSymbol({ prompt: symbolPrompt });
            currentNationData = { ...currentNationData, symbolUrl: symbolResult.symbolDataUri };
            setNationData(currentNationData); // Update with symbol
            toast({
              title: "Emblem Forged!",
              description: "Your nation's symbol has been successfully generated.",
              variant: "default",
            });
        } catch (symbolError) {
            console.error("Symbol generation error:", symbolError);
            setError("Failed to generate nation symbol. The nation details are still available.");
            toast({
              title: "Symbol Generation Failed",
              description: "Could not create an emblem. Displaying nation details without it.",
              variant: "destructive",
            });
        } finally {
            setIsLoadingSymbol(false);
        }

      } else {
         toast({
            title: "Nation Details Revealed!",
            description: "The basic tenets of your nation are known.",
         });
      }

    } catch (e) {
      console.error("Generation error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during nation generation.";
      setError(errorMessage);
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoadingDetails(false);
      setIsLoadingSymbol(false);
    }
  };

  const renderDetailItem = (icon: AlchemicalSymbol, label: string, value: string | undefined) => (
    <div className="flex items-start space-x-3 p-3 bg-background/30 rounded-md hover:bg-background/50 transition-colors duration-300">
      <AlchemicalIcon symbol={icon} size={28} className="text-accent mt-1 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-primary/90">{label}</h3>
        <p className="text-card-foreground/80 text-sm">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  const isLoading = isLoadingDetails || isLoadingSymbol;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Wand2 size={32} />
            Describe Your Nation
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Unleash your imagination. What wonders will your nation hold? Provide a detailed prompt below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                {...register("prompt")}
                placeholder="E.g., A hidden elven kingdom in a crystal forest, ruled by philosopher-kings, with a culture valuing ancient knowledge and intricate, nature-inspired art."
                className="min-h-[120px] text-base bg-input/50 focus:border-primary focus:ring-primary"
                disabled={isLoading}
              />
              {errors.prompt && <p className="text-sm text-destructive mt-1">{errors.prompt.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 active:scale-100">
              {isLoading ? <Loader size="1.2rem" text="Conjuring Realm..." /> : (
                <>
                  <Sparkles size={20} className="mr-2" />
                  Generate Nation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && !isLoading && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {displayNation && (
        <Card 
          className={cn(
            "shadow-2xl border-2 border-accent/30 hover:border-accent/50 transition-all duration-500 opacity-0 animate-fade-in",
            isLoadingSymbol ? "animate-pulse" : ""
          )}
          style={{ animationDelay: '0.2s' }}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-headline text-4xl md:text-5xl text-primary text-shadow-gold">
              {displayNation.name}
            </CardTitle>
            {isLoadingSymbol && (
                 <div className="flex justify-center mt-2">
                    <Loader text="Forging Emblem..." size="1rem"/>
                 </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDetailItem('air', 'Culture', displayNation.culture)}
              {renderDetailItem('water', 'Political System', displayNation.politicalSystem)}
            </div>
            {renderDetailItem('fire', 'Visual Aesthetic', displayNation.visualAesthetic)}

            {displayNation.symbolUrl && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-2xl font-headline text-center mb-4 text-primary">National Emblem</h3>
                <div className="flex justify-center items-center bg-background/30 p-4 rounded-lg shadow-inner aspect-square max-w-md mx-auto overflow-hidden">
                  <Image
                    src={displayNation.symbolUrl}
                    alt={`Symbol of ${displayNation.name}`}
                    width={512}
                    height={512}
                    className="object-contain rounded-md border-2 border-primary/50"
                    data-ai-hint="fantasy banner"
                  />
                </div>
              </div>
            )}
            {!displayNation.symbolUrl && !isLoadingSymbol && (
                 <div className="mt-6 pt-6 border-t border-border/50 text-center text-muted-foreground">
                    No emblem was generated for this nation.
                 </div>
            )}
          </CardContent>
           <CardFooter className="justify-center pt-4">
            <p className="text-xs text-muted-foreground italic">This realm was envisioned through the mists of AI.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
