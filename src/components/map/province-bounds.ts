// FILE GENERATO da scripts/geocode/build-provinces.mjs: non modificare a mano.
// Fonte: ISTAT, confini amministrativi generalizzati al 01/01/2025, licenza CC BY 4.0.
import type { ProvinceSlug } from '../../lib/provinces';

/** Riquadri [[sud, ovest], [nord, est]] della parte principale di ogni provincia (isole minori escluse). */
export const PROVINCE_BOUNDS: Record<ProvinceSlug, [[number, number], [number, number]]> = {agrigento:[[37.0952,12.888],[37.7426,14.0363]],caltanissetta:[[37.0016,13.6522],[37.7439,14.474]],catania:[[37.0505,14.3526],[37.9609,15.2585]],enna:[[37.2928,14.056],[37.8788,14.8272]],messina:[[37.7953,14.1835],[38.3014,15.652]],palermo:[[37.5406,12.9311],[38.2246,14.2939]],ragusa:[[36.6928,14.3379],[37.1395,15.0004]],siracusa:[[36.6477,14.7745],[37.4127,15.3363]],trapani:[[37.56,12.4255],[38.1892,13.1001]]};

/** Riquadro della Sicilia (isola principale, isole minori escluse). */
export const SICILY_BOUNDS: [[number, number], [number, number]] = [[36.6477,12.4255],[38.3014,15.652]];
