#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

mat2 rotate2d(in float _angle){
    return mat2(cos(_angle),-sin(_angle),
               sin(_angle),cos(_angle));
}

mat2 scale2d(in float _scale){
    
    _scale = 1.0/_scale;
    return mat2(_scale,0,
               0,_scale);
}
mat2 scale2d(in vec2 _scale){
    _scale = 1.0/_scale;
    return mat2(_scale.x,0,
               0,_scale.y);
}

vec2 scale2d(in vec2 _center,in vec2 _st,in float _scale){
    _st -= _center;
    _st = scale2d(_scale) * _st;
    _st += _center;
    return _st;
}

vec2 scale2d(in vec2 _center,in vec2 _st,in vec2 _scale){
    _st -= _center;
    _st = scale2d(_scale) * _st;
    _st += _center;
    return _st;
}

vec2 scale2d(in vec2 _st,in float _scale){
    return scale2d(vec2(.5),_st,_scale);
}

vec2 rotate2d(in vec2 _center,in vec2 _st,in float _angle){
    _st -= _center;
    _st = rotate2d(_angle) * _st;
    _st += _center;
    return _st;
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - 0.5 * _size;
    vec2 uv = vec2(.0);
    
    uv = smoothstep(_size,_size+0.001,_st);
    uv *= smoothstep(_size,_size+0.001,vec2(1.0)-_st);
    
    return uv.x * uv.y;
}

float random(in float f){
    return fract(sin(f) * 100000.);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float hash(vec2 p) {vec3 p3 = fract(vec3(p.xyx) * 0.13); p3 += dot(p3, p3.yzx + 3.333); return fract((p3.x + p3.y) * p3.z); }

float hash(float p) { p = fract(p * 0.011); p *= p + 7.5; p *= p + p; return fract(p); }

float noise(in float x){
    float i = floor(x);
    float f = fract(x);
    
    float y = 0.;
    y = mix(hash(i),hash(i+1.0),smoothstep(0.,1.,f));
    //y = mix(random(i),random(i+1.0),f);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i),hash(i+1.0),u);
   // return y;
}

float noise(in vec2 st){
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = hash(i);
    float b = hash(i + vec2(1.,0.));
    float c = hash(i + vec2(0.,1.));
    float d = hash(i + vec2(1.,1.)) ;
    
    vec2 u = f*f*(3.-2.*f);
    
    //return mix( mix(a,b,u.x),mix(c,d,u.x),u.y );
    return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x)+(d-b)*u.y * u.x; 
}



// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float gradient_noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    //vec2 u = f*f*(3.0-2.0*f);
    vec2 u = smoothstep(0.,1.,f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float line(in  float y,in float n){
    y = y * n;
    y = fract(y);
    
    return step(0.5,y);
}
float circle(in vec2 toCenter, in float radius,in float size){
    float l = length(toCenter);
    float r = radius;
	return  smoothstep(r-size,r,l)-smoothstep(r,r+size,l);
}

float plot(in vec2 y)

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color= vec3(0.);
    
    float y = st.x;
    float size = .01;
    float c = smoothstep(y-size,y,st.y) - smoothstep(y,y+size,st.y);

    color += c;

    gl_FragColor = vec4(color,1.0);
}