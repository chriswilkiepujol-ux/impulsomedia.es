# Normativa SEO técnica de impulsomedia.es

**Regla de oro:** nada se publica sin pasar esta lista. La mayoría se comprueba sola con `pnpm seo:check`; el resto es revisión manual.
Decidida por Chris el 28 oct 2026, tras un informe de auditoría que detectó errores de hreflang, títulos/descripciones largos y Open Graph incompleto en las páginas nuevas.

## Antes de cada push (obligatorio)

```bash
npx tsc --noEmit
pnpm build
pnpm start -p 3470 &      # puerto libre; no reutilizar uno antiguo
pnpm seo:check http://localhost:3470   # debe terminar en "✓ Technical SEO check passed"
```

Si `seo:check` da errores no se hace push. Los avisos (`!`) se revisan y se justifican o se arreglan.

## Reglas (las que valida el script marcadas con ✔)

### Metadatos
- ✔ **Title ≤ 60 caracteres** contando el sufijo ` | ImpulsoMedia` (la plantilla lo añade: el título propio ≤ 46). Keyword principal + zona al principio.
- ✔ **Meta description 90–160 caracteres**, con propuesta clara y llamada a la acción suave. Sin precios en landings.
- ✔ **Canonical** autorreferente en todas las URLs indexables.
- ✔ **Un único `<h1>`** por página, con la keyword principal.
- ✔ Sin `noindex` en URLs del sitemap.
- Cada página: title y description **únicos** (nada duplicado entre ciudades).

### Idiomas (hreflang)
- ✔ Cada par ES/EN se enlaza **en los dos sentidos** (`alternatePath` en ambos datos) y también en `public/sitemap.xml`.
- ✔ **`x-default` = la URL en español en las dos páginas del par** (nunca cada una a sí misma). Páginas sin versión en otro idioma: `x-default` = ella misma.
- ✔ Un solo valor por idioma (`es-ES`, `en-GB`); sin duplicados en `<head>` ni en el sitemap.
- ✔ Las `<head>` y el sitemap coinciden.
- Slugs EN en `/en/...`, ES sin prefijo. Añadir la pareja a `lib/route-map.ts`.

### Open Graph / redes
- ✔ `og:title`, `og:description`, `og:image` en todas las páginas. Imagen **PNG/JPG 1200×630** (nunca SVG).
- Portadas nuevas: crear el SVG `*-cover.svg` y generar su gemelo `*-cover-og.png` (script en `scripts/` / ver historial). Las landings lo derivan solas de `heroImage`.
- Cuidado: un `openGraph` en una página **sustituye** al del layout; hay que repetir `images`.
- `twitter:image` presente.

### Sitemap e indexación
- ✔ **Regla absoluta:** toda ruta nueva indexable en `public/sitemap.xml` en el mismo commit que la crea, sin excepción (con `lastmod`, `priority`, alternates). El script avisa de rutas que faltan.
- ✔ `robots.txt` y `sitemap.xml` responden 200.
- Tras publicar: pedir indexación en Search Console (máx. 10/día) de las URLs nuevas, empezando por las de más prioridad.

### Contenido y enlazado
- Cada landing: contenido **único** (caso, FAQ y ejemplos propios); FAQ con schema `FAQPage`; `BreadcrumbList` y `Service` JSON-LD (`landingSchema`).
- ✔ JSON-LD parseable.
- Enlazado interno: las landings de localidades enlazan a los servicios, a otras landings del **mismo idioma** y al índice (`/zonas`, `/en/areas`); las páginas principales **no** enlazan a landings (solo el footer, con un enlace al índice). Toda página nueva recibe al menos 3 enlaces internos y enlaza a 3. Contenido de IA genérico (sin detalles de cómo se construyen los sistemas).
- ✔ Imágenes con `alt` descriptivo.
- Sin precios en landings; los precios solo en `/precios` (guía con "desde" orientativos).
- Gibraltar: copy para empresas internacionales (operadores, finanzas, despachos) y locales; no hablar de "frontera".

### Rendimiento y técnico
- Core Web Vitals en verde en móvil (comprobar con `check_core_web_vitals` tras cambios grandes).
- Sin redirecciones en cadena; sin enlaces rotos internos; HTTPS y dominio canónico únicos.
- Verificar en producción tras el despliegue: 200 en todas las URLs nuevas y `<head>` correcto (`curl`).

