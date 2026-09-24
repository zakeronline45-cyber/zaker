const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';
const SUPABASE_KEY='sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';

async function supabaseFetch(path,{token,method='GET',body}={}){
  const r=await fetch(SUPABASE_URL+path,{
    method,
    headers:{
      'apikey':SUPABASE_KEY,
      ...(token?{'Authorization':'Bearer '+token}:{}),
      ...(body!==undefined?{'Content-Type':'application/json'}:{})
    },
    ...(body!==undefined?{body:JSON.stringify(body)}:{})
  });
  const text=await r.text();
  let data=null;
  try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:r.ok,status:r.status,data};
}

export async function requireUser(req,res,{bucket='',limit=0,windowSeconds=60}={}){
  const auth=req.headers.authorization||'';
  const token=auth.startsWith('Bearer ')?auth.slice(7).trim():'';
  if(!token){res.status(401).json({error:'Unauthorized'});return null}

  const ur=await supabaseFetch('/auth/v1/user',{token});
  if(!ur.ok||!ur.data?.id){res.status(401).json({error:'Invalid session'});return null}

  if(bucket&&limit>0){
    const qr=await supabaseFetch('/rest/v1/rpc/consume_api_quota',{
      token,method:'POST',body:{p_bucket:bucket,p_limit:limit,p_window_seconds:windowSeconds}
    });
    if(!qr.ok){
      const msg=String(qr.data?.message||qr.data?.error||'Rate limit failed');
      if(/rate limit exceeded/i.test(msg)){res.status(429).json({error:'Too many requests. Try again shortly.'});return null}
      res.status(503).json({error:'Security check unavailable'});return null
    }
  }
  return {user:ur.data,token};
}

export async function requireAdmin(req,res,opts={}){
  const ctx=await requireUser(req,res,opts);
  if(!ctx)return null;
  const ar=await supabaseFetch('/rest/v1/rpc/is_admin',{token:ctx.token,method:'POST',body:{}});
  if(!ar.ok||ar.data!==true){res.status(403).json({error:'Admin access required'});return null}
  return ctx;
}
