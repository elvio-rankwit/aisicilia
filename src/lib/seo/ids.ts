// Identificatori (@id) stabili dei nodi JSON-LD. Un nodo = un @id, mai duplicato nel grafo.
import { abs } from './url';

export const ID = {
  website: `${abs('/')}#website`,
  organization: `${abs('/')}#organization`,
  logo: `${abs('/')}#logo`,
  person: `${abs('/chi-siamo/')}#elvio-leonardi`,
  webpage: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  image: (path: string) => `${abs(path)}#primaryimage`,
  company: (path: string) => `${abs(path)}#company`,
  event: (path: string) => `${abs(path)}#event`,
  article: (path: string) => `${abs(path)}#article`,
  faq: (path: string) => `${abs(path)}#faq`,
  prompt: (path: string) => `${abs(path)}#prompt`,
  itemlist: (path: string) => `${abs(path)}#itemlist`,
};

export const IN_LANGUAGE = 'it-IT';
