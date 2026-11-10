# impulsomedia.es — reglas para Claude

- **SEO técnico:** antes de cualquier push que toque páginas, metadatos, rutas, sitemap o imágenes, seguir `docs/SEO-NORMATIVA.md` y ejecutar `pnpm seo:check` contra un `pnpm start` local (puerto nuevo). No hacer push con errores.
- **Sitemap SIEMPRE:** toda página nueva indexable entra en `public/sitemap.xml` en el mismo commit que la crea (con `lastmod`, `priority` y hreflang/x-default si tiene par ES/EN). Sin excepción. Solo quedan fuera las `noindex` (privacidad, etc.).
- **Política de cambios SEO** (Chris, 10 nov 2026; detalle en `docs/SEO-NORMATIVA.md` § Política de cambios): A técnico obligatorio, B cambio pequeño, C cambio grande en página principal (títulos, H1, descriptions, URLs, menú, estructura: solo tras conversación y sí explícito), D páginas satélite SEO. Todo se decide con Chris en la conversación y se lanza desde ahí: **sin ramas ni Pull Requests en GitHub**. El agente SEO semanal solo propone. Cada cambio publicado se apunta en el changelog con fecha para medir su efecto a 4 semanas.
- **Páginas de localidades:** las páginas principales (las del menú: home, servicios, precios, nosotros, proyectos, opiniones, blog, contacto) no enlazan a landings de ciudades. El contenido local vive aparte y no se mezclan ES y EN en los enlaces.
- Build antes de push: `npx tsc --noEmit && pnpm build`, y comprobar HTTP 200 en local.
- Landings: sin precios; Gibraltar = empresas internacionales + locales, sin "frontera"; FAQ en acordeón; `ServiceLanding` recibe `path` (no funciones/iconos como props desde servidor).
- Deploy: Vercel auto desde `main`; si no se dispara, usar `create_deployment` con el sha del commit (proyecto prj_92PL2DgjNQ93BsGh1yhIUgWbLVn0, team team_NGq1UHgOyYUQKZvjL253C5yD).
- Commits: terminar con las líneas de atribución que pida la sesión.
