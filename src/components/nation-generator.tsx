
"use client";

import React, { useState, useEffect, type ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader } from '@/components/ui/loader';
import { AlchemicalIcon, type AlchemicalSymbol } from '@/components/alchemical-icon';
import { generateNationDetails, type GenerateNationDetailsOutput, type GenerateNationDetailsInput } from '@/ai/flows/generate-nation-details';
import { generateNationSymbol } from '@/ai/flows/generate-nation-symbol';
import { Wand2, Sparkles, AlertCircle, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Por favor, describe tu nación en al menos 10 caracteres." }).max(500, { message: "El prompt debe tener 500 caracteres o menos." }),
});

type FormValues = z.infer<typeof formSchema>;

type NationData = GenerateNationDetailsOutput & { symbolUrl?: string };

interface DetailItemProps {
  icon: AlchemicalSymbol;
  label: string;
  value?: string | string[] | null | ReactNode;
  isList?: boolean;
  itemClassName?: string;
  iconClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, isList, itemClassName, iconClassName }) => {
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === "") {
    return (
       <div className={cn("flex items-start space-x-3 p-2.5 bg-card/50 rounded-md", itemClassName)}>
        <AlchemicalIcon symbol={icon} size={24} className={cn("text-accent/80 mt-1 flex-shrink-0", iconClassName)} />
        <div>
          <h3 className="text-base font-semibold text-accent/90">{label}</h3>
          <p className="text-card-foreground/60 text-base italic">No especificado</p>
        </div>
      </div>
    );
  }

  const renderValue = () => {
    if (React.isValidElement(value)) {
      return value;
    }
    if (Array.isArray(value)) {
      if (isList) {
        return (
          <ul className="list-disc list-inside text-card-foreground/80 text-base space-y-1">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      }
      return <p className="text-card-foreground/80 text-base">{value.join(', ')}</p>;
    }
    return <p className="text-card-foreground/80 text-base whitespace-pre-wrap">{String(value)}</p>;
  };

  return (
    <div className={cn("flex items-start space-x-3 p-2.5 bg-card/50 rounded-md", itemClassName)}>
      <AlchemicalIcon symbol={icon} size={24} className={cn("text-accent/80 mt-1 flex-shrink-0", iconClassName)} />
      <div>
        <h3 className="text-base font-semibold text-accent/90">{label}</h3>
        {renderValue()}
      </div>
    </div>
  );
};


