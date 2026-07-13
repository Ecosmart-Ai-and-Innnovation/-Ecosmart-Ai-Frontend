import type { LucideIcon } from "lucide-react";
import {
  Milk, Wine, FileText, Package, Cylinder, Cog,
  Laptop, Battery, Shirt, Disc, Leaf, TreePine,
} from "lucide-react";

// Single source of truth for recycler materials, shared by Step 3 (what you
// collect) and Step 4 (pricing). `id` is what gets stored in selectedMaterials
// and used as the key in the prices map. min/max are the ₦/kg guidance range
// used to validate the price the recycler enters.
export type RecyclerMaterial = {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  min: number;
  max: number;
};

export const RECYCLER_MATERIALS: RecyclerMaterial[] = [
  { id: "Plastic", name: "Plastic", desc: "PET, HDPE, LDPE", icon: Milk, min: 50, max: 150 },
  { id: "Glass", name: "Glass", desc: "Bottles & jars", icon: Wine, min: 20, max: 60 },
  { id: "Paper", name: "Paper", desc: "Newspapers, office", icon: FileText, min: 10, max: 40 },
  { id: "Cardboard", name: "Cardboard", desc: "Boxes & packaging", icon: Package, min: 20, max: 50 },
  { id: "Aluminium", name: "Aluminium", desc: "Cans & foil", icon: Cylinder, min: 200, max: 500 },
  { id: "Steel", name: "Steel", desc: "Scrap metal", icon: Cog, min: 100, max: 300 },
  { id: "Electronics", name: "Electronics", desc: "E-waste", icon: Laptop, min: 200, max: 800 },
  { id: "Batteries", name: "Batteries", desc: "All types", icon: Battery, min: 100, max: 400 },
  { id: "Textiles", name: "Textiles", desc: "Clothing & fabric", icon: Shirt, min: 20, max: 80 },
  { id: "Rubber", name: "Rubber", desc: "Tyres & hoses", icon: Disc, min: 30, max: 100 },
  { id: "Organic Waste", name: "Organic Waste", desc: "Food & garden", icon: Leaf, min: 10, max: 30 },
  { id: "Wood", name: "Wood", desc: "Timbers, woods", icon: TreePine, min: 20, max: 60 },
];
