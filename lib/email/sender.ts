import nodemailer from 'nodemailer';

export interface LeadEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  project_type?: string | null;
  budget_range?: string | null;
}

export interface DynamicEmailConfig {
  notification_email?: string;
  email_sender_name?: string;
  email_subject_template?: string;
  email_header_title?: string;
  email_template_style?: 'modern' | 'minimal' | 'executive';
  email_accent_color?: string;
  resend_api_key?: string;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_host?: string;
  smtp_port?: number | string;
}

export function generateLeadEmailHtml(data: LeadEmailData, config?: DynamicEmailConfig): string {
  const { name, email, subject, message, project_type, budget_range } = data;
  const nowStr = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const headerTitle = config?.email_header_title || '⚡ New Client Inquiry • AnisShopify';
  const accentColor = config?.email_accent_color || '#FF2A51';
  const style = config?.email_template_style || 'modern';

  const headerBg = style === 'executive' ? '#030712' : style === 'minimal' ? '#ffffff' : '#0f172a';
  const headerTextColor = style === 'minimal' ? '#0f172a' : '#ffffff';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          <!-- Top Accent Bar -->
          <tr>
            <td height="6" style="background: linear-gradient(90deg, ${accentColor} 0%, #E11D48 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; background-color: ${headerBg}; color: ${headerTextColor}; border-bottom: ${style === 'minimal' ? '1px solid #e2e8f0' : 'none'};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: ${accentColor}; margin-bottom: 6px;">
                      ${headerTitle}
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: ${headerTextColor}; line-height: 1.3;">
                      ${subject}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Key Details Grid -->
          <tr>
            <td style="padding: 24px 32px 16px 32px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" style="padding-bottom: 12px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">From Name</div>
                    <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  </td>
                  <td width="50%" style="padding-bottom: 12px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Sender Email</div>
                    <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                      <a href="mailto:${email}" style="color: ${accentColor}; text-decoration: none;">${email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-bottom: 12px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Project Type</div>
                    <div style="font-size: 14px; font-weight: 700; color: #334155; margin-top: 2px;">
                      <span style="display: inline-block; background-color: #e2e8f0; padding: 2px 8px; border-radius: 6px; font-size: 12px;">
                        ${project_type || 'General Shopify Project'}
                      </span>
                    </div>
                  </td>
                  <td width="50%" style="padding-bottom: 12px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Estimated Budget</div>
                    <div style="font-size: 14px; font-weight: 800; color: #059669; margin-top: 2px;">
                      ${budget_range || 'Not specified'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 4px; font-size: 12px; color: #94a3b8;">
                    Received: ${nowStr}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 32px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin-bottom: 10px;">
                Client's Message:
              </div>
              <div style="background-color: #f8fafc; border-left: 4px solid ${accentColor}; padding: 18px 20px; border-radius: 8px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; word-break: break-word;">
${message}
              </div>

              <!-- Action Button -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="mailto:${email}?subject=${encodeURIComponent('Re: ' + subject)}" style="display: inline-block; background-color: ${accentColor}; color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(255, 42, 81, 0.3);">
                  ✉ Reply directly to ${name}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              This notification was generated by the contact form at <a href="https://anisshopify.com" style="color: #64748b;">AnisShopify Portfolio</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Fast, non-blocking email dispatcher.
 * Attempts Resend API first if configured, then Nodemailer SMTP if configured.
 */
export async function sendLeadEmail(
  data: LeadEmailData,
  config?: DynamicEmailConfig
): Promise<{ success: boolean; method?: string; error?: any }> {
  const recipient =
    config?.notification_email ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    'ansarul.contact@gmail.com';

  const senderName = config?.email_sender_name || 'AnisShopify Contact';
  const rawSubjectTemplate =
    config?.email_subject_template || '⚡ New Lead: {subject} ({name})';

  const emailSubject = rawSubjectTemplate
    .replace(/{name}/g, data.name || '')
    .replace(/{email}/g, data.email || '')
    .replace(/{subject}/g, data.subject || '')
    .replace(/{project_type}/g, data.project_type || 'General')
    .replace(/{budget}/g, data.budget_range || 'N/A');

  const resendApiKey = config?.resend_api_key || process.env.RESEND_API_KEY;
  const smtpUser = config?.smtp_user || process.env.SMTP_USER;
  const smtpPass = config?.smtp_pass || process.env.SMTP_PASS;
  const smtpHost = config?.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(config?.smtp_port || process.env.SMTP_PORT) || 465;

  const emailHtml = generateLeadEmailHtml(data, config);

  let lastError: string | null = null;

  // Method 1: Resend API (Lightning fast REST API)
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${senderName} <onboarding@resend.dev>`,
          to: [recipient],
          reply_to: data.email,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        console.log('✅ Lead email sent via Resend to:', recipient);
        return { success: true, method: 'resend' };
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = `Resend Error (${res.status}): ${errJson.message || JSON.stringify(errJson)}`;
        console.warn(lastError);
      }
    } catch (err: any) {
      lastError = `Resend Fetch Exception: ${err.message}`;
      console.warn(lastError);
    }
  }

  // Method 2: Nodemailer SMTP (e.g. Gmail App Password or SMTP relay)
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        to: recipient,
        replyTo: data.email,
        subject: emailSubject,
        text: `New Lead: ${data.subject}\nFrom: ${data.name} <${data.email}>\nProject Type: ${data.project_type || 'N/A'}\nBudget: ${data.budget_range || 'N/A'}\n\nMessage:\n${data.message}`,
        html: emailHtml,
      });

      console.log('✅ Lead email sent via SMTP to:', recipient);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      lastError = `SMTP Error: ${err.message}`;
      console.warn(lastError);
    }
  }

  const noCredsMsg =
    lastError ||
    'Neither Resend API Key nor (SMTP User + Password) is configured in your Site Settings or environment variables.';
  console.log(`[Email Dispatch Log] Destination: ${recipient} | Status: ${noCredsMsg}`);
  return { success: false, method: 'none', error: noCredsMsg };
}
