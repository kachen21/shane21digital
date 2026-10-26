import {authorized,json,sameOrigin} from './_auth.js';
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return json({error:'Origin rejected'},403);
 if(!await authorized(request,env.SESSION_SECRET))return json({error:'Session หมดอายุ กรุณาปิดและเข้าสู่ Admin ใหม่'},401);
 if(!env.SITE_STORE)return json({error:'Missing SITE_STORE R2 binding'},503);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON required'},415);
 const raw=await request.text();
 if(raw.length>60_000_000)return json({error:'ข้อมูลมีขนาดใหญ่เกินไป'},413);
 let data;try{data=JSON.parse(raw)}catch{return json({error:'JSON ไม่ถูกต้อง'},400)}
 if(!data||typeof data!=='object'||!data.site||!Array.isArray(data.works))return json({error:'ข้อมูลเว็บไซต์ไม่ครบ'},400);
 // Remove legacy client-side password before storing public JSON.
 if(data.site&&typeof data.site==='object')delete data.site.pass;
 data.updatedAt=Date.now();
 await env.SITE_STORE.put('site.json',JSON.stringify(data),{httpMetadata:{contentType:'application/json'}});
 return json({ok:true,updatedAt:data.updatedAt});
}
