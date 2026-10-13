import type { EntrepreneurPost, ID, Product } from "@calpulli/domain";

import { ENTREPRENEUR_IDS } from "./entrepreneurs";
import type { DemoSeedContext } from "./seed-context";
import { bundledMedia } from "./seed-helpers";

interface ProductSpec {
  entrepreneurId: ID;
  name: string;
  description: string;
  priceLabel: string;
  category: string;
}

interface EntrepreneurPostSpec {
  entrepreneurId: ID;
  title: string;
  body: string;
  hoursAgo: number;
}

const PRODUCT_SPECS: readonly ProductSpec[] = [
  {
    entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    name: "Mezcla Calpulli",
    description: "Bebida de café de demostración con notas suaves de cacao.",
    priceLabel: "$85 MXN",
    category: "Bebidas",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.nopalStudio,
    name: "Paquete de identidad visual",
    description: "Concepto gráfico ficticio para iniciativas estudiantiles.",
    priceLabel: "Desde $120",
    category: "Diseño",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.tenochtliTech,
    name: "Prototipo de agenda colaborativa",
    description: "Demostración navegable para organizar actividades de equipo.",
    priceLabel: "Cotización",
    category: "Tecnología",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.xoloPrint,
    name: "Serie de postales Xolo",
    description: "Paquete ficticio de cuatro impresiones ilustradas.",
    priceLabel: "$95 MXN",
    category: "Impresión y arte",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.cacaoLab,
    name: "Caja de bocados de cacao",
    description: "Selección de muestra con sabores creados para la demo.",
    priceLabel: "$110 MXN",
    category: "Alimentos",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.axolotlAccessories,
    name: "Set Axólotl",
    description: "Pin y llavero de edición universitaria ficticia.",
    priceLabel: "$75 MXN",
    category: "Accesorios",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.circularCorn,
    name: "Kit de cubiertos reutilizables",
    description: "Estuche ligero para reducir desechables fuera de casa.",
    priceLabel: "$90 MXN",
    category: "Sustentabilidad",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.tlalliCeramics,
    name: "Taza Tlalli",
    description: "Pieza utilitaria de cerámica elaborada en una serie pequeña.",
    priceLabel: "$180 MXN",
    category: "Artesanía",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.pixelCalpulli,
    name: "Presentación digital para proyectos",
    description: "Diseño ficticio de diapositivas y recursos gráficos básicos.",
    priceLabel: "Cotización",
    category: "Servicios digitales",
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.mecatl,
    name: "Estuche Mecatl",
    description: "Estuche textil resistente para útiles y accesorios pequeños.",
    priceLabel: "$140 MXN",
    category: "Textiles",
  },
];

const ENTREPRENEUR_POST_SPECS: readonly EntrepreneurPostSpec[] = [
  {
    entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    title: "Nueva preparación para la feria",
    body: "Probamos una receta ficticia pensada para compartir durante la próxima edición.",
    hoursAgo: 6,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.nopalStudio,
    title: "Del boceto al sistema visual",
    body: "Una mirada breve a nuestro proceso de exploración y composición.",
    hoursAgo: 11,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.tenochtliTech,
    title: "Prototipo listo para recibir comentarios",
    body: "Buscamos opiniones sobre una forma más simple de organizar tareas en equipo.",
    hoursAgo: 19,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.xoloPrint,
    title: "Impresiones en nueva paleta",
    body: "Preparamos una pequeña serie con contrastes inspirados en la vida del plantel.",
    hoursAgo: 27,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.cacaoLab,
    title: "Sesión de sabores de cacao",
    body: "Comparamos tres combinaciones ficticias para elegir la muestra de la feria.",
    hoursAgo: 33,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.axolotlAccessories,
    title: "Accesorios para la mochila",
    body: "Compartimos una serie colorida creada especialmente para esta demostración.",
    hoursAgo: 41,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.circularCorn,
    title: "Pequeños cambios, menos residuos",
    body: "Tres ideas sencillas para llevar objetos reutilizables durante la jornada.",
    hoursAgo: 49,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.tlalliCeramics,
    title: "Nueva serie de piezas utilitarias",
    body: "Exploramos formas compactas y acabados sobrios para el uso cotidiano.",
    hoursAgo: 57,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.pixelCalpulli,
    title: "Consejos para una presentación clara",
    body: "Jerarquía, ritmo y contraste pueden hacer más comprensible cualquier proyecto.",
    hoursAgo: 72,
  },
  {
    entrepreneurId: ENTREPRENEUR_IDS.mecatl,
    title: "Textiles pensados para acompañarte",
    body: "Mostramos detalles de materiales y compartimentos de nuestra serie ficticia.",
    hoursAgo: 96,
  },
];

export function createDemoProducts(context: DemoSeedContext): Product[] {
  return PRODUCT_SPECS.map((product, index) => ({
    id: `product-${String(index + 1).padStart(3, "0")}`,
    entrepreneurId: product.entrepreneurId,
    name: product.name,
    description: product.description,
    priceLabel: product.priceLabel,
    category: product.category,
    media: [bundledMedia(`marketplace/product-${index + 1}`)],
    isActive: true,
    createdAt: context.atDays(-20 + index),
    updatedAt: context.atHours(-index * 5),
  }));
}

export function createDemoEntrepreneurPosts(
  context: DemoSeedContext,
): EntrepreneurPost[] {
  return ENTREPRENEUR_POST_SPECS.map((post, index) => {
    const publishedAt = context.atHours(-post.hoursAgo);

    return {
      id: `entrepreneur-post-${String(index + 1).padStart(3, "0")}`,
      entrepreneurId: post.entrepreneurId,
      title: post.title,
      body: post.body,
      media: [bundledMedia(`marketplace/post-${index + 1}`)],
      publishedAt,
      isPublished: true,
      isHiddenByModerator: false,
      createdAt: context.atHours(-post.hoursAgo - 3),
      updatedAt: publishedAt,
    };
  });
}
