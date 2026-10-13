import type {
  Tutor,
  TutoringMode,
  TutoringOffer,
} from "@calpulli/domain";

import type { DemoSeedContext } from "./seed-context";
import { bundledMedia } from "./seed-helpers";

interface TutorSpec {
  id: string;
  displayName: string;
  description: string;
  modes: readonly TutoringMode[];
  contact: string;
  subjects: readonly string[];
}

const TUTOR_SPECS: readonly TutorSpec[] = [
  {
    id: "tutor-ana-torres",
    displayName: "Ana Torres",
    description:
      "Estudiante ficticia que explica matemáticas con ejemplos y ejercicios graduales.",
    modes: ["hybrid"],
    contact: "@ana_tutora_demo",
    subjects: ["Cálculo Diferencial", "Cálculo Integral", "Álgebra"],
  },
  {
    id: "tutor-luis-mendoza",
    displayName: "Luis Mendoza",
    description:
      "Tutor ficticio enfocado en fundamentos de programación y práctica guiada.",
    modes: ["online"],
    contact: "@luis_tutor_demo",
    subjects: ["Programación", "Estructuras de Datos", "Bases de Datos"],
  },
  {
    id: "tutor-fernanda-ruiz",
    displayName: "Fernanda Ruiz",
    description:
      "Acompañamiento ficticio para interpretar problemas, datos y resultados.",
    modes: ["in-person"],
    contact: "@fernanda_tutora_demo",
    subjects: ["Probabilidad", "Estadística", "Investigación de Operaciones"],
  },
  {
    id: "tutor-diego-navarro",
    displayName: "Diego Navarro",
    description:
      "Estudiante ficticio interesado en sistemas, redes y proyectos tecnológicos.",
    modes: ["hybrid"],
    contact: "@diego_tutor_demo",
    subjects: ["Redes", "Programación", "Bases de Datos"],
  },
  {
    id: "tutor-karla-jimenez",
    displayName: "Karla Jiménez",
    description:
      "Tutoría ficticia para organizar procedimientos numéricos y conceptos administrativos.",
    modes: ["online"],
    contact: "@karla_tutora_demo",
    subjects: ["Contabilidad", "Estadística", "Álgebra"],
  },
  {
    id: "tutor-mateo-cruz",
    displayName: "Mateo Cruz",
    description:
      "Sesiones ficticias de resolución paso a paso para materias cuantitativas.",
    modes: ["in-person"],
    contact: "@mateo_tutor_demo",
    subjects: [
      "Cálculo Diferencial",
      "Investigación de Operaciones",
      "Probabilidad",
    ],
  },
  {
    id: "tutor-valeria-soto",
    displayName: "Valeria Soto",
    description:
      "Acompañamiento ficticio con ejercicios cortos y revisión de conceptos de cómputo.",
    modes: ["hybrid"],
    contact: "@valeria_tutora_demo",
    subjects: ["Estructuras de Datos", "Programación", "Redes"],
  },
  {
    id: "tutor-ivan-reyes",
    displayName: "Iván Reyes",
    description:
      "Tutor ficticio para preparar guías de estudio y conectar conceptos entre materias.",
    modes: ["online", "in-person"],
    contact: "@ivan_tutor_demo",
    subjects: ["Contabilidad", "Cálculo Integral", "Bases de Datos"],
  },
];

export function createDemoTutors(context: DemoSeedContext): Tutor[] {
  return TUTOR_SPECS.map((tutor, index) => ({
    id: tutor.id,
    displayName: tutor.displayName,
    description: tutor.description,
    avatar: bundledMedia(`tutors/${tutor.id}/avatar`),
    modes: [...tutor.modes],
    externalContacts: [
      {
        id: `contact-tutor-${String(index + 1).padStart(2, "0")}`,
        type: "telegram",
        label: "Telegram de demostración",
        value: tutor.contact,
      },
    ],
    isActive: true,
    createdAt: context.atDays(-32 + index),
    updatedAt: context.atDays(-(index % 5)),
  }));
}

export function createDemoTutoringOffers(
  context: DemoSeedContext,
): TutoringOffer[] {
  let offerNumber = 0;

  return TUTOR_SPECS.flatMap((tutor, tutorIndex) =>
    tutor.subjects.map((subject, subjectIndex) => {
      offerNumber += 1;
      const mode = tutor.modes[subjectIndex % tutor.modes.length];

      return {
        id: `tutoring-offer-${String(offerNumber).padStart(3, "0")}`,
        tutorId: tutor.id,
        subject,
        description: `Acompañamiento de demostración para reforzar ${subject.toLocaleLowerCase("es-MX")}.`,
        modes: mode === undefined ? [...tutor.modes] : [mode],
        availabilityLabel:
          tutorIndex % 2 === 0
            ? "Dos tardes entre semana"
            : "Horario a acordar por contacto externo",
        isActive: true,
        createdAt: context.atDays(-18 + tutorIndex),
        updatedAt: context.atDays(-(subjectIndex + 1)),
      };
    }),
  );
}
