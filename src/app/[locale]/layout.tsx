import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PreferencesProvider } from "@/lib/preferences";
import { AuthProvider } from "@/lib/auth";
import { type Locale } from "@/i18n/config";
import type { ReactNode } from "react";

export default async function LocaleLayout({
  children,
  modal,
  params,
}: {
  children: ReactNode;
  modal: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <PreferencesProvider>
          <Navbar locale={locale as Locale} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          {modal}
        </PreferencesProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
