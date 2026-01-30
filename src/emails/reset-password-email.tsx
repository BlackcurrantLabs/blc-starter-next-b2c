import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  appName: string;
  userName?: string | null;
  actionUrl: string;
};

export function ResetPasswordEmail({
  appName,
  userName,
  actionUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your {appName} password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Reset your password</Text>
          <Text style={paragraph}>Hi{userName ? ` ${userName}` : ""},</Text>
          <Text style={paragraph}>
            We received a request to reset your {appName} password. Use the
            button below to set a new password.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={actionUrl}>
              Reset password
            </Button>
          </Section>
          <Text style={paragraph}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            Having trouble? Copy and paste this URL into your browser: {actionUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "520px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  margin: "12px 0",
};

const buttonContainer = {
  margin: "20px 0",
};

const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
  marginTop: "16px",
};
