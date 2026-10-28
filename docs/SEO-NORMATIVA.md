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
- ✔ Toda ruta nueva en `public/sitemap.xml` (con `lastmod`, `priority`, alternates). El script avisa de rutas que faltan.
- ✔ `robots.txt` y `sitemap.xml` responden 200.
- Tras publicar: pedir indexación en Search Console (máx. 10/día) de las URLs nuevas, empezando por las de más prioridad.

### Contenido y enlazado
- Cada landing: contenido **único** (caso, FAQ y ejemplos propios); FAQ con schema `FAQPage`; `BreadcrumbList` y `Service` JSON-LD (`landingSchema`).
- ✔ JSON-LD parseable.
- Enlazado interno **bidireccional**: ciudad ↔ servicio (`lib/areas.ts`, `AreasStrip`, footer). Toda página nueva recibe al menos 3 enlaces internos y enlaza a 3.
- ✔ Imágenes con `alt` descriptivo.
- Sin precios en landings; los precios solo en `/precios` (guía con "desde" orientativos).
- Gibraltar: copy para empresas internacionales (operadores, finanzas, despachos) y locales; no hablar de "frontera".

### Rendimiento y técnico
- Core Web Vitals en verde en móvil (comprobar con `check_core_web_vitals` tras cambios grandes).
- Sin redirecciones en cadena; sin enlaces rotos internos; HTTPS y dominio canónico únicos.
- Verificar en producción tras el despliegue: 200 en todas las URLs nuevas y `<head>` correcto (`curl`).

## Cuando se añade una página nueva — checklist rápido
1. Datos (`lib/landing-data*.ts` / `service-pages*.ts`) con `alternatePath` si hay versión en otro idioma.
2. Ruta `app/.../page.tsx`.
3. Portada SVG + PNG OG.
4. `lib/areas.ts`, `lib/route-map.ts`, footer si procede, `public/sitemap.xml`.
5. `pnpm seo:check` en verde → commit → push → comprobar en producción.
6. Pedir indexación en Search Console; anotar en el dashboard SEO.

## Vigilancia continua
Un agente SEO semanal (tarea programada) revisa Search Console y esta normativa en producción y propone mejoras. Sus informes van al dashboard y al doc de proyecto. Si encuentra incumplimientos, los lista con la corrección propuesta.
