import { useAutoConnect } from "@/components/AutoConnectProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";

export function WalletSelection() {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap gap-6 pt-6 pb-12 justify-between items-center">
          <div className="flex flex-col gap-4 items-center">
            <ShadcnWalletSelector />
          </div>
        </div>
        <label className="flex items-center gap-4 cursor-pointer">
          <Switch
            id="auto-connect-switch"
            checked={autoConnect}
            onCheckedChange={setAutoConnect}
          />
          <Label htmlFor="auto-connect-switch">
            Auto reconnect on page load
          </Label>
        </label>
      </CardContent>
    </Card>
  );
}
