(()=>{var h=t=>{document.getElementById("veil").classList.toggle("active"),document.body.classList.toggle("veil-visible");let a=document.getElementById("focusedImg");t&&(a.src=t.src)};window.toggleFrame=h;var A=()=>{let t=document.getElementById("hero-canvas"),a=document.getElementById("hero-text");if(!t||!a)return;let c=0,m=0;t.addEventListener("mousemove",n=>{let r=t.getBoundingClientRect();c=(n.clientX-r.left)/r.width-.5,m=(n.clientY-r.top)/r.height-.5});let e=t.getContext("webgl");if(!e)return;e.getExtension("OES_standard_derivatives");let x=`
    attribute vec2 pos;
    void main() { gl_Position = vec4(pos, 0.0, 1.0); }
  `,v=`
    #extension GL_OES_standard_derivatives: enable

    precision mediump float;
    uniform float t;
    uniform vec2 res;
    uniform vec2 mouse;

    #define PIXEL_SIZE 1.0

    mat2 rot(in float a) {
        return mat2(cos(a),sin(a),-sin(a),cos(a));	
    }

    float sdPyramid(vec3 p, float h) {
        float m2 = h*h + 0.25;

        p.xz = abs(p.xz);
        p.xz = (p.z>p.x) ? p.zx : p.xz;
        p.xz -= 0.5;

        vec3 q = vec3(p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
        float s = max(-q.x,0.0);
        float t = clamp((q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0);
        float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
        float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);

        float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
        return sqrt((d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
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
        vec2 uv = gl_FragCoord.xy / res.xy * 2.0 - 1.0;
    	  uv.y *= res.y / res.x;

    	  vec3 from = vec3(-40, 5.0, 0);
    	  vec3 dir = normalize(vec3(uv*0.3, 1.0));
    	  dir.xz *= rot(3.1415 * .5);
        dir.xy *= rot(3.1415 * .0165);

    	  mat2 rotxz = rot(t * 0.2 + mouse.x * 3.0 + 800.0);
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
  `;function d(n,r){let i=e.createShader(n);return e.shaderSource(i,r),e.compileShader(i),i}let o=e.createProgram();if(e.attachShader(o,d(e.VERTEX_SHADER,x)),e.attachShader(o,d(e.FRAGMENT_SHADER,v)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))return;e.useProgram(o),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let l=e.getAttribLocation(o,"pos");e.enableVertexAttribArray(l),e.vertexAttribPointer(l,2,e.FLOAT,!1,0,0);let p=e.getUniformLocation(o,"t"),g=e.getUniformLocation(o,"res"),y=e.getUniformLocation(o,"mouse");function f(n){let r=window.devicePixelRatio||1,i=t.clientWidth*r,s=t.clientHeight*r;(t.width!==i||t.height!==s)&&(t.width=i,t.height=s,e.viewport(0,0,i,s)),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.uniform1f(p,n*.001),e.uniform2f(g,t.width,t.height),e.uniform2f(y,c,m),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(f)}t.style.display="block",a&&(a.style.display="none"),requestAnimationFrame(f)};A();})();
