import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { serverApi, REVALIDATE_PRODUCTS, CacheTags } from "@/lib/api";

interface Product {
  id: number;
  slug: string;
  title: string;
  price: { formatted: string };
  country: {
    id: number;
    name: string;
    iso_code: string;
    flag_emoji?: string;
    region: string;
    slug: string;
  };
  details: {
    data_gb: number | null;
    unlimited: boolean;
    duration_days: number;
    has_voice: boolean;
    has_sms: boolean;
    speed: string[];
  };
}

interface Country {
  name: string;
  iso_code: string;
  flag_emoji: string;
  region: string;
  slug: string;
}

interface CountryPageResponse {
  country: Country;
  products: Product[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0)))
    .join("");
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ countrySlug: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { countrySlug } = await params;
  const { plan: planSlug } = await searchParams;

  if (!planSlug) notFound();

  const res = await serverApi
    .get<ApiResponse<CountryPageResponse>>(`/esim/${countrySlug}`, {
      revalidate: REVALIDATE_PRODUCTS,
      tags: CacheTags.country(countrySlug),
    })
    .catch(() => null);

  if (!res) notFound();

  const { country, products } = res.data;
  const product = products.find((p) => p.slug === planSlug);
  if (!product) notFound();

  const flag = country.flag_emoji || isoToFlag(country.iso_code);

  return (
    <div className="wrap inner-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/esim" className="breadcrumb-link">
          eSIM Store
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">
          /
        </span>
        <Link href={`/esim/${country.slug}`} className="breadcrumb-link">
          {flag} {country.name}
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">
          /
        </span>
        <span>Checkout</span>
      </nav>

      <PageHeader
        title={
          <>
            Complete your <em>order</em>
          </>
        }
        subtitle={`${flag} ${country.name} eSIM — ${product.details.unlimited ? "Unlimited" : product.details.data_gb ? `${product.details.data_gb} GB` : "—"} · ${product.details.duration_days} days`}
      />

      <CheckoutClient
        country={{
          name: country.name,
          flag,
          slug: country.slug,
          region: country.region,
        }}
        plan={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price.formatted,
          dataGb: product.details.data_gb,
          unlimited: product.details.unlimited,
          durationDays: product.details.duration_days,
          speed: product.details.speed,
          hasVoice: product.details.has_voice,
          hasSms: product.details.has_sms,
        }}
      />
    </div>
  );
}
