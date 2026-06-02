import { MyEsimsClient } from "@/components/orders/MyEsimsClient";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MyEsimsPage() {
  return (
    <div className="wrap inner-page">
      <PageHeader
        title={<>My <em>eSIMs</em></>}
        subtitle="View and manage any eSIMs you've purchased."
      />
      <MyEsimsClient />
    </div>
  );
}
