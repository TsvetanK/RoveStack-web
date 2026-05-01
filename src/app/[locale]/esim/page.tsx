import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EsimStoreClient, type Country, type Region } from "./EsimStoreClient";
import { REVALIDATE_COUNTRIES } from "@/lib/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface ApiList<T> {
  success: boolean;
  data: T[];
}

async function getCountries(): Promise<Country[]> {
  const res = await fetch(`${API_BASE}/esim`, {
    next: { revalidate: REVALIDATE_COUNTRIES, tags: ["countries"] },
  });
  if (!res.ok) return [];
  const json: ApiList<Country> = await res.json();
  return json.data;
}

async function getRegions(): Promise<Region[]> {
  const res = await fetch(`${API_BASE}/regions`, {
    next: { revalidate: REVALIDATE_COUNTRIES, tags: ["countries"] },
  });
  if (!res.ok) return [];
  const json: ApiList<Region> = await res.json();
  return json.data;
}

export const metadata: Metadata = {
  title: "eSIM Store — Browse Plans for 190+ Countries | RoveStack",
  description:
    "Buy a prepaid eSIM data plan for your next trip. Instant activation, no roaming fees. Coverage in 190+ countries across Europe, Asia, Americas and more.",
  openGraph: {
    title: "eSIM Store | RoveStack",
    description: "Prepaid eSIM plans for 190+ countries. Instant activation.",
  },
};

export default async function EsimStorePage() {
  const [countries, regions] = await Promise.all([
    getCountries(),
    getRegions(),
  ]);

  return (
    <div className="wrap inner-page">
      <PageHeader
        title={
          <>
            <em>eSIM</em> Store
          </>
        }
        subtitle="Browse all available plans across 190+ countries"
      />
      <Suspense>
        <EsimStoreClient
          initialCountries={countries}
          initialRegions={regions}
        />
      </Suspense>
    </div>
  );
}
