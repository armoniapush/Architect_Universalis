
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
import { Wand2, Sparkles, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Please describe your nation in at least 10 characters." }).max(500, { message: "Prompt must be 500 characters or less." }),
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
       <div className={cn("flex items-start space-x-3 p-3 bg-card-foreground/5 rounded-md hover:bg-card-foreground/10 transition-colors duration-300", itemClassName)}>
        <AlchemicalIcon symbol={icon} size={28} className={cn("text-accent mt-1 flex-shrink-0", iconClassName)} />
        <div>
          <h3 className="text-sm font-semibold text-primary/90">{label}</h3>
          <p className="text-card-foreground/60 text-sm italic">Not specified</p>
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
          <ul className="list-disc list-inside text-card-foreground/80 text-sm space-y-1">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      }
      return <p className="text-card-foreground/80 text-sm">{value.join(', ')}</p>;
    }
    return <p className="text-card-foreground/80 text-sm whitespace-pre-wrap">{String(value)}</p>;
  };

  return (
    <div className={cn("flex items-start space-x-3 p-3 bg-card-foreground/5 rounded-md hover:bg-card-foreground/10 transition-colors duration-300", itemClassName)}>
      <AlchemicalIcon symbol={icon} size={28} className={cn("text-accent mt-1 flex-shrink-0", iconClassName)} />
      <div>
        <h3 className="text-sm font-semibold text-primary/90">{label}</h3>
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
         setActiveAccordionItems(['lore', 'geography']); 
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
        title: "Summoning Scribes & Cartographers...",
        description: "Generating comprehensive nation details. This may take a while.",
        duration: 7000,
      });

      const detailsPayload: GenerateNationDetailsInput = { prompt: data.prompt };
      const details = await generateNationDetails(detailsPayload);
      
      let currentNationData: NationData = { ...details };
      setNationData(currentNationData); 
      setIsLoadingDetails(false);
      
      setActiveAccordionItems(['lore', 'geography', 'government', 'economy']);


      if (details.visualAestheticOverall) {
        setIsLoadingSymbol(true);
        toast({
          title: "Consulting the Symbolists...",
          description: "Crafting a unique emblem for your nation based on its new rich lore.",
          duration: 5000,
        });
        
        const symbolPrompt = `A flag or banner in a fantasy art style, suitable for a mystical codex. It represents the nation of ${details.name}.
Overall Visual Aesthetic: ${details.visualAestheticOverall}.
Culture: ${details.culturesAndEthnicities.dominantCulture}.
Core Values/Philosophy: ${details.culturesAndEthnicities.valuesAndPhilosophy}.
Key Symbols/Motifs from Art: ${details.artAndAesthetics.visualSymbolsAndMotifs.join(', ')}.
Founding Myth: ${details.religionAndSpirituality.foundingMyths}.
The flag should prominently feature elements reflecting these aspects. Avoid text. Ensure it is visually striking and thematically consistent. The color palette should include deep indigo and mystic turquoise accents.`;
        
        try {
            const symbolResult = await generateNationSymbol({ prompt: symbolPrompt });
            setNationData(prev => prev ? ({ ...prev, symbolUrl: symbolResult.symbolDataUri }) : null);
            toast({
              title: "Emblem Forged!",
              description: "Your nation's symbol has been successfully generated.",
              variant: "default", // Will use new theme colors
            });
        } catch (symbolError) {
            console.error("Symbol generation error:", symbolError);
            toast({
              title: "Symbol Generation Hiccup",
              description: "Could not create an emblem, but the realm's details are intact.",
              variant: "destructive",
            });
        } finally {
            setIsLoadingSymbol(false);
        }
      } else {
         toast({
            title: "Nation Details Revealed!",
            description: "The chronicles of your nation are now available.",
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
  
  const isLoading = isLoadingDetails || isLoadingSymbol;

  const renderAccordionItem = (
    id: string, 
    title: string, 
    iconSymbol: AlchemicalSymbol, 
    content: ReactNode | null,
    defaultOpen: boolean = false
  ) => {
     if (!content && !isLoadingDetails) return null; 
     return (
      <AccordionItem value={id} className="border-b-2 border-primary/20 hover:border-primary/40 transition-colors duration-150">
        <AccordionTrigger className="py-4 px-2 hover:bg-primary/10 rounded-t-md text-lg font-headline text-primary hover:text-primary/90">
          <div className="flex items-center space-x-3">
            {/* Icon color is primarily Indigo (text-primary), glow is Turquoise */}
            <AlchemicalIcon symbol={iconSymbol} size={24} className="text-primary" /> 
            <span>{title}</span>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-primary/70 transition-transform duration-200 icon-glow-turquoise" />
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-4 px-2 space-y-3 bg-card-foreground/5 rounded-b-md">
          {isLoadingDetails && !displayNation ? <Loader text={`Unearthing ${title}...`} /> : content}
        </AccordionContent>
      </AccordionItem>
    );
  };


  return (
    <div className="space-y-8 font-body">
      <Card className="shadow-xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Wand2 size={32} className="text-primary icon-glow-turquoise" />
            Describe Your Nation's Genesis
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Plant the seed of a world. What is the core concept of your nation? Be evocative.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                {...register("prompt")}
                placeholder="E.g., A nomadic star-clan forging an empire amidst asteroid relics, guided by sentient crystals and ancient void-songs."
                className="min-h-[100px] text-base bg-input/80 focus:border-accent focus:ring-accent"
                disabled={isLoading}
              />
              {errors.prompt && <p className="text-sm text-destructive mt-1">{errors.prompt.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 active:scale-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
              {isLoadingDetails ? <Loader size="1.2rem" text="Weaving the Tapestry of Worlds..." className="text-primary-foreground" /> : isLoadingSymbol ? <Loader size="1.2rem" text="Forging the National Emblem..." className="text-primary-foreground" /> : (
                <>
                  <Sparkles size={20} className="mr-2 icon-glow-turquoise" />
                  Generate Nation Details
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && !isLoading && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-5 w-5 icon-glow-turquoise" />
          <AlertTitle>Error in Creation</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {displayNation && (
        <Card 
          className={cn(
            "shadow-2xl border-2 border-accent/40 hover:border-accent/60 transition-all duration-500 opacity-0 animate-fade-in",
            isLoadingSymbol ? "animate-pulse" : ""
          )}
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <CardHeader className="text-center pb-4 border-b-2 border-accent/20">
            <CardTitle className="font-headline text-4xl md:text-5xl text-accent text-shadow-accent animate-subtle-glow">
              {displayNation.name}
            </CardTitle>
             <p className="text-md text-muted-foreground mt-1">{displayNation.loreGlobal}</p>
            {isLoadingSymbol && (
                 <div className="flex justify-center mt-3">
                    <Loader text="Forging Emblem..." size="1rem" className="text-accent"/>
                 </div>
            )}
          </CardHeader>
          <CardContent className="space-y-2 pt-6">
             {displayNation.symbolUrl && (
              <div className="mb-6 mt-2 pt-2 text-center">
                <h3 className="text-2xl font-headline text-center mb-3 text-accent">National Emblem</h3>
                <div className="flex justify-center items-center bg-background/50 p-3 rounded-lg shadow-inner aspect-[3/2] sm:aspect-square max-w-xs sm:max-w-sm mx-auto overflow-hidden border-2 border-accent/40">
                  <Image
                    src={displayNation.symbolUrl}
                    alt={`Symbol of ${displayNation.name}`}
                    width={512}
                    height={341} // Adjusted for a more flag-like ratio initially
                    className="object-contain rounded-md"
                    data-ai-hint="fantasy banner emblem"
                  />
                </div>
              </div>
            )}
            {!displayNation.symbolUrl && !isLoadingSymbol && !isLoadingDetails && (
                 <div className="mb-6 mt-2 pt-2 text-center text-muted-foreground italic">
                    No emblem was generated for this nation.
                 </div>
            )}

            <Accordion 
                type="multiple" 
                value={activeAccordionItems}
                onValueChange={setActiveAccordionItems}
                className="w-full"
            >
              {/* DetailItem icons will mostly use text-accent (turquoise) by default from AlchemicalIcon component */}
              {renderAccordionItem("geography", "Geography & Climate", "primaMateria", displayNation.geographyAndClimate && (
                <div className="space-y-2">
                  <DetailItem icon="earth" label="Regions" value={displayNation.geographyAndClimate.regions} isList />
                  <DetailItem icon="air" label="Biomes" value={displayNation.geographyAndClimate.biomes} isList />
                  <DetailItem icon="civitas" label="Major Landmarks" value={displayNation.geographyAndClimate.majorLandmarks} isList />
                  <DetailItem icon="water" label="Climate" value={displayNation.geographyAndClimate.climateDescription} />
                  <DetailItem icon="crucible" label="Natural Resources" value={displayNation.geographyAndClimate.naturalResources} isList />
                </div>
              ))}

              {renderAccordionItem("government", "Government & Politics", "athanor", displayNation.governmentAndPolitics && (
                <div className="space-y-2">
                  <DetailItem icon="regulus" label="Government Type" value={displayNation.governmentAndPolitics.governmentType} />
                  <DetailItem icon="solveCoagula" label="Ruling Dynasties/Parties" value={displayNation.governmentAndPolitics.rulingDynastiesOrParties} isList />
                  <DetailItem icon="sulfur" label="Internal Conflicts" value={displayNation.governmentAndPolitics.internalConflicts} />
                  <DetailItem icon="scales" label="Legal System" value={displayNation.governmentAndPolitics.legalSystemSummary} />
                </div>
              ))}
              
              {renderAccordionItem("economy", "Economy", "mercury", displayNation.economy && (
                <div className="space-y-2">
                  <DetailItem icon="crucible" label="Currency" value={displayNation.economy.currencyName} />
                  <DetailItem icon="solveCoagula" label="Trade" value={displayNation.economy.localAndGlobalTrade} />
                  <DetailItem icon="fire" label="Guilds/Industries" value={displayNation.economy.guildsOrIndustries} isList />
                  <DetailItem icon="scales" label="Taxation" value={displayNation.economy.taxationSystem} />
                  <DetailItem icon="air" label="Trade Routes" value={displayNation.economy.tradeRoutes} isList />
                  <DetailItem icon="earth" label="Strategic Resources" value={displayNation.economy.strategicResources} isList />
                </div>
              ))}

              {renderAccordionItem("religion", "Religion & Spirituality", "quintessence", displayNation.religionAndSpirituality && (
                <div className="space-y-2">
                  <DetailItem icon="spirit" label="Pantheon/Deities" value={displayNation.religionAndSpirituality.pantheonOrDeities} isList />
                  <DetailItem icon="scriptulum" label="Founding Myths" value={displayNation.religionAndSpirituality.foundingMyths} />
                  <DetailItem icon="water" label="Rituals & Practices" value={displayNation.religionAndSpirituality.ritualsAndPractices} isList />
                  <DetailItem icon="sulfur" label="Taboos" value={displayNation.religionAndSpirituality.taboos} isList />
                  <DetailItem icon="athanor" label="Mystical Schools/Orders" value={displayNation.religionAndSpirituality.mysticalSchoolsOrOrders} isList />
                  <DetailItem icon="fire" label="Heresies/Alternative Beliefs" value={displayNation.religionAndSpirituality.heresiesOrAlternativeBeliefs} isList />
                  <DetailItem icon="scriptulum" label="Sacred Texts" value={displayNation.religionAndSpirituality.sacredTexts} isList />
                </div>
              ))}
              
              {renderAccordionItem("cultures", "Cultures & Ethnicities", "water", displayNation.culturesAndEthnicities && (
                 <div className="space-y-2">
                  <DetailItem icon="spirit" label="Dominant Culture" value={displayNation.culturesAndEthnicities.dominantCulture} />
                  <DetailItem icon="solveCoagula" label="Ethnic Groups" value={displayNation.culturesAndEthnicities.ethnicGroups} isList />
                  <DetailItem icon="water" label="Traditions & Customs" value={displayNation.culturesAndEthnicities.traditionsAndCustoms} isList />
                  <DetailItem icon="air" label="Values & Philosophy" value={displayNation.culturesAndEthnicities.valuesAndPhilosophy} />
                  <DetailItem icon="primaMateria" label="Rites of Passage" value={displayNation.culturesAndEthnicities.ritesOfPassage} isList />
                  <DetailItem icon="quintessence" label="Typical Attire" value={displayNation.culturesAndEthnicities.typicalAttire} />
                </div>
              ))}

              {renderAccordionItem("languages", "Languages", "scriptulum", displayNation.languages && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{displayNation.languages.primaryLanguage.name}</h4>
                    <DetailItem icon="air" label="Grammar Summary" value={displayNation.languages.primaryLanguage.grammarSummary} itemClassName="ml-4"/>
                    <DetailItem icon="primaMateria" label="Script System" value={displayNation.languages.primaryLanguage.scriptSystem} itemClassName="ml-4"/>
                    <DetailItem icon="water" label="Common Expressions" value={displayNation.languages.primaryLanguage.commonExpressions} isList itemClassName="ml-4"/>
                    {displayNation.languages.primaryLanguage.etymologyNotes && <DetailItem icon="hourglass" label="Etymology Notes" value={displayNation.languages.primaryLanguage.etymologyNotes} itemClassName="ml-4"/>}
                  </div>
                  {displayNation.languages.otherNotableLanguages && displayNation.languages.otherNotableLanguages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Other Notable Languages:</h4>
                      {displayNation.languages.otherNotableLanguages.map((lang, index) => (
                        <div key={index} className="pl-4 border-l-2 border-accent/30 mb-3 pb-2">
                           <h5 className="font-medium text-primary/80 mb-1">{lang.name}</h5>
                           <DetailItem icon="air" label="Grammar" value={lang.grammarSummary} itemClassName="ml-4"/>
                           <DetailItem icon="primaMateria" label="Script" value={lang.scriptSystem} itemClassName="ml-4"/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {renderAccordionItem("genealogy", "Genealogy & Lineages", "athanor", displayNation.genealogyAndLineages && (
                 <div className="space-y-2">
                  <DetailItem icon="scriptulum" label="Founding Lineage Myth" value={displayNation.genealogyAndLineages.foundingLineageMyth} />
                  <DetailItem icon="regulus" label="Notable Noble Houses/Clans" value={displayNation.genealogyAndLineages.notableNobleHousesOrClans} isList />
                  <DetailItem icon="quintessence" label="Famous Heroes/Leaders" value={displayNation.genealogyAndLineages.famousHeroesOrLeaders} isList />
                </div>
              ))}

              {renderAccordionItem("history", "History by Ages", "hourglass", displayNation.historyByAges && displayNation.historyByAges.length > 0 && (
                <div className="space-y-4">
                  {displayNation.historyByAges.map((age, index) => (
                    <div key={index} className="p-2 border border-dashed border-primary/20 rounded-md">
                      <h4 className="font-semibold text-primary mb-1">{age.ageName}</h4>
                      <DetailItem icon="scriptulum" label="Summary" value={age.summary} itemClassName="ml-2" iconClassName="text-primary/80"/>
                      {age.keyEvents && age.keyEvents.length > 0 && (
                        <div className="ml-2 mt-1">
                          <h5 className="font-medium text-primary/80 text-sm mb-1">Key Events:</h5>
                          {age.keyEvents.map((event, eventIdx) =>(
                            <div key={eventIdx} className="ml-2 pl-2 border-l border-primary/40 mb-1">
                               <p className="text-sm text-primary/70 font-semibold">{event.eventName}</p>
                               <p className="text-xs text-card-foreground/70 whitespace-pre-wrap">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {renderAccordionItem("military", "Military & Defense", "regulus", displayNation.militaryAndDefense && (
                <div className="space-y-2">
                  <DetailItem icon="fire" label="Army Composition" value={displayNation.militaryAndDefense.armyComposition} />
                  <DetailItem icon="sulfur" label="Unique Units/Special Forces" value={displayNation.militaryAndDefense.uniqueUnitsOrSpecialForces} isList />
                  <DetailItem icon="quintessence" label="Warfare Techniques" value={displayNation.militaryAndDefense.warfareTechniques} isList />
                  <DetailItem icon="atom" label="Signature Weapons/Technology" value={displayNation.militaryAndDefense.signatureWeaponsOrTechnology} isList />
                  <DetailItem icon="hourglass" label="Historical Conflicts" value={displayNation.militaryAndDefense.historicalConflicts} isList />
                  <DetailItem icon="scales" label="Treaties/Alliances" value={displayNation.militaryAndDefense.treatiesOrAlliances} isList />
                </div>
              ))}

              {renderAccordionItem("cities", "Major Cities", "civitas", displayNation.majorCities && displayNation.majorCities.length > 0 && (
                 <div className="space-y-3">
                  {displayNation.majorCities.map((city, index) => (
                    <div key={index} className="p-2 border border-dashed border-primary/20 rounded-md">
                      <h4 className="font-semibold text-primary mb-1">{city.cityName}</h4>
                      <DetailItem icon="scriptulum" label="Description" value={city.description} itemClassName="ml-2" iconClassName="text-primary/80"/>
                      <DetailItem icon="solveCoagula" label="Districts/Castes" value={city.districtsOrCastes} itemClassName="ml-2" iconClassName="text-primary/80"/>
                      <DetailItem icon="athanor" label="Infrastructure" value={city.infrastructureHighlights} itemClassName="ml-2" iconClassName="text-primary/80"/>
                      <DetailItem icon="mercury" label="Population" value={city.populationEstimate} itemClassName="ml-2" iconClassName="text-primary/80"/>
                    </div>
                  ))}
                </div>
              ))}
              
              {renderAccordionItem("magicTech", "Magic & Technology System", "atom", displayNation.magicAndTechnologySystem && (
                <div className="space-y-2">
                  <DetailItem icon="quintessence" label="Source" value={displayNation.magicAndTechnologySystem.sourceOfMagicOrTechnology} />
                  <DetailItem icon="scales" label="Rules & Limitations" value={displayNation.magicAndTechnologySystem.rulesAndLimitations} />
                  <DetailItem icon="solveCoagula" label="Integration with Society" value={displayNation.magicAndTechnologySystem.integrationWithSociety} />
                  <DetailItem icon="fire" label="Unique Applications" value={displayNation.magicAndTechnologySystem.uniqueApplications} isList />
                </div>
              ))}

              {renderAccordionItem("art", "Art & Aesthetics", "water", displayNation.artAndAesthetics && (
                <div className="space-y-2">
                  <DetailItem icon="quintessence" label="Music Styles" value={displayNation.artAndAesthetics.musicStyles} />
                  <DetailItem icon="spirit" label="Dance Forms" value={displayNation.artAndAesthetics.danceForms} />
                  <DetailItem icon="scriptulum" label="Literary Traditions" value={displayNation.artAndAesthetics.literaryTraditions} />
                  <DetailItem icon="primaMateria" label="Visual Symbols/Motifs" value={displayNation.artAndAesthetics.visualSymbolsAndMotifs} isList />
                  <DetailItem icon="hourglass" label="Mythology in Art" value={displayNation.artAndAesthetics.mythologyInArt} />
                  <DetailItem icon="civitas" label="Architecture Style" value={displayNation.artAndAesthetics.architectureStyleDetails} />
                  <DetailItem icon="fire" label="Body Art/Adornment" value={displayNation.artAndAesthetics.bodyArtOrAdornment} />
                </div>
              ))}
              
              {renderAccordionItem("symbolsAlch", "Nation Symbols & Alchemical Connections", "spirit", displayNation.nationSymbolsAndAlchemicalConnections && (
                <div className="space-y-2">
                  <DetailItem icon="primaMateria" label="Custom Glyphs/Symbols" value={displayNation.nationSymbolsAndAlchemicalConnections.customGlyphsOrSymbols} isList />
                  <DetailItem icon="scriptulum" label="Sacred Metalinguistics" value={displayNation.nationSymbolsAndAlchemicalConnections.sacredMetalinguistics} />
                  <DetailItem icon="athanor" label="Cosmology Overview" value={displayNation.nationSymbolsAndAlchemicalConnections.cosmologyOverview} />
                </div>
              ))}
              
              {renderAccordionItem("international", "International Connections", "solveCoagula", displayNation.internationalConnections && (
                <div className="space-y-2">
                  <DetailItem icon="earth" label="Relations with Neighbors" value={displayNation.internationalConnections.relationsWithNeighboringNations} />
                  <DetailItem icon="scales" label="Diplomatic Practices" value={displayNation.internationalConnections.diplomaticPractices} />
                  <DetailItem icon="scriptulum" label="Major Treaties/Pacts" value={displayNation.internationalConnections.majorTreatiesOrPacts} isList />
                  <DetailItem icon="sulfur" label="Espionage Activities" value={displayNation.internationalConnections.espionageActivities} />
                </div>
              ))}

              {renderAccordionItem("documents", "Formal Documents", "scriptulum", displayNation.formalDocumentsGenerated && displayNation.formalDocumentsGenerated.length > 0 && (
                <div className="space-y-3">
                  {displayNation.formalDocumentsGenerated.map((doc, index) => (
                    <div key={index} className="p-2 border border-dashed border-primary/20 rounded-md">
                      <h4 className="font-semibold text-primary mb-1">{doc.documentName}</h4>
                      <DetailItem icon="scriptulum" label="Content Summary" value={doc.contentSummary} itemClassName="ml-2" iconClassName="text-primary/80"/>
                    </div>
                  ))}
                </div>
              ))}
              
            </Accordion>

          </CardContent>
           <CardFooter className="justify-center pt-6 border-t border-primary/20 mt-4">
            <p className="text-xs text-muted-foreground italic">This realm was envisioned through the mists of AI, meticulously chronicled for your sagas.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
