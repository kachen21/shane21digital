const enc=new TextEncoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function sign(payload,secret){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(await crypto.subtle.sign('HMAC',key,enc.encode(payload)))}
export async function mint(secret){const p=String(Date.now()+12*60*60*1000);return p+'.'+await sign(p,secret)}
export async function authorized(req,secret){if(!secret)return false;const m=(req.headers.get('Cookie')||'').match(/(?:^|;\s*)shane_session=([^;]+)/);if(!m)return false;const [p,s]=m[1].split('.');if(!p||!s||!/^\d+$/.test(p)||Number(p)<Date.now())return false;return s===await sign(p,secret)}
export function json(value,status=200,extra={}){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}})}
export function sameOrigin(req){try{const u=new URL(req.url),origin=req.headers.get('Origin');return !!origin&&origin===u.origin}catch{return false}}
