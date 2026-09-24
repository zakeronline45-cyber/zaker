export default function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false});
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({
    serviceRoleConfigured:Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    openAiConfigured:Boolean(process.env.OPENAI_API_KEY)
  });
}
