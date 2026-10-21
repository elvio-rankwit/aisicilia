// Nodi JSON-LD per tipo di pagina. CONTRATTO di Fase 0: le pagine chiamano queste funzioni e
// passano il risultato a PageSeo.jsonld. SeoHead aggiunge i nodi globali (WebSite, Organization,
// Person, WebPage, BreadcrumbList) e scrive un unico @graph. Implementazione: seo-geo-engineer (Fase 2).
import type { Article, Company, Event, Prompt } from '../data';

export type JsonLdNode = Record<string, unknown>;
export interface ListItem { url: string; name: string }

export const companyNodes = (_c: Company): JsonLdNode[] => [];
export const eventNodes = (_e: Event): JsonLdNode[] => [];
export const articleNodes = (_a: Article): JsonLdNode[] => [];
export const promptNodes = (_p: Prompt): JsonLdNode[] => [];
/** ItemList per directory, pagine provincia, hub. */
export const itemListNodes = (_o: { path: string; name: string; items: ListItem[] }): JsonLdNode[] => [];
/** CollectionPage per gli hub (/aziende/, /eventi/, /impara/, /prompt/ e settori). */
export const collectionPageNodes = (_o: { path: string; name: string; description: string }): JsonLdNode[] => [];
/** ProfilePage + Person completo per /chi-siamo/. */
export const profilePageNodes = (): JsonLdNode[] => [];
