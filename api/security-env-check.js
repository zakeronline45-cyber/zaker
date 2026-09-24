export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false});
  return res.status(200).json({
    serviceRoleConfigured:!!process.env.SUPABASE_SERVICE_ROLE_KEY,
    openAIConfigured:!!process.env.OPENAI_API_KEY
  });
}
