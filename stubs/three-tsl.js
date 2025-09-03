// Stub for optional TSL imports in three/globe.gl
export const Fn = (...args) => args[0];
export const If = (...args) => args[0];
export const uniform = (..._args) => 0;
export const float = (v) => Number(v);
export const int = (v) => (v|0);
export const vec3 = (x,y,z) => [x,y,z];
export const add = (a,b)=> (Array.isArray(a)? a.map((v,i)=>v+(b[i]??0)) : a+b);
export const sub = (a,b)=> (Array.isArray(a)? a.map((v,i)=>v-(b[i]??0)) : a-b);
export const mul = (a,b)=> (Array.isArray(a)? a.map((v,i)=>v*(b[i]??1)) : a*b);
export const div = (a,b)=> (Array.isArray(a)? a.map((v,i)=>v/(b[i]??1)) : a/b);
export default {};
