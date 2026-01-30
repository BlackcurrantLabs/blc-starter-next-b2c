import type { ReactElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

type SendTemplateEmailInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
};

export async function sendTemplateEmail({
  to,
  subject,
  react,
  from,
}: SendTemplateEmailInput) {
  const html = await render(react);
  const text = await render(react, { plainText: true });

  return resend.emails.send({
    from: from ?? env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
}
