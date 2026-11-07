import PinGate from "@/components/PinGate";
import Nav from "@/components/Nav";
import { KumsalSeridi } from "@/components/icons";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <PinGate>
      <Nav />
      <KumsalSeridi className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-16 w-full text-turkuaz" />
      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-4 pb-28">
        {children}
      </main>
    </PinGate>
  );
}
