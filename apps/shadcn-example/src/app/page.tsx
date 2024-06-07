import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectionButton } from "@/components/wallet-connection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>
      <div className="flex justify-center pt-[20vh]">
        <WalletConnectionButton />
      </div>
    </main>
  );
}
