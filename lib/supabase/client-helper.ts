import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin, isAdmin } from '@/lib/supabase/admin'

export async function getUserClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase: user && isAdmin(user.email) ? supabaseAdmin : supabase, user }
}

export async function getAdminClient() {
  const supabase = await createClient()
  return supabase
}

export { supabaseAdmin, isAdmin }