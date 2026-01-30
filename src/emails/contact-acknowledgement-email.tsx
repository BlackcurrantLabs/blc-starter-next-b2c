import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ContactAcknowledgementEmailProps = {
  appName: string;
  userName?: string;
  subject?: string;
};

export function ContactAcknowledgementEmail({
  appName,
  userName,
  subject,
}: ContactAcknowledgementEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your message</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={heading}>Thanks for reaching out</Text>
            <Text style={paragraph}>Hi{userName ? ` ${userName}` : ""},</Text>
            <Text style={paragraph}>
              We&apos;ve received your message and a member of our team will get
              back to you shortly.
            </Text>
            {subject ? (
              <Text style={paragraph}>
                Subject: <strong>{subject}</strong>
              </Text>
            ) : null}
            <Text style={paragraph}>— {appName} Support</Text>
          </Section>
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

const content = {
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  padding: "24px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  margin: "10px 0",
};
