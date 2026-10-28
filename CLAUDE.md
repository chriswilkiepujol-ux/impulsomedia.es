# impulsomedia.es — reglas para Claude

- **SEO técnico:** antes de cualquier push que toque páginas, metadatos, rutas, sitemap o imágenes, seguir `docs/SEO-NORMATIVA.md` y ejecutar `pnpm seo:check` contra un `pnpm start` local (puerto nuevo). No hacer push con errores.
- Build antes de push: `npx tsc --noEmit && pnpm build`, y comprobar HTTP 200 en local.
- Landings: sin precios; Gibraltar = empresas internacionales + locales, sin "frontera"; FAQ en acordeón; `ServiceLanding` recibe `path` (no funciones/iconos como props desde servidor).
- Deploy: Vercel auto desde `main`; si no se dispara, usar `create_deployment` con el sha del commit (proyecto prj_92PL2DgjNQ93BsGh1yhIUgWbLVn0, team team_NGq1UHgOyYUQKZvjL253C5yD).
- Commits: terminar con las líneas de atribución que pida la sesión.
