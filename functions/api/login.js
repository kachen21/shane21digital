import {mint,json,sameOrigin} from './_auth.js';
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return json({error:'Origin rejected'},403);
 if(!env.ADMIN_PASSWORD||!env.SESSION_SECRET)return json({error:'ยังไม่ได้ตั้งค่า ADMIN_PASSWORD และ SESSION_SECRET'},503);
 let body;try{body=await request.json()}catch{return json({error:'รูปแบบข้อมูลผิด'},400)}
 if(typeof body.password!=='string'||body.password!==env.ADMIN_PASSWORD)return json({error:'รหัสผ่านไม่ถูกต้อง'},401);
 return json({ok:true},200,{'Set-Cookie':`shane_session=${await mint(env.SESSION_SECRET)}; Path=/api; Max-Age=43200; HttpOnly; Secure; SameSite=Strict`});
}