### IA y datos estructurados (AI search)
- `/llms.txt` y `/llms-full.txt` se generan solos desde los datos (`lib/llms.ts`): una página nueva aparece si está en `lib/areas.ts` (pilares o zonas), en `lib/landing-data*` / `service-pages*` o en `lib/blog-data.ts`. No editar a mano.
- Schema de toda la web en `app/layout.tsx` (`@graph`: `ProfessionalService` + `WebSite`), con `sameAs` (Google Business, Instagram @impulsomediaes) y `alternateName`. Cada perfil nuevo de la marca (LinkedIn de empresa, Facebook, directorios) se añade a `sameAs`.
- Listados con `ItemList` (`lib/schema.ts`): servicios, blog y proyectos; opiniones como `Review`. Salen de los mismos datos que la página (`lib/projects-data.ts`, `lib/reviews-data.ts`): no duplicar datos en los componentes.
- Solo reseñas reales; la valoración (`aggregateRating`) debe coincidir con Google.
- Contenido en HTML del servidor (nada importante solo en cliente), FAQs en formato pregunta/respuesta y datos de contacto idénticos en web, Google Business y directorios.
- Seguridad: las cabeceras viven en Vercel (Project → Routing, regla "Security headers"); no hay CSP estricta a propósito (riesgo para analítica e inline JSON-LD).

## Cuando se añade una página nueva — checklist rápido
1. Datos (`lib/landing-data*.ts` / `service-pages*.ts`) con `alternatePath` si hay versión en otro idioma.
2. Ruta `app/.../page.tsx`.
3. Portada SVG + PNG OG.
4. Landing de localidad: `lib/areas.ts` (con `zone` y descripciones, aparece sola en el índice de zonas) y `lib/route-map.ts`; siempre `public/sitemap.xml`.
5. `pnpm seo:check` en verde → commit → push → comprobar en producción.
6. Pedir indexación en Search Console; anotar en el dashboard SEO.

## Política de cambios SEO (Chris, 10 nov 2026)
Objetivo: más impresiones, clics y rankings, llegar a posiciones 1-5 en las keywords objetivo, sin cambiar tantas cosas a la vez que no se sepa qué ha funcionado.

| Tipo | Qué es | Cómo se aplica |
|---|---|---|
| **A — Técnico obligatorio** | Sitemap de páginas nuevas, hreflang, canonical, OG, alt, JSON-LD roto, enlaces rotos, límites de esta normativa | Se propone y se lanza en cuanto Chris lo confirma en la conversación. No cambia el copy |
| **B — Pequeño** | Retoques de contenido: una FAQ, un párrafo, un caso, enlaces internos, alt | Se acumulan en la lista de propuestas. Chris dice sí/no; lo aprobado se lanza desde la conversación, agrupado para poder medir |
| **C — Grande** | Títulos, H1, descriptions, URLs/slugs, redirecciones, menú, plantillas, fusionar o borrar páginas, en páginas principales | No se toca sin conversación: el agente explica por qué, datos, riesgo, efecto esperado, cómo se mide y cómo se revierte. Solo con un sí explícito de Chris |
| **D — Satélite SEO** | Landings geográficas o de captación que no van en el menú principal (`/diseno-web-*`, `/seo-algeciras`, `/agencia-marketing-digital-algeciras`, `/en/*-gibraltar`, `/en/web-design-sotogrande`) y posts del blog | Más libertad: también títulos y contenido, propuestos en la lista y aprobados con sí/no |

**Páginas principales** (tipo C para títulos/estructura): home `/` y `/en`, `/servicios` y `/servicios/*` (y `/en/services*`), `/precios`, `/nosotros`, `/contacto`, `/proyectos`, `/opiniones`, `/blog` (índice) y sus versiones EN.

Cómo se publica: **sin ramas ni Pull Requests**. Todo se decide con Chris en la conversación y se lanza desde ahí (commit a `main` tras tsc + build + `seo:check`). El agente semanal solo diagnostica y propone.

Páginas de localidades: las páginas principales (menú) no enlazan a las landings de ciudades; el contenido local vive aparte; no se mezclan enlaces ES↔EN.

Reglas de medición:
- Una sola modificación relevante por página y ciclo; no volver a tocar una página hasta 4 semanas después de cambiarla (salvo errores tipo A).
- Todo cambio aplicado se apunta en el changelog (doc del proyecto `claude/seo-changelog.md`) con fecha, página, qué se cambió y la línea base (impresiones, clics y posición a 28 días) para compararla a las 4 semanas.
- Las propuestas viven numeradas (P-xx) en el doc del proyecto `claude/seo-propuestas.md` con su tipo y su estado (Propuesta / Sí / No / Aplicada).

## Vigilancia continua
Un agente SEO semanal (tarea programada) revisa Search Console y esta normativa en producción y propone mejoras. Sus informes van al dashboard y al doc de proyecto. Si encuentra incumplimientos, los lista con la corrección propuesta.
