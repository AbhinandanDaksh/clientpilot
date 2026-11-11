export type Lead = { id: number; name: string; category: string; location: string; score: number; source: string; status: string; duplicate?: boolean };
export const categories = ["Restaurants & Cafés", "Clinics & Healthcare", "Salons & Spas", "Local Retail Shops", "Hotels & Guesthouses"];
export const initialLeads: Lead[] = [
  { id: 1, name: "The Daily Grind", category: categories[0], location: "Ghaziabad", score: 92, source: "Google Business", status: "New" },
  { id: 2, name: "Bloom Dental Studio", category: categories[1], location: "Modinagar", score: 86, source: "Verified website", status: "Qualified" },
  { id: 3, name: "Nook & Nest", category: categories[3], location: "Ghaziabad", score: 81, source: "Google Business", status: "Audited", duplicate: true },
  { id: 4, name: "Aura Skin & Spa", category: categories[2], location: "Modinagar", score: 78, source: "Instagram profile", status: "New" },
  { id: 5, name: "The Fern House", category: categories[4], location: "Ghaziabad", score: 74, source: "Verified website", status: "Contacted" },
];
