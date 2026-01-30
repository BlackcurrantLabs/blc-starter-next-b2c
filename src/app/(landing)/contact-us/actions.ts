"use server";

import { headers } from "next/headers";
import { TableState } from "@tanstack/react-table";
import { createElement } from "react";

import prisma from "@/database/datasource";
import { Prisma } from "@/database/prisma/client";
import { verifyAltchaPayload } from "@/lib/altcha/verify";
import { sendTemplateEmail } from "@/lib/email";
import { ContactAcknowledgementEmail } from "@/emails/contact-acknowledgement-email";
import { env } from "@/lib/env";

import { contactUsSchema, type ContactUsInput } from "./validation";

export async function submitContactMessage(input: ContactUsInput) {
  const data = contactUsSchema.parse(input);
  const verification = verifyAltchaPayload(data.altcha);
  if (!verification.ok) {
    return { ok: false, error: "captcha" } as const;
  }

  const requestHeaders = await headers();
  const ipAddress = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = requestHeaders.get("user-agent") ?? undefined;
  const referrer = requestHeaders.get("referer") ?? undefined;

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ipAddress,
      userAgent,
      referrer,
    },
  });

  await sendTemplateEmail({
    to: data.email,
    subject: `We received your message - ${env.SITE_NAME}`,
    react: createElement(ContactAcknowledgementEmail, {
      appName: env.SITE_NAME,
      userName: data.name,
      subject: data.subject,
    }),
  });

  return { ok: true, id: contactMessage.id } as const;
}

export async function searchContactMessages(tableState: TableState) {
  const skip = tableState.pagination.pageIndex * tableState.pagination.pageSize;
  const take = tableState.pagination.pageSize;

  let where: Prisma.ContactMessageWhereInput = tableState.globalFilter
    ? {
        OR: [
          { email: { contains: String(tableState.globalFilter) } },
          { subject: { contains: String(tableState.globalFilter) } },
          { message: { contains: String(tableState.globalFilter) } },
          { name: { contains: String(tableState.globalFilter) } },
        ],
      }
    : {};

  tableState.columnFilters?.forEach((filter) => {
    const values = filter.value as unknown[];
    if (typeof values[0] === "boolean") {
      where = {
        ...where,
        [filter.id]: values[0],
      };
    }
  });

  let orderBy = {};
  tableState.sorting.forEach((sort) => {
    orderBy = {
      ...orderBy,
      [sort.id]: sort.desc ? "desc" : "asc",
    };
  });

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { messages, total };
}

export async function getContactMessage(id: string) {
  return prisma.contactMessage.findUnique({
    where: { id },
  });
}

export async function markContactMessageRead(id: string, isRead: boolean) {
  return prisma.contactMessage.update({
    where: { id },
    data: {
      isRead,
      readAt: isRead ? new Date() : null,
    },
  });
}
