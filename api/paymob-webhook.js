import crypto from 'crypto';

const SUPABASE_URL='https://llhmkyighydokneqwrdj.supabase.co';

function v(x){
 if(x===null||x===undefined) return '';
 if(typeof x==='boolean') return x?'true':'false';
 return String(x);
}
function callbackString(o){
 return [
  o.amount_cents,o.created_at,o.currency,o.error_occured,o.has_parent_transaction,
  o.id,o.integration_id,o.is_3d_secure,o.is_auth,o.is_capture,o.is_refunded,
  o.is_standalone_payment,o.is_voided,o.order?.id,o.owner,o.pending,
  o.source_data?.pan,o.source_data?.sub_type,o.source_data?.type,o.success
 ].map(v).join('');
}
function verifyHmac(obj,received,secret){
 if(!received||!secret) return false;
 const digest=crypto.createHmac('sha512',secret).update(callbackString(obj)).digest('hex');
 try{
  const a=Buffer.from(digest,'hex'),b=Buffer.from(String(received),'hex');
  return a.length===b.length&&crypto.timingSafeEqual(a,b);
 }catch{return false}
}
async function sb(path,{method='GET',body}={}){
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
 const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{
  method,
  headers:{'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json','Prefer':'return=representation'},
  body:body?JSON.stringify(body):undefined
 });
 const txt=await r.text(),data=txt?JSON.parse(txt):null;
 if(!r.ok) throw new Error(data?.message||'Supabase '+r.status);
 return data;
}
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
   const obj=req.body?.obj||req.body;
   if(!obj?.order?.id) return res.status(400).json({error:'Invalid callback'});
   const received=req.query?.hmac||req.headers['x-paymob-hmac'];
   if(!verifyHmac(obj,received,process.env.PAYMOB_HMAC_SECRET)) return res.status(401).json({error:'Invalid HMAC'});

   const orderId=String(obj.order.id);
   const rows=await sb('payments?provider_order_id=eq.'+encodeURIComponent(orderId)+'&select=id,subscription_id,status,amount_egp');
   const p=rows?.[0];
   if(!p) return res.status(404).json({error:'Payment not found'});

   const paid=!!obj.success && !obj.pending && !obj.error_occured && !obj.is_refunded && !obj.is_voided;
   const status=paid?'paid':'failed';

   await sb('payments?id=eq.'+p.id,{method:'PATCH',body:{
     status,
     provider_transaction_id:String(obj.id||''),
     raw_callback:req.body,
     paid_at:paid?new Date().toISOString():null
   }});

   if(p.subscription_id){
     if(paid){
       const start=new Date(),end=new Date(start);end.setDate(end.getDate()+30);
       await sb('subscriptions?id=eq.'+p.subscription_id,{method:'PATCH',body:{
         status:'active',starts_at:start.toISOString(),ends_at:end.toISOString(),updated_at:new Date().toISOString()
       }});
     }else{
       await sb('subscriptions?id=eq.'+p.subscription_id,{method:'PATCH',body:{
         status:'failed',updated_at:new Date().toISOString()
       }});
     }
   }
   return res.status(200).json({received:true});
 }catch(e){
   return res.status(500).json({error:e?.message||'Webhook error'});
 }
}