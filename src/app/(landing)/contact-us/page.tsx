import { ContactUsForm } from "./contact-us-form";

export default function ContactUsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold">Contact us</h1>
        <p className="text-muted-foreground">
          Send us a message and we&apos;ll get back to you shortly.
        </p>
      </div>
      <ContactUsForm />
    </div>
  );
}
