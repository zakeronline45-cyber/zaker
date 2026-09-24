import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './_config.js';

async function supabaseFetch(path,{token,method='GET',body}={}){
  const r=await fetch(SUPABASE_URL+path,{
    method,
    headers:{
      'apikey':SUPABASE_PUBLISHABLE_KEY,
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

export async function authorizeChildSubject(ctx,res,{childId,subjectCode,lessonNo=1}={}){
  if(!ctx?.token||!ctx?.user?.id||!childId||!subjectCode){
    res.status(400).json({error:'Student access data missing'});return false;
  }

  const own=await supabaseFetch('/rest/v1/children?id=eq.'+encodeURIComponent(childId)+'&guardian_user_id=eq.'+encodeURIComponent(ctx.user.id)+'&is_active=eq.true&select=id&limit=1',{token:ctx.token});
  let allowedOwner=own.ok&&Array.isArray(own.data)&&own.data.length>0;

  if(!allowedOwner){
    const ar=await supabaseFetch('/rest/v1/rpc/is_admin',{token:ctx.token,method:'POST',body:{}});
    allowedOwner=ar.ok&&ar.data===true;
  }
  if(!allowedOwner){res.status(403).json({error:'Student access denied'});return false}

  const access=await supabaseFetch('/rest/v1/rpc/has_subject_access',{
    token:ctx.token,method:'POST',
    body:{p_child_id:childId,p_subject_code:subjectCode,p_lesson_no:Number(lessonNo)||1}
  });
  if(!access.ok||access.data!==true){res.status(403).json({error:'Subscription required'});return false}
  return true;
}
