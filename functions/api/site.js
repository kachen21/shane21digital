import {json} from './_auth.js';
export async function onRequestGet({env}){
 if(!env.SITE_STORE)return json({error:'Missing SITE_STORE R2 binding'},503);
 const o=await env.SITE_STORE.get('site.json');
 if(!o)return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
 return new Response(o.body,{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
