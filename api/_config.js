export const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://llhmkyighydokneqwrdj.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_bGxbtk2yxjDaFACjEGrBWA_1MBC1i77';

export const PUBLIC_BASE_URL =
  (process.env.PUBLIC_BASE_URL || 'https://zaker-ruddy.vercel.app').replace(/\/$/, '');

export function requireProductionWrite(req, res) {
  const env = String(process.env.VERCEL_ENV || '').toLowerCase();
  const allowPreview = String(process.env.ALLOW_PREVIEW_WRITES || '').toLowerCase() === 'true';
  if (env && env !== 'production' && !allowPreview) {
    res.status(403).json({
      error: 'Write operations are disabled on preview deployments.'
    });
    return false;
  }
  return true;
}
