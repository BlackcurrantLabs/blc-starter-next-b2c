"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AltchaWidget } from "@/components/contact/altcha-widget";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { submitContactMessage } from "./actions";
import { contactUsSchema } from "./validation";

type ContactUsFormValues = z.infer<typeof contactUsSchema>;

export function ContactUsForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactUsFormValues>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      altcha: "",
    },
  });

  const onSubmit = (values: ContactUsFormValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await submitContactMessage(values);
      if (result.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      setStatus("error");
      setErrorMessage(
        result.error === "captcha"
          ? "Captcha verification failed. Please try again."
          : "Something went wrong."
      );
    });
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Message received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you shortly.
        </p>
        <Button className="mt-4" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="How can we help?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about your request..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="altcha"
          render={() => (
            <FormItem>
              <FormLabel>Verification</FormLabel>
              <FormControl>
                <AltchaWidget
                  onVerifiedAction={(payload) =>
                    form.setValue("altcha", payload, { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {status === "error" && errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        <Button disabled={isPending} type="submit">
          {isPending ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
