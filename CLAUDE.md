# impulsomedia.es — reglas para Claude

- **SEO técnico:** antes de cualquier push que toque páginas, metadatos, rutas, sitemap o imágenes, seguir `docs/SEO-NORMATIVA.md` y ejecutar `pnpm seo:check` contra un `pnpm start` local (puerto nuevo). No hacer push con errores.
- **Sitemap SIEMPRE:** toda página nueva indexable entra en `public/sitemap.xml` en el mismo commit que la crea (con `lastmod`, `priority` y hreflang/x-default si tiene par ES/EN). Sin excepción. Solo quedan fuera las `noindex` (privacidad, etc.).
- **Política de cambios SEO** (decidida por Chris el 10 nov 2026, detalle en `docs/SEO-NORMATIVA.md` § Política de cambios): A técnico obligatorio → PR directo; B cambios pequeños de contenido → se acumulan y van en un lote mensual que Chris aprueba con sí/no; C cambios grandes (títulos, H1, descriptions, URLs, menú, estructura) en páginas principales → no se tocan sin conversación previa y un sí explícito; D páginas satélite SEO (landings geográficas fuera del menú) → más libertad, van en la lista de propuestas. Cada cambio aplicado se apunta en el changelog con fecha para medir su efecto a 4 semanas.
- Build antes de push: `npx tsc --noEmit && pnpm build`, y comprobar HTTP 200 en local.
- Landings: sin precios; Gibraltar = empresas internacionales + locales, sin "frontera"; FAQ en acordeón; `ServiceLanding` recibe `path` (no funciones/iconos como props desde servidor).
- Deploy: Vercel auto desde `main`; si no se dispara, usar `create_deployment` con el sha del commit (proyecto prj_92PL2DgjNQ93BsGh1yhIUgWbLVn0, team team_NGq1UHgOyYUQKZvjL253C5yD).
- Commits: terminar con las líneas de atribución que pida la sesión.
