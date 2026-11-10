import { buildLlmsTxt } from '@/lib/llms'

// Built once at deploy time and served from the CDN.
export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
