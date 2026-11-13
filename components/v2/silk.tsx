"use client"

import { useEffect, useRef, useState } from 'react'
import { Mesh, GOLD, GOLD2, INK } from './shared'

const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const FS = `precision highp float;
uniform float T; uniform vec2 R;
const float PI=3.14159265;
vec3 paper=vec3(0.965,0.957,0.937);
// one silk ribbon: returns premultiplied colour + alpha
vec4 ribbon(vec2 uv,float i,float t){
  float ph=i*1.731;
  float depth=fract(i*0.37+0.2);            // 0 near .. 1 far
  float x=uv.x;
  float yc=0.10+0.17*i-0.42*x*0.55
          +0.16*sin(x*1.35+t+ph)+0.07*sin(x*2.9-t*2.+ph*2.3)+0.03*sin(x*5.3+t*3.+ph*.7);
  float slope=-0.23+0.16*1.35*cos(x*1.35+t+ph)+0.07*2.9*cos(x*2.9-t*2.+ph*2.3);
  float tw=x*(1.5+0.5*sin(ph))+t*(mod(i,2.)<1.?1.:-1.)+ph*2.+0.6*sin(x*0.8+t+ph);
  float ct=cos(tw);
  float w=(0.085-0.03*depth)*(0.10+0.90*abs(ct));
  float d=(uv.y-yc)/sqrt(1.+slope*slope);
  float v=d/w;
  float blur=(0.003+0.010*depth)*0.085/w*0.5+1.5/min(R.x,R.y)/w;
  float a=1.-smoothstep(1.-blur,1.+blur,abs(v));
  // lighting: cylinder-like normal across the band, rotated by twist
  float n=clamp(v,-1.,1.);
  float front=step(0.,ct);
  float nz=sqrt(max(0.,1.-n*n*0.85));
  float lit=0.30+0.70*nz*(0.75+0.25*sin(x*2.2+tw));
  float hl=pow(max(0.,1.-abs(n-0.35*sin(tw*0.5+1.))),14.)+0.35*pow(max(0.,1.-abs(n+0.5)),5.);
  float stri=0.5+0.5*sin(n*38.+x*2.);
  vec3 goldA=vec3(0.89,0.76,0.43), goldB=vec3(0.79,0.63,0.29), deep=vec3(0.55,0.41,0.16);
  vec3 col=mix(mix(deep,goldB,lit),mix(goldB,goldA,lit),front);
  col+=vec3(1.,0.96,0.84)*hl*(0.7*front+0.22);
  col*=0.93+0.07*stri;
  col=mix(col,vec3(0.99,0.95,0.84),pow(1.-abs(ct),6.)*0.6);   // edge-on glint where it twists
  col=mix(col,paper,depth*0.55);                               // atmospheric fade
  float op=(0.92-0.5*depth)*a;
  return vec4(col*op,op);
}
float shadow(vec2 uv,float i,float t){
  float ph=i*1.731; float x=uv.x;
  float yc=0.10+0.17*i-0.42*x*0.55+0.16*sin(x*1.35+t+ph)+0.07*sin(x*2.9-t*2.+ph*2.3)+0.03*sin(x*5.3+t*3.+ph*.7);
  float tw=x*(1.5+0.5*sin(ph))+t*(mod(i,2.)<1.?1.:-1.)+ph*2.+0.6*sin(x*0.8+t+ph);
  float w=0.07*(0.10+0.90*abs(cos(tw)));
  float d=abs(uv.y-yc);
  return (1.-smoothstep(w*0.4,w+0.07,d))*0.06;
}
void main(){
  float asp=R.x/R.y;
  float port=step(asp,1.);
  vec2 uv=(gl_FragCoord.xy-0.5*R)/min(R.x,R.y);
  uv.y=-uv.y;
  vec2 s=mix(uv,vec2(uv.x*1.5+0.35,(uv.y-0.55*(1./asp-1.))*1.5-0.05),port);
  float ang=-0.38; mat2 m=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
  vec2 q=m*s; q.y+=0.34;
  float t=T;
  vec3 col=paper;
  col=mix(col,vec3(0.97,0.93,0.82),0.55*smoothstep(1.1,0.,length(s-vec2(0.55+0.08*sin(t),-0.15+0.05*cos(t)))));
  for(int k=4;k>=0;k--){
    float i=float(k);
    col*=1.-shadow(q-vec2(0.02,-0.035),i,t)*vec3(0.75,0.9,1.25);
    vec4 r=ribbon(q,i,t);
    col=col*(1.-r.a)+r.rgb;
  }
  float mL=smoothstep(-0.12,0.62,uv.x+0.10*uv.y);
  float mP=smoothstep(0.05,0.75,uv.y/(0.5/asp)*0.5+0.5-0.25);
  float m1=mix(mL,mP,port);
  m1=m1*m1*(3.-2.*m1);
  col=mix(paper,col,m1);
  gl_FragColor=vec4(col,1.);
}`

/**
 * Live gold-silk artwork for the home hero. Drawn by the GPU at the screen's own pixel density,
 * so it is sharp on any display and costs a few KB instead of a video file.
 * Falls back to the soft gradient mesh when WebGL is unavailable.
 */
export function Silk() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const gl = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) { setFallback(true); return }
    const sh = (type: number, src: string) => {
      const o = gl.createShader(type)!
      gl.shaderSource(o, src); gl.compileShader(o)
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null
    }
    const v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS)
    if (!v || !f) { setFallback(true); return }
    const pr = gl.createProgram()!
    gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr); gl.useProgram(pr)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'p')
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uT = gl.getUniformLocation(pr, 'T'), uR = gl.getUniformLocation(pr, 'R')

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, visible = true, last = 0, t = 1.6
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr)
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; gl.viewport(0, 0, w, h) }
      gl.uniform2f(uR, w, h)
    }
    const draw = () => { gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4) }
    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      if (now - last >= 30) { // ~30 fps is plenty for slow silk and halves GPU work
        t += Math.min(now - last, 100) / 1000 * (Math.PI * 2 / 14)
        last = now
        draw()
      }
      raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!still && !raf) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    size(); draw(); kick()
    const ro = new ResizeObserver(() => { size(); draw() })
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick() })
    io.observe(c)
    const vis = () => { if (!document.hidden) kick() }
    document.addEventListener('visibilitychange', vis)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [])

  if (fallback) return <Mesh colors={[GOLD, GOLD2, INK, GOLD]} alpha={0.22} />
  return <canvas ref={ref} className="silk" aria-hidden="true" />
}
