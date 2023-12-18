#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_uv;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform bool u_animation;

#define PI 3.14159265358979323846

vec2 rotate2D(vec2 _st, float _angle, float _speed, float _amplitude){
    _st -= 0.5;
    _st =  mat2(cos(_angle + (_amplitude * sin(u_time * _speed))),-sin(_angle + (_amplitude * sin(u_time * _speed))),
                sin(_angle + (_amplitude * sin(u_time * _speed))),cos(_angle + (_amplitude * sin(u_time * _speed)))) * _st;
    _st += 0.5;
    return _st;
}

vec2 rotate2DStatic(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    float speed = 0.2;
    _st.y += step(1., mod(_st.x,2.0))  * -1.0 * (step(1.0,mod(u_time * speed,2.0)) * fract(u_time * speed));
    _st.y += step(1., mod(_st.x - 1.0, 2.0)) * (step(1.0,mod(u_time * speed,2.0)) * fract(u_time * speed));
    _st.x += step(1., mod(_st.y,2.0))  * -1.0 * (step(1.0,mod(u_time * speed - 1.0,2.0)) * fract(u_time * speed));;
    _st.x += step(1., mod(_st.y - 1.0, 2.0)) * (step(1.0,mod(u_time * speed - 1.0,2.0)) * fract(u_time * speed));
    return fract(_st);
}

float circle(in vec2 _st, in float _radius, in vec2 _center){
    vec2 dist = _st-_center;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float drawPolygon(in vec2 pos, in int n, in vec2 st) {
    st = st * 2.-1.;
    st.x += pos.x;
    st.y += pos.y;
    
    float a = atan(st.x, st.y) + PI;
    float r = (PI * 2.0) / float(n);
    
    float d = cos(floor(0.5 + a/r)*r-a)*length(st);
    
    return d;
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(){
    vec2 st = v_uv;
    vec3 color = vec3(0.0);

    vec2 desktopSt = vec2(v_uv.x, clamp((v_uv.y - 0.27)* 2.1, 0.0, 1.0));
    vec2 mobileSt = vec2(clamp((v_uv.x - 0.4)* 4.7, 0.0, 1.0), clamp((v_uv.y - 0.25)* 2.1, 0.0, 1.0));
    float mouseFactor = 0.0;
    float speed = 0.0;
    float amplitude = 0.0;
    if (u_animation) {
        speed = 2.0;
        amplitude = PI / 2.0;
         if (u_resolution.x / u_resolution.y >= 1.0) {
            st = tile(st,16.);
        } else {
            st = tile(st,32.);
        }  
    } else {
        amplitude = 1.0;
        if (u_resolution.x / u_resolution.y >= 1.0) {
            st = tile(st,16.);
            mouseFactor = 1.0 - (distance(u_mouse, desktopSt) * 0.75);
            speed = step(0.85, mouseFactor) * 2.0;
        } else {
            st = tile(st,32.);
            mouseFactor = 1.0 - (distance(u_mouse, mobileSt) * 0.75);
            speed = step(0.85, mouseFactor) * 2.0;
        }  
    } 

    vec2 st0 = rotate2D(st, 0.0, speed, amplitude);
    vec2 st1 = rotate2DStatic(st,PI*0.5);
    vec2 st2 = rotate2D(st, PI / 3.0, speed, amplitude);
    vec2 st3 = rotate2D(st,  -1.0 * PI / 3.0, speed, amplitude);
    vec2 st4 = rotate2D(st, 2.0 * PI / 3.0, speed, amplitude);
    vec2 st5 = rotate2D(st, -2.0 * PI / 3.0, speed,amplitude);
    vec2 st6 = rotate2D(st, PI, speed, amplitude);
    vec2 st7 = rotate2D(st, PI / 2.0, -1.0 * speed, amplitude);
    vec2 st8 = rotate2D(st, PI / 6.0, -1.0 * speed, amplitude);
    vec2 st9 = rotate2D(st, -1.0 * PI / 6.0, -1.0 * speed, amplitude);
    vec2 st10 = rotate2D(st, -1.0 * PI / 2.0, -1.0 * speed, amplitude);
    vec2 st11 = rotate2D(st, 5.0 * PI / 6.0, -1.0 * speed, amplitude);
    vec2 st12 = rotate2D(st, -5.0 * PI / 6.0, -1.0 * speed, amplitude);
    

    color = vec3(1.0 - step(1., drawPolygon(vec2(0), 6, st1) * 6.0));
    
    // stems
    // outer
    color += vec3(box(st0, vec2(0.03,0.70), 0.01));
    color += vec3(box(st2, vec2(0.03,0.70), 0.01));
    color += vec3(box(st3, vec2(0.03,0.70), 0.01));
    //inner
	color += vec3(box(st7, vec2(0.03,0.50), 0.01));
	color += vec3(box(st8, vec2(0.03,0.50), 0.01));
	color += vec3(box(st9, vec2(0.03,0.50), 0.01));
    
    //baubles
    //outer
    color += vec3(circle(st0, 0.006, vec2(0.5,0.85)));
    color += vec3(circle(st2, 0.006, vec2(0.5,0.85)));
    color += vec3(circle(st3, 0.006, vec2(0.5,0.85)));
    color += vec3(circle(st4, 0.006, vec2(0.5,0.85)));
    color += vec3(circle(st5, 0.006, vec2(0.5,0.85)));
    color += vec3(circle(st6, 0.006, vec2(0.5,0.85)));
    //inner
    color += vec3(circle(st7, 0.003, vec2(0.5,0.75)));
    color += vec3(circle(st8, 0.003, vec2(0.5,0.75)));
    color += vec3(circle(st9, 0.003, vec2(0.5,0.75)));
    color += vec3(circle(st10, 0.003, vec2(0.5,0.75)));
    color += vec3(circle(st11, 0.003, vec2(0.5,0.75)));
    color += vec3(circle(st12, 0.003, vec2(0.5,0.75)));
    
    //color
    if (u_animation) {
        color += vec3(0.3,0.9,1.0);
        color *= (1.0, 0.992, 0.956862745);
    } else {
        color += vec3(0.3,0.9,1.0) * clamp(mouseFactor, 0.5, 1.0);
        color *= (1.0, 0.992, 0.956862745) * clamp(mouseFactor, 0.5, 1.0);
    }
    gl_FragColor = vec4(color,1.0);
}