export function NationGenerator() {
  const [nationData, setNationData] = useState<NationData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingSymbol, setIsLoadingSymbol] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayNation, setDisplayNation] = useState<NationData | null>(null);
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>([]);


  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (nationData) {
      const timer = setTimeout(() => setDisplayNation(nationData), 100);
      if (nationData) {
         setActiveAccordionItems([]);
      }
      return () => clearTimeout(timer);
    } else {
      setDisplayNation(null);
      setActiveAccordionItems([]);
    }
  }, [nationData]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoadingDetails(true);
    setIsLoadingSymbol(false);
    setError(null);
    setNationData(null);

    try {
      toast({
        title: "Invocando a los Arquitectos...",
        description: "Generando detalles de la nación. Esto puede tardar un momento.",
        duration: 7000,
      });

      const detailsPayload: GenerateNationDetailsInput = { prompt: data.prompt };
      const details = await generateNationDetails(detailsPayload);

      let currentNationData: NationData = { ...details };
      setNationData(currentNationData);
      setIsLoadingDetails(false);


      if (details.visualAestheticOverall) {
        setIsLoadingSymbol(true);
        toast({
          title: "Consultando a los Heraldos...",
          description: "Creando un emblema único para tu nación.",
          duration: 5000,
        });

        const symbolPrompt = `Un estandarte o bandera en un estilo de arte vectorial limpio, simbólico, adecuado para una interfaz futurista o mística. Representa a la nación de ${details.name}.
Estética Visual General: ${details.visualAestheticOverall}.
Colores Dominantes: Grises oscuros, negros, con acentos turquesa vibrantes.
Símbolos/Motivos Clave del Arte: ${details.artAndAesthetics.visualSymbolsAndMotifs.join(', ')}.
La bandera debe destacar elementos que reflejen estos aspectos. Evitar texto. Asegurar que sea visualmente impactante y temáticamente consistente. Diseño minimalista.`;

        try {
            const symbolResult = await generateNationSymbol({ prompt: symbolPrompt });
            setNationData(prev => prev ? ({ ...prev, symbolUrl: symbolResult.symbolDataUri }) : null);
            toast({
              title: "¡Emblema Forjado!",
              description: "El símbolo de tu nación ha sido generado.",
              variant: "default",
            });
        } catch (symbolError) {
            console.error("Error en la generación del símbolo:", symbolError);
            toast({
              title: "Error en el Emblema",
              description: "No se pudo crear un emblema, pero los detalles de la nación están intactos.",
              variant: "destructive",
            });
        } finally {
            setIsLoadingSymbol(false);
        }
      } else {
         toast({
            title: "¡Detalles de la Nación Revelados!",
            description: "Las crónicas de tu nación están listas.",
         });
      }

    } catch (e) {
      console.error("Error en la generación:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error desconocido durante la generación de la nación.";
      setError(errorMessage);
      toast({
        title: "Error en la Creación",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoadingDetails(false);
      setIsLoadingSymbol(false);
    }
  };

  const isLoading = isLoadingDetails || isLoadingSymbol;

  const renderAccordionTriggerBar = (
    title: string,
    iconSymbol: AlchemicalSymbol,
    isOpen: boolean
  ) => {
    return (
      <div className="flex items-center w-full p-4 space-x-4">
        <AlchemicalIcon symbol={iconSymbol} size={28} className="text-accent group-hover:text-accent/80 transition-colors flex-shrink-0" />
        <span className="flex-grow text-lg font-headline uppercase tracking-wider text-accent group-hover:text-accent/80 transition-colors">
          {title}
        </span>
        <ChevronDown className={cn("h-5 w-5 text-accent/70 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>
    );
  };


  return (
    <div className="space-y-8 font-body">
      <Card className="bg-card border border-transparent shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-accent flex items-center gap-2">
            <Wand2 size={28} className="text-accent" />
            Define la Esencia de tu Nación
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Describe el concepto central. Sé breve y evocador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                {...register("prompt")}
                placeholder="Ej: Una civilización élfica que habita en ciudades flotantes de cristal, impulsadas por música arcana..."
                className="min-h-[80px] text-lg md:text-base bg-input border-border/50 focus:border-accent focus:ring-accent placeholder-muted-foreground"
                disabled={isLoading}
              />
              {errors.prompt && <p className="text-base text-destructive mt-1">{errors.prompt.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl py-3 bg-card hover:bg-card/90 border border-accent/60 text-accent transition-all duration-300 transform hover:scale-[1.02] active:scale-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ui-element-glow"
            >
              {isLoadingDetails ? <Loader size="1.2rem" text="Tejiendo el Cosmos..." className="text-accent" /> : isLoadingSymbol ? <Loader size="1.2rem" text="Forjando el Símbolo..." className="text-accent" /> : (
                <>
                  <Sparkles size={20} className="mr-2" />
                  Generar Nación
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && !isLoading && (
        <Alert variant="destructive" className="animate-fade-in border-destructive/70 bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertTitle>Error en la Creación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {displayNation && (
        <Card
          className={cn(
            "bg-transparent border-none shadow-none opacity-0 animate-fade-in",
            isLoadingSymbol ? "animate-pulse" : ""
          )}
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <CardHeader className="text-center pb-4 mb-6">
            <CardTitle className="font-headline text-5xl md:text-6xl text-accent uppercase tracking-wider">
              {displayNation.name}
            </CardTitle>
             <p className="text-lg text-muted-foreground mt-2 font-body">{displayNation.loreGlobal}</p>
            {isLoadingSymbol && (
                 <div className="flex justify-center mt-3">
                    <Loader text="Forjando Emblema..." size="1rem" className="text-accent"/>
                 </div>
            )}
          </CardHeader>
          <CardContent className="space-y-2 p-0">
             {displayNation.symbolUrl && (
              <div className="mb-8 mt-2 text-center">
                <h3 className="text-3xl font-headline text-center mb-4 text-accent uppercase tracking-wide">Emblema Nacional</h3>
                <div className="flex justify-center items-center bg-card p-3 rounded-lg shadow-lg aspect-[3/2] sm:aspect-video max-w-xs sm:max-w-md mx-auto overflow-hidden border border-accent/30 ui-card-glow">
                  <Image
                    src={displayNation.symbolUrl}
                    alt={`Símbolo de ${displayNation.name}`}
                    width={512}
                    height={341}
                    className="object-contain rounded-md"
                    data-ai-hint="fantasy emblem symbol"
                  />
                </div>
              </div>
            )}
            {!displayNation.symbolUrl && !isLoadingSymbol && !isLoadingDetails && (
                 <div className="mb-8 mt-2 pt-2 text-center text-base text-muted-foreground italic">
                    No se generó emblema para esta nación.
                 </div>
            )}

            <Accordion
                type="multiple"
                value={activeAccordionItems}
                onValueChange={setActiveAccordionItems}
                className="w-full space-y-3" 
            >
              {Object.entries({
                geography: { title: "Geografía", icon: "primaMateria", content: displayNation.geographyAndClimate && (
                    <div className="space-y-1.5">
                      <DetailItem icon="earth" label="Regiones" value={displayNation.geographyAndClimate.regions} isList />
                      <DetailItem icon="air" label="Biomas" value={displayNation.geographyAndClimate.biomes} isList />
                      <DetailItem icon="civitas" label="Lugares Destacados" value={displayNation.geographyAndClimate.majorLandmarks} isList />
                      <DetailItem icon="water" label="Clima" value={displayNation.geographyAndClimate.climateDescription} />
                      <DetailItem icon="crucible" label="Recursos Naturales" value={displayNation.geographyAndClimate.naturalResources} isList />
                    </div>
                )},
                government: { title: "Gobierno", icon: "athanor", content: displayNation.governmentAndPolitics && (
                    <div className="space-y-1.5">
                      <DetailItem icon="regulus" label="Tipo de Gobierno" value={displayNation.governmentAndPolitics.governmentType} />
                      <DetailItem icon="solveCoagula" label="Dinastías/Partidos Regentes" value={displayNation.governmentAndPolitics.rulingDynastiesOrParties} isList />
                      <DetailItem icon="sulfur" label="Conflictos Internos" value={displayNation.governmentAndPolitics.internalConflicts} />
                      <DetailItem icon="scales" label="Sistema Legal" value={displayNation.governmentAndPolitics.legalSystemSummary} />
                    </div>
                )},
                economy: { title: "Economía", icon: "mercury", content: displayNation.economy && (
                    <div className="space-y-1.5">
                      <DetailItem icon="crucible" label="Moneda" value={displayNation.economy.currencyName} />
                      <DetailItem icon="solveCoagula" label="Comercio" value={displayNation.economy.localAndGlobalTrade} />
                      <DetailItem icon="fire" label="Gremios/Industrias" value={displayNation.economy.guildsOrIndustries} isList />
                      <DetailItem icon="scales" label="Impuestos" value={displayNation.economy.taxationSystem} />
                      <DetailItem icon="air" label="Rutas Comerciales" value={displayNation.economy.tradeRoutes} isList />
                      <DetailItem icon="earth" label="Recursos Estratégicos" value={displayNation.economy.strategicResources} isList />
                    </div>
                )},
                religion: { title: "Religión", icon: "quintessence", content: displayNation.religionAndSpirituality && (
                  <div className="space-y-1.5">
                    <DetailItem icon="spirit" label="Panteón/Deidades" value={displayNation.religionAndSpirituality.pantheonOrDeities} isList />
                    <DetailItem icon="scriptulum" label="Mitos Fundacionales" value={displayNation.religionAndSpirituality.foundingMyths} />
                    <DetailItem icon="water" label="Rituales y Prácticas" value={displayNation.religionAndSpirituality.ritualsAndPractices} isList />
                  </div>
                )},
                cultures: { title: "Culturas", icon: "water", content: displayNation.culturesAndEthnicities && (
                   <div className="space-y-1.5">
                    <DetailItem icon="spirit" label="Cultura Dominante" value={displayNation.culturesAndEthnicities.dominantCulture} />
                    <DetailItem icon="solveCoagula" label="Grupos Étnicos" value={displayNation.culturesAndEthnicities.ethnicGroups} isList />
                    <DetailItem icon="water" label="Tradiciones" value={displayNation.culturesAndEthnicities.traditionsAndCustoms} isList />
                  </div>
                )},
                languages: { title: "Idiomas", icon: "scriptulum", content: displayNation.languages && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-accent mb-1 text-lg">{displayNation.languages.primaryLanguage.name} (Principal)</h4>
                      <DetailItem icon="air" label="Gramática" value={displayNation.languages.primaryLanguage.grammarSummary} itemClassName="ml-3"/>
                      <DetailItem icon="primaMateria" label="Escritura" value={displayNation.languages.primaryLanguage.scriptSystem} itemClassName="ml-3"/>
                    </div>
                  </div>
                )},
                history: { title: "Historia", icon: "hourglass", content: displayNation.historyByAges && displayNation.historyByAges.length > 0 && (
                  <div className="space-y-3">
                    {displayNation.historyByAges.slice(0,3).map((age, index) => (
                      <div key={index} className="p-1.5 border border-dashed border-accent/20 rounded-md bg-card/30">
                        <h4 className="font-semibold text-accent/90 mb-0.5 text-base">{age.ageName}</h4>
                        <p className="text-sm text-card-foreground/70 whitespace-pre-wrap leading-tight">{age.summary.substring(0,150)}...</p>
                      </div>
                    ))}
                  </div>
                )},
                military: { title: "Militar", icon: "crossedSwords", content: displayNation.militaryAndDefense && (
                  <div className="space-y-1.5">
                    <DetailItem icon="fire" label="Composición del Ejército" value={displayNation.militaryAndDefense.armyComposition} />
                    <DetailItem icon="sulfur" label="Unidades Únicas" value={displayNation.militaryAndDefense.uniqueUnitsOrSpecialForces} isList />
                  </div>
                )},
                 magicTech: { title: "Magia/Tecn.", icon: "atom", content: displayNation.magicAndTechnologySystem && (
                  <div className="space-y-1.5">
                    <DetailItem icon="quintessence" label="Fuente" value={displayNation.magicAndTechnologySystem.sourceOfMagicOrTechnology} />
                    <DetailItem icon="scales" label="Reglas" value={displayNation.magicAndTechnologySystem.rulesAndLimitations} />
                  </div>
                )},
                art: { title: "Arte", icon: "spirit", content: displayNation.artAndAesthetics && (
                  <div className="space-y-1.5">
                    <DetailItem icon="quintessence" label="Estilos Musicales" value={displayNation.artAndAesthetics.musicStyles} />
                    <DetailItem icon="civitas" label="Arquitectura" value={displayNation.artAndAesthetics.architectureStyleDetails} />
                  </div>
                )},
                cities: { title: "Ciudades", icon: "civitas", content: displayNation.majorCities && displayNation.majorCities.length > 0 && (
                   <div className="space-y-2.5">
                    {displayNation.majorCities.slice(0,2).map((city, index) => (
                      <div key={index} className="p-1.5 border border-dashed border-accent/20 rounded-md bg-card/30">
                        <h4 className="font-semibold text-accent/90 mb-0.5 text-base">{city.cityName}</h4>
                        <p className="text-sm text-card-foreground/70 whitespace-pre-wrap leading-tight">{city.description.substring(0,100)}...</p>
                      </div>
                    ))}
                  </div>
                )},
              }).filter(([key, val]) => val.content || isLoadingDetails)
                .map(([key, item]) => (
                <AccordionItem
                    key={key}
                    value={key}
                    className="bg-card border border-[hsl(var(--card-border-color))] rounded-lg ui-card-glow data-[state=open]:border-accent/70 data-[state=open]:shadow-[0_0_20px_-5px_var(--card-glow-color),_0_0_10px_-3px_var(--card-glow-color)_inset] overflow-hidden"
                >
                  <AccordionTrigger
                    className="w-full hover:no-underline group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg"
                    aria-label={`Desplegar sección ${item.title}`}
                  >
                    {renderAccordionTriggerBar(item.title, item.icon as AlchemicalSymbol, activeAccordionItems.includes(key))}
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 pb-4 px-3 md:px-4 space-y-3 bg-card/40 border-t border-accent/20 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {isLoadingDetails && !displayNation?.[key as keyof NationData] ? <Loader text={`Cargando ${item.title}...`} className="text-accent"/> : item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

          </CardContent>
           <CardFooter className="justify-center pt-8 mt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground italic">Este universo fue conjurado por IA, para tus épicas narrativas.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
