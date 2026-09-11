import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email/sender';
import { getSiteSettings } from '@/lib/data/queries';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const siteSettings = await getSiteSettings();
    const activeConfig = { ...siteSettings, ...body };

    const targetEmail =
      activeConfig.notification_email ||
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      'ansarul.contact@gmail.com';

    const result = await sendLeadEmail(
      {
        name: 'Diagnostic Test',
        email: targetEmail,
        subject: 'Test Lead Notification',
        message: 'This is a test email sent from your Shopify Portfolio Admin Dashboard to verify email delivery.',
        project_type: 'System Test',
        budget_range: 'N/A',
      },
      activeConfig
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        method: result.method,
        message: `Test email sent successfully to ${targetEmail} via ${result.method?.toUpperCase()}! Check your inbox/spam folder.`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Email dispatch failed. Please check your SMTP or Resend credentials in Site Settings.',
          details: {
            targetEmail,
            hasResendKey: Boolean(activeConfig.resend_api_key && activeConfig.resend_api_key.startsWith('re_')),
            hasSmtpCreds: Boolean(activeConfig.smtp_user && activeConfig.smtp_pass),
          },
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
