(()=>{var E=(()=>{let t=0,r=o=>document.getElementById(o),i=o=>{r("lb-img").src="",t=o,r("lb-img").src=images[t].dataset.full||images[t].src},l=o=>{let m=o.closest(".gallery")||o.closest("figure");images=m?[...m.querySelectorAll("img")]:[o];let n=images.indexOf(o);i(n>=0?n:0),r("lightbox").classList.add("active"),document.body.style.overflow="hidden",document.addEventListener("keydown",f)},d=()=>{r("lightbox").classList.remove("active"),document.body.style.overflow="",document.removeEventListener("keydown",f)},s=()=>{t>0&&i(t-1)},e=()=>{t<images.length-1&&i(t+1)},f=o=>{o.key==="Escape"&&d(),o.key==="ArrowLeft"&&s(),o.key==="ArrowRight"&&e()};return r("lb-close")?.addEventListener("click",d),r("lb-prev")?.addEventListener("click",s),r("lb-next")?.addEventListener("click",e),{open:l}})();window.toggleFrame=t=>E.open(t);var q=()=>{let t=document.getElementById("hero-canvas"),r=document.getElementById("hero-text");if(!t||!r)return;let i=.2,l=!1,d=()=>{l=!0},s=()=>{l=!1};t.addEventListener("mousedown",d),t.addEventListener("mouseup",s),t.addEventListener("mouseleave",s),t.addEventListener("touchstart",c=>{c.preventDefault(),d()},{passive:!1}),t.addEventListener("touchend",s),t.addEventListener("touchcancel",s);let e=t.getContext("webgl");if(!e){r.style.display="block";return}let f=`
    attribute vec2 position;

    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `,o=`
    precision mediump float;

    uniform float angle;
    uniform vec2 resolution;

    mat2 rot(in float a) {
        return mat2(cos(a), sin(a), -sin(a), cos(a));
    }

    float sdPyramid(vec3 p, float h) {
        float m2 = h * h + 0.25;

        p.xz = abs(p.xz);
        p.xz = (p.z > p.x) ? p.zx : p.xz;
        p.xz -= 0.5;

        vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);
        float s = max(-q.x, 0.0);
        float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);
        float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
        float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);

        float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);
        return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
    }

    float de(vec3 p) {
        float s = 10.0;
        float de = sdPyramid(p / s, 0.7) * s;
        return de;
    }

    vec3 normal(vec3 p) {
        vec3 e = vec3(0.0, 0.001, 0.0);

        return normalize(
            vec3(
                de(p+e.yxx) - de(p-e.yxx),
                de(p+e.xyx) - de(p-e.xyx),
                de(p+e.xxy) - de(p-e.xxy)
            )
        );
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
        uv.y *= resolution.y / resolution.x;

        vec3 from = vec3(-40, 5.0, 0);
        vec3 dir = normalize(vec3(uv * 0.3, 1.0));
        dir.xz *= rot(3.1415 * .5);
        dir.xy *= rot(3.1415 * .0165);

        mat2 rotxz = rot(angle + 800.0);
        mat2 rotxy = rot(0.0);

        from.xy *= rotxy;
        from.xz *= rotxz;
        dir.xy  *= rotxy;
        dir.xz  *= rotxz;

        float mindist = 100000.0;
        float totdist = 0.0;
        bool set = false;
        vec3 norm = vec3(0.0);

        vec3 light = normalize(vec3(10.0, 0.0, 2.0));

        for (int steps = 0 ; steps < 100 ; steps++) {
            if (set) continue;
            vec3 p = from + totdist * dir;
            float dist = max(min(de(p), 1.0), 0.0);

            mindist = min(dist, mindist);

            totdist += dist;
            if (dist < 0.1) {
                set = true;
                norm = normal(p);
            }
        }

        if (set) {
            vec3 teal = vec3(0.0, 0.463, 0.58);
            vec3 value = mix(vec3(dot(light, norm) * .5 + .5), teal, 0.6);
            gl_FragColor = vec4(value, 1.0);
        }
    }
  `;function m(c,v){let a=e.createShader(c);return e.shaderSource(a,v),e.compileShader(a),a}let n=e.createProgram();if(e.attachShader(n,m(e.VERTEX_SHADER,f)),e.attachShader(n,m(e.FRAGMENT_SHADER,o)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))return;e.useProgram(n),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let h=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,h),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let x=e.getAttribLocation(n,"position");e.enableVertexAttribArray(x),e.vertexAttribPointer(x,2,e.FLOAT,!1,0,0);let b=e.getUniformLocation(n,"angle"),A=e.getUniformLocation(n,"resolution"),p=0,y=0;function g(c){let v=window.devicePixelRatio||1,a=t.clientWidth*v,u=t.clientHeight*v;(t.width!==a||t.height!==u)&&(t.width=a,t.height=u,e.viewport(0,0,a,u));let L=(c-y)*.001;y=c,i+=((l?4:.2)-i)*.05,p+=i*L,e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.uniform1f(b,p),e.uniform2f(A,t.width,t.height),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(g)}t.style.display="block",requestAnimationFrame(g)};q();})();
