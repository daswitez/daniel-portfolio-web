import type { Dictionary } from "@/i18n/dictionaries/es";
import { format } from "@/i18n/format";
import { normalize } from "@/lib/text";
import type { Profile } from "@/types/profile";

/**
 * Keyword-based answers used when no AI backend is available. Keywords cover
 * Spanish, English and Portuguese so a question works in any of the three.
 */
export function localAnswer(
  question: string,
  profile: Profile,
  t: Dictionary["assistant"],
): string {
  const q = normalize(question);

  const allTech = profile.stack.flatMap((group) => group.items);
  const hits = allTech.filter((tech) =>
    q.includes(tech.toLowerCase().split(/[\s/]/)[0]),
  );
  if (hits.length) {
    return format(t.techYes, { list: hits.join(", ") });
  }

  if (/experien|trabaj|trabalh|empresa|empleo|emprego|job|work/.test(q)) {
    return (
      profile.experience
        .map((job) =>
          format(t.job, {
            period: job.period,
            role: job.role,
            company: job.company,
          }),
        )
        .join(". ") + "."
    );
  }
  if (
    /stack|tecnolog|technolog|lenguaje|linguage|language|herramient|ferrament|tool|framework/.test(
      q,
    )
  ) {
    return (
      profile.stack
        .map((group) => `${group.name}: ${group.items.join(", ")}`)
        .join(". ") + "."
    );
  }
  if (
    /proyect|projet|project|portafolio|portfolio|hecho|feito|built|constru|build/.test(
      q,
    )
  ) {
    return (
      profile.projects
        .map(
          (project) =>
            `${project.title} (${project.description.replace(/\.$/, "")})`,
        )
        .join("; ") + "."
    );
  }
  if (
    /contact|contat|correo|email|mail|llamad|hablar|falar|talk|hire|contrat/.test(
      q,
    )
  ) {
    return format(t.contact, {
      email: profile.email,
      availability: profile.availability,
    });
  }
  if (/quien|quem|sobre|about|who|bio|eres|voce|you/.test(q)) {
    return profile.bio[0];
  }
  return format(t.fallback, { email: profile.email });
}
