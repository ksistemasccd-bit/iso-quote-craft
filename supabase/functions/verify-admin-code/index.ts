import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code } = await req.json()
    
    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Código requerido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const adminCode = Deno.env.get('ADMIN_SECRET_CODE')
    
    if (!adminCode) {
      console.error('ADMIN_SECRET_CODE not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'Error de configuración' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const isValid = code === adminCode

    return new Response(
      JSON.stringify({ 
        success: isValid, 
        message: isValid ? 'Acceso concedido' : 'Código incorrecto. Contacte con el administrador.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Error del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
