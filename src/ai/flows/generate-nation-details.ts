
'use server';

/**
 * @fileOverview Generates a fictional nation's comprehensive details based on a text prompt.
 *
 * - generateNationDetails - A function that generates the nation details.
 * - GenerateNationDetailsInput - The input type for the generateNationDetails function.
 * - GenerateNationDetailsOutput - The return type for the generateNationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const GenerateNationDetailsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired nation.'),
});
export type GenerateNationDetailsInput = z.infer<typeof GenerateNationDetailsInputSchema>;

const AgeEventSchema = z.object({
  eventName: z.string().describe('Name or brief summary of the key event.'),
  description: z.string().describe('Detailed description of the event and its impact.'),
});

const HistoricalAgeSchema = z.object({
  ageName: z.string().describe("Name of the historical age (e.g., Prehistory, Ancient Age)."),
  summary: z.string().describe("Overview of the nation's status and development during this age."),
  keyEvents: z.array(AgeEventSchema).describe('List of key events that occurred during this age.'),
});

const LanguageDetailSchema = z.object({
  name: z.string().describe('Name of the language.'),
  grammarSummary: z.string().describe('Brief overview of its grammatical structure.'),
  scriptSystem: z.string().describe('Description of its writing system (e.g., glyphs, runes, alphabet).'),
  commonExpressions: z.array(z.string()).describe('Examples of common phrases or expressions.'),
  etymologyNotes: z.string().optional().describe('Notes on its linguistic origins or evolution.'),
});

const FormalDocumentSchema = z.object({
  documentName: z.string().describe("The title of the formal document (e.g., Constitution, Peace Treaty)."),
  contentSummary: z.string().describe("A summary or key excerpts of the document's content."),
});

const GenerateNationDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the generated nation.'),
  loreGlobal: z.string().describe('Overall lore and foundational concept of the nation.'),
  
  geographyAndClimate: z.object({
    regions: z.array(z.string()).describe('Distinct geographical regions or areas within the nation.'),
    biomes: z.array(z.string()).describe('Prevailing biomes (e.g., forest, desert, tundra).'),
    majorLandmarks: z.array(z.string()).describe('Significant natural or artificial landmarks.'),
    climateDescription: z.string().describe('Overall climate patterns and seasonal changes.'),
    naturalResources: z.array(z.string()).describe('Key natural resources found in the nation.'),
  }).describe('Geography and climate details.'),

  governmentAndPolitics: z.object({
    governmentType: z.string().describe('Primary type of government (e.g., monarchy, republic, council).'),
    rulingDynastiesOrParties: z.array(z.string()).optional().describe('Prominent ruling families, dynasties, or political parties.'),
    internalConflicts: z.string().optional().describe('Description of major internal political conflicts or factions.'),
    legalSystemSummary: z.string().describe('Overview of the legal system and law enforcement.'),
  }).describe('Government and political structure.'),

  economy: z.object({
    currencyName: z.string().optional().describe('Name of the primary currency used.'),
    localAndGlobalTrade: z.string().describe('Description of trade activities, both internal and external.'),
    guildsOrIndustries: z.array(z.string()).describe('Major guilds, corporations, or primary industries.'),
    taxationSystem: z.string().describe('Brief overview of how taxation works.'),
    tradeRoutes: z.array(z.string()).optional().describe('Notable trade routes.'),
    strategicResources: z.array(z.string()).describe('Economically strategic resources.'),
  }).describe('Economic system and activities.'),

  religionAndSpirituality: z.object({
    pantheonOrDeities: z.array(z.string()).optional().describe('Names of major gods, goddesses, or spiritual entities.'),
    foundingMyths: z.string().describe('Core creation or founding myths of the nation/dominant religion.'),
    ritualsAndPractices: z.array(z.string()).describe('Common religious rituals, ceremonies, or spiritual practices.'),
    taboos: z.array(z.string()).optional().describe('Significant cultural or religious taboos.'),
    mysticalSchoolsOrOrders: z.array(z.string()).optional().describe('Known mystical schools, religious orders, or philosophical groups.'),
    heresiesOrAlternativeBeliefs: z.array(z.string()).optional().describe('Notable heresies or alternative spiritual paths.'),
    sacredTexts: z.array(z.string()).optional().describe('Names or descriptions of important sacred texts or scriptures.'),
  }).describe('Religious beliefs and spiritual practices.'),

  culturesAndEthnicities: z.object({
    dominantCulture: z.string().describe('Description of the dominant culture.'),
    ethnicGroups: z.array(z.string()).optional().describe('Names and brief descriptions of major ethnic groups.'),
    traditionsAndCustoms: z.array(z.string()).describe('Key social traditions, customs, and etiquette.'),
    valuesAndPhilosophy: z.string().describe('Core societal values and dominant philosophical outlooks.'),
    ritesOfPassage: z.array(z.string()).optional().describe('Common rites of passage.'),
    typicalAttire: z.string().describe('Description of common or traditional clothing and adornments.'),
  }).describe('Cultural aspects and ethnic makeup.'),

  languages: z.object({
    primaryLanguage: LanguageDetailSchema.describe('Details of the primary language spoken.'),
    otherNotableLanguages: z.array(LanguageDetailSchema).optional().describe('Details of other significant languages.'),
  }).describe('Languages spoken in the nation.'),

  genealogyAndLineages: z.object({
    foundingLineageMyth: z.string().describe("Myth or story of the nation's founding family, hero, or group."),
    notableNobleHousesOrClans: z.array(z.string()).optional().describe('Names of significant noble houses, clans, or influential families.'),
    famousHeroesOrLeaders: z.array(z.string()).optional().describe('Legendary heroes or pivotal leaders from history.'),
  }).describe('Genealogical information and significant lineages.'),

  historyByAges: z.array(HistoricalAgeSchema).describe('Historical timeline divided into distinct ages, from prehistory to the present/future equivalent.'),
  
  militaryAndDefense: z.object({
    armyComposition: z.string().describe('General description of military forces and their organization.'),
    uniqueUnitsOrSpecialForces: z.array(z.string()).optional().describe('Notable unique military units or special forces.'),
    warfareTechniques: z.array(z.string()).describe('Common or unique strategies and tactics in warfare.'),
    signatureWeaponsOrTechnology: z.array(z.string()).optional().describe('Iconic weapons or military technologies.'),
    historicalConflicts: z.array(z.string()).optional().describe('Major wars or significant military conflicts in their history.'),
    treatiesOrAlliances: z.array(z.string()).optional().describe('Important military treaties or alliances.'),
  }).describe('Military structure and defense capabilities.'),

  majorCities: z.array(z.object({
    cityName: z.string().describe('Name of the city.'),
    description: z.string().describe('Brief description of the city, its significance, and architectural style.'),
    districtsOrCastes: z.string().optional().describe('Notable districts, social divisions, or caste systems within the city.'),
    infrastructureHighlights: z.string().optional().describe('Key infrastructure elements (e.g., aqueducts, spaceports).'),
    populationEstimate: z.string().optional().describe('Rough estimate or description of its population size.'),
  })).describe('Information on principal cities.'),
  
  magicAndTechnologySystem: z.object({
    sourceOfMagicOrTechnology: z.string().describe('The origin and nature of magic or advanced technology.'),
    rulesAndLimitations: z.string().describe('Key rules, principles, and limitations governing its use.'),
    integrationWithSociety: z.string().describe('How magic or technology is integrated into daily life and societal structures.'),
    uniqueApplications: z.array(z.string()).optional().describe('Examples of unique or notable applications.'),
  }).describe('System of magic or technology, if applicable.'),

  artAndAesthetics: z.object({
    musicStyles: z.string().describe('Dominant musical styles and typical instruments.'),
    danceForms: z.string().optional().describe('Popular or traditional dance forms.'),
    literaryTraditions: z.string().describe('Key literary forms, famous works, or storytelling traditions.'),
    visualSymbolsAndMotifs: z.array(z.string()).describe('Common visual symbols, artistic motifs, or iconography.'),
    mythologyInArt: z.string().describe('How mythology and history are represented in their art.'),
    architectureStyleDetails: z.string().describe('Detailed description of prevalent architectural styles.'),
    bodyArtOrAdornment: z.string().optional().describe('Common forms of body art like tattoos, piercings, or specific adornments.'),
  }).describe('Artistic expression and aesthetic sensibilities.'),

  nationSymbolsAndAlchemicalConnections: z.object({
    customGlyphsOrSymbols: z.array(z.string()).optional().describe('Descriptions of unique national or cultural glyphs/symbols beyond the main emblem.'),
    sacredMetalinguistics: z.string().optional().describe('Concepts related to a sacred language or symbolic system used in rituals or governance.'),
    cosmologyOverview: z.string().describe('A brief overview of their understanding of the cosmos and their place within it.'),
  }).describe('Unique symbols and deeper alchemical or metaphysical connections.'),

  internationalConnections: z.object({
    relationsWithNeighboringNations: z.string().optional().describe('General state of relations with adjacent nations or groups.'),
    diplomaticPractices: z.string().describe('How diplomacy is generally conducted.'),
    majorTreatiesOrPacts: z.array(z.string()).optional().describe('Significant international treaties, trade agreements, or alliances not covered under military.'),
    espionageActivities: z.string().optional().describe('Mention of known or suspected espionage efforts (by or against them).'),
  }).describe('Relations with other nations and international presence.'),
  
  formalDocumentsGenerated: z.array(FormalDocumentSchema).optional().describe('Examples of formal documents generated for or by the nation.'),
  visualAestheticOverall: z.string().describe('A summary of the overall visual aesthetic of the nation, combining elements from architecture, art, and attire. This will be used for generating the emblem.')
});
export type GenerateNationDetailsOutput = z.infer<typeof GenerateNationDetailsOutputSchema>;

export async function generateNationDetails(
  input: GenerateNationDetailsInput
): Promise<GenerateNationDetailsOutput> {
  return generateNationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNationDetailsPrompt',
  input: {schema: GenerateNationDetailsInputSchema},
  output: {schema: GenerateNationDetailsOutputSchema},
  prompt: `You are an expert worldbuilding assistant specializing in creating rich, detailed, and internally consistent fictional nations for fantasy or sci-fi settings.
Given a user prompt, you will generate a comprehensive profile of a nation, ensuring all aspects are interconnected and well-developed. The nation should feel alive and believable.

User Prompt: {{{prompt}}}

Based on this prompt, generate the following detailed information for the nation. Be thorough and creative for each point:

1.  **Name**: The name of the generated nation.
2.  **LoreGlobal**: Overall lore and foundational concept of the nation.
3.  **Geography and Climate**:
    *   Regions: Distinct geographical regions.
    *   Biomes: Prevailing biomes.
    *   Major Landmarks: Significant natural/artificial landmarks.
    *   Climate Description: Overall climate patterns.
    *   Natural Resources: Key natural resources.
4.  **Government and Politics**:
    *   Government Type: Primary type of government.
    *   Ruling Dynasties/Parties: Prominent ruling families or political parties (if any).
    *   Internal Conflicts: Major internal political conflicts/factions (if any).
    *   Legal System Summary: Overview of the legal system.
5.  **Economy**:
    *   Currency Name: Primary currency (if any).
    *   Local/Global Trade: Description of trade activities.
    *   Guilds/Industries: Major guilds or primary industries.
    *   Taxation System: Overview of taxation.
    *   Trade Routes: Notable trade routes (if any).
    *   Strategic Resources: Economically strategic resources.
6.  **Religion and Spirituality**:
    *   Pantheon/Deities: Major gods or spiritual entities (if any).
    *   Founding Myths: Core creation or founding myths.
    *   Rituals/Practices: Common religious or spiritual practices.
    *   Taboos: Significant cultural/religious taboos (if any).
    *   Mystical Schools/Orders: Known mystical schools or religious orders (if any).
    *   Heresies/Alternative Beliefs: Notable heresies or alternative beliefs (if any).
    *   Sacred Texts: Important sacred texts (if any).
7.  **Cultures and Ethnicities**:
    *   Dominant Culture: Description of the dominant culture.
    *   Ethnic Groups: Major ethnic groups (if any).
    *   Traditions/Customs: Key social traditions and customs.
    *   Values/Philosophy: Core societal values and philosophies.
    *   Rites of Passage: Common rites of passage (if any).
    *   Typical Attire: Description of common clothing.
8.  **Languages**:
    *   Primary Language: Details including name, grammar summary, script system, common expressions, and etymology notes.
    *   Other Notable Languages: Similar details for other significant languages (if any).
9.  **Genealogy and Lineages**:
    *   Founding Lineage Myth: Story of the nation's founding family/hero.
    *   Notable Noble Houses/Clans: Significant noble families (if any).
    *   Famous Heroes/Leaders: Legendary heroes or pivotal leaders (if any).
10. **History by Ages**: A chronological array. For each age (e.g., Prehistory, Ancient Age, Medieval Equivalent, Renaissance Equivalent, Industrial Era, Digital/Futuristic Era):
    *   Age Name: Name of the age.
    *   Summary: Overview of the nation during this age.
    *   Key Events: Array of key events with names and descriptions.
11. **Military and Defense**:
    *   Army Composition: Description of military forces.
    *   Unique Units/Special Forces: Notable unique units (if any).
    *   Warfare Techniques: Common or unique warfare strategies.
    *   Signature Weapons/Technology: Iconic military weapons/tech (if any).
    *   Historical Conflicts: Major wars (if any).
    *   Treaties/Alliances: Important military treaties (if any).
12. **Major Cities**: An array for principal cities. For each city:
    *   City Name.
    *   Description: Significance and architectural style.
    *   Districts/Castes: Notable districts or social divisions (if any).
    *   Infrastructure Highlights: Key infrastructure (if any).
    *   Population Estimate: Rough population size.
13. **Magic and Technology System** (if applicable):
    *   Source of Magic/Technology: Origin and nature.
    *   Rules/Limitations: Key rules and limitations.
    *   Integration with Society: How it's integrated into daily life.
    *   Unique Applications: Examples of unique applications (if any).
14. **Art and Aesthetics**:
    *   Music Styles: Dominant music and instruments.
    *   Dance Forms: Popular dance forms (if any).
    *   Literary Traditions: Key literary forms or traditions.
    *   Visual Symbols/Motifs: Common visual symbols in art.
    *   Mythology in Art: How mythology is represented.
    *   Architecture Style Details: Prevalent architectural styles.
    *   Body Art/Adornment: Common body art (if any).
15. **Nation Symbols and Alchemical Connections**:
    *   Custom Glyphs/Symbols: Unique national/cultural glyphs (if any).
    *   Sacred Metalinguistics: Concepts of a sacred language or symbolic system (if any).
    *   Cosmology Overview: Their understanding of the cosmos.
16. **International Connections**:
    *   Relations with Neighbors: State of relations with neighbors (if any).
    *   Diplomatic Practices: How diplomacy is conducted.
    *   Major Treaties/Pacts: Significant international agreements (if any).
    *   Espionage Activities: Known espionage efforts (if any).
17. **Formal Documents Generated**: An array of formal documents. For each document:
    *   Document Name.
    *   Content Summary.
18. **VisualAestheticOverall**: A concise summary of the overall visual aesthetic of the nation, combining elements from architecture, art, and attire. This specific field will be crucial for generating the nation's emblem.

Ensure the response is a single, valid JSON object adhering to the defined output schema.
The information across all categories should be consistent and interconnected, reflecting the initial prompt.
For arrays like 'Key Events' or 'Major Cities', provide a few detailed examples rather than an exhaustive list if brevity is needed, but aim for richness.
Be particularly detailed for the 'VisualAestheticOverall' as it directly influences symbol generation.
`,
});

const generateNationDetailsFlow = ai.defineFlow(
  {
    name: 'generateNationDetailsFlow',
    inputSchema: GenerateNationDetailsInputSchema,
    outputSchema: GenerateNationDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate nation details. The AI model did not return a valid output.");
    }
    return output;
  }
);

