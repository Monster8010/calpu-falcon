import type { Entrepreneur } from "@calpulli/domain";

import type { DemoSeedContext } from "./seed-context";
import { bundledMedia } from "./seed-helpers";

export const ENTREPRENEUR_IDS = {
  quetzalCafe: "entrepreneur-quetzal-cafe",
  nopalStudio: "entrepreneur-nopal-studio",
  tenochtliTech: "entrepreneur-tenochtli-tech",
  xoloPrint: "entrepreneur-xolo-print",
  cacaoLab: "entrepreneur-cacao-lab",
  axolotlAccessories: "entrepreneur-axolotl-accesorios",
  circularCorn: "entrepreneur-maiz-circular",
  tlalliCeramics: "entrepreneur-tlalli-ceramica",
  pixelCalpulli: "entrepreneur-pixel-calpulli",
  mecatl: "entrepreneur-mecatl",
} as const;

const ENTREPRENEUR_SPECS = [
  {
    id: ENTREPRENEUR_IDS.quetzalCafe,
    displayName: "Quetzal Café",
    category: "Alimentos",
    description:
      "Bebidas y mezclas de café preparadas por un proyecto estudiantil ficticio.",
    contact: "@quetzalcafe_demo",
  },
  {
    id: ENTREPRENEUR_IDS.nopalStudio,
    displayName: "Nopal Studio",
    category: "Diseño",
    description:
      "Identidad visual e ilustración para proyectos universitarios y comunitarios.",
    contact: "@nopalstudio_demo",
  },
  {
    id: ENTREPRENEUR_IDS.tenochtliTech,
    displayName: "Tenochtli Tech",
    category: "Tecnología",
    description:
      "Prototipos digitales sencillos para organizar equipos y actividades estudiantiles.",
    contact: "@tenochtlitech_demo",
  },
  {
    id: ENTREPRENEUR_IDS.xoloPrint,
    displayName: "Xolo Print",
    category: "Impresión y arte",
    description:
      "Gráfica, impresiones y piezas ilustradas producidas en pequeñas series.",
    contact: "@xoloprint_demo",
  },
  {
    id: ENTREPRENEUR_IDS.cacaoLab,
    displayName: "Cacao Lab",
    category: "Alimentos",
    description:
      "Experimentos ficticios de cacao, sabores y presentaciones para compartir.",
    contact: "@cacaolab_demo",
  },
  {
    id: ENTREPRENEUR_IDS.axolotlAccessories,
    displayName: "Axólotl Accesorios",
    category: "Accesorios",
    description:
      "Accesorios coloridos inspirados en la vida universitaria y la ciudad.",
    contact: "@axolotlaccesorios_demo",
  },
  {
    id: ENTREPRENEUR_IDS.circularCorn,
    displayName: "Maíz Circular",
    category: "Sustentabilidad",
    description:
      "Objetos reutilizables y propuestas para reducir residuos en actividades cotidianas.",
    contact: "@maizcircular_demo",
  },
  {
    id: ENTREPRENEUR_IDS.tlalliCeramics,
    displayName: "Tlalli Cerámica",
    category: "Artesanía",
    description:
      "Piezas utilitarias de cerámica con acabados contemporáneos y series pequeñas.",
    contact: "@tlalliceramica_demo",
  },
  {
    id: ENTREPRENEUR_IDS.pixelCalpulli,
    displayName: "Pixel Calpulli",
    category: "Servicios digitales",
    description:
      "Apoyo ficticio para presentaciones, sitios informativos y materiales digitales.",
    contact: "@pixelcalpulli_demo",
  },
  {
    id: ENTREPRENEUR_IDS.mecatl,
    displayName: "Mecatl",
    category: "Textiles",
    description:
      "Bolsas, estuches y piezas textiles funcionales creadas para el uso diario.",
    contact: "@mecatl_demo",
  },
] as const;

export function createDemoEntrepreneurs(
  context: DemoSeedContext,
): Entrepreneur[] {
  return ENTREPRENEUR_SPECS.map((entrepreneur, index) => ({
    id: entrepreneur.id,
    displayName: entrepreneur.displayName,
    category: entrepreneur.category,
    description: entrepreneur.description,
    avatar: bundledMedia(`entrepreneurs/${entrepreneur.id}/avatar`),
    gallery: [
      bundledMedia(`entrepreneurs/${entrepreneur.id}/gallery-1`),
      bundledMedia(`entrepreneurs/${entrepreneur.id}/gallery-2`),
    ],
    externalContacts: [
      {
        id: `contact-entrepreneur-${String(index + 1).padStart(2, "0")}`,
        type: "instagram",
        label: "Instagram de demostración",
        value: entrepreneur.contact,
      },
    ],
    isActive: true,
    createdAt: context.atDays(-45 + index),
    updatedAt: context.atDays(-index % 4),
  }));
}
