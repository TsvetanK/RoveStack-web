import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlanSelector } from "@/components/ui/PlanSelector";
import { serverApi, REVALIDATE_PRODUCTS, CacheTags } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────
interface Country {
  id: number;
  name: string;
  iso_code: string;
  flag_emoji: string;
  region: string;
  slug: string;
  products_count: number;
  price_from: { amount: number; currency: string; formatted: string };
  seo?: { title: string; description: string };
}

interface Product {
  id: number;
  slug: string;
  title: string;
  price: { amount: number; currency: string; formatted: string };
  country: { id: number; name: string; iso_code: string; region: string; slug: string };
  details: {
    data_mb: number;
    data_gb: number | null;
    unlimited: boolean;
    duration_days: number;
    has_voice: boolean;
    has_sms: boolean;
    speed: string[];
  };
}

interface CountryPageResponse {
  country: Country;
  products: Product[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ── Data fetching ─────────────────────────────────────────────
async function getCountryPage(slug: string): Promise<CountryPageResponse | null> {
  try {
    const res = await serverApi.get<ApiResponse<CountryPageResponse>>(`/esim/${slug}`, {
      revalidate: REVALIDATE_PRODUCTS,
      tags: CacheTags.country(slug),
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ── Metadata ──────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ countrySlug: string }> }
): Promise<Metadata> {
  const { countrySlug } = await params;
  const data = await getCountryPage(countrySlug);
  if (!data) return {};

  const { country } = data;
  const title = country.seo?.title ?? `${country.flag_emoji} ${country.name} eSIM — Best Data Plans | RoveStack`;
  const description = country.seo?.description ?? `Buy a prepaid eSIM for ${country.name}. Instant activation, no roaming fees. ${country.products_count} plans available.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function CountryPage(
  { params }: { params: Promise<{ countrySlug: string }> }
) {
  const { countrySlug } = await params;
  const data = await getCountryPage(countrySlug);
  if (!data) notFound();

  const { country, products } = data;

  return (
    <div className="wrap inner-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/esim" className="breadcrumb-link">eSIM Store</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span>{country.flag_emoji} {country.name}</span>
      </nav>

      <PageHeader
        title={<><em>{country.name}</em> eSIM</>}
        subtitle={`${products.length} plans available — instant activation, no roaming fees`}
      />

      <PlanSelector
        countryName={country.name}
        countryFlag={country.flag_emoji}
        plans={products.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          dataGb: p.details.data_gb,
          unlimited: p.details.unlimited,
          durationDays: p.details.duration_days,
          price: p.price.formatted,
          speed: p.details.speed,
          hasVoice: p.details.has_voice,
          hasSms: p.details.has_sms,
        }))}
      />
    </div>
  );
}
