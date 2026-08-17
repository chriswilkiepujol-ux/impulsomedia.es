import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Initialize Resend inside the handler to avoid build-time errors
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }
    const resend = new Resend(apiKey)
    const body = await request.json()
    const { name, email, company, service, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Map service value to readable name
    const serviceNames: Record<string, string> = {
      web: 'Diseño Web / Web Design',
      social: 'Redes Sociales / Social Media',
      branding: 'Identidad Visual / Visual Identity',
      growth: 'Crecimiento Digital / Digital Growth',
      all: 'Paquete Completo / Complete Package',
    }

    const serviceName = service ? serviceNames[service] || service : 'No especificado'

    // Send email
    const result = await resend.emails.send({
      from: 'ImpulsoMedia <info@impulsomedia.es>',
      to: ['info@impulsomedia.es'],
      replyTo: email,
      subject: `Nuevo contacto de ${name} - ImpulsoMedia`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d4a853; margin-bottom: 24px;">Nuevo mensaje de contacto</h1>
          
          <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; color: #ffffff;">
            <p style="margin: 0 0 16px;"><strong style="color: #d4a853;">Nombre:</strong> ${name}</p>
            <p style="margin: 0 0 16px;"><strong style="color: #d4a853;">Email:</strong> <a href="mailto:${email}" style="color: #ffffff;">${email}</a></p>
            ${company ? `<p style="margin: 0 0 16px;"><strong style="color: #d4a853;">Empresa:</strong> ${company}</p>` : ''}
            <p style="margin: 0 0 16px;"><strong style="color: #d4a853;">Servicio:</strong> ${serviceName}</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;">
            <p style="margin: 0 0 8px;"><strong style="color: #d4a853;">Mensaje:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 24px; text-align: center;">
            Este mensaje fue enviado desde el formulario de contacto de impulsomedia.es
          </p>
        </div>
      `,
    })

    // Check if there's an error in the response
    if (result.error && result.error.message) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Email sent successfully
    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
