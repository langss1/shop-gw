import SmoothScroll from "@/components/SmoothScroll";
import Storefront from "@/components/Storefront";
import Footer from "@/components/Footer";
import { getActiveBanners, getPublishedApps } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [apps, banners] = await Promise.all([getPublishedApps(), getActiveBanners()]);

  return (
    <SmoothScroll>
      <main className="min-h-screen flex flex-col bg-white selection:bg-blue-100 selection:text-blue-900 w-full relative">
        <Storefront apps={apps} banners={banners} />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
