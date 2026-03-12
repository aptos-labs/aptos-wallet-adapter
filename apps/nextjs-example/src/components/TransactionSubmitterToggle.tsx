"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionSubmitter } from "@/components/TransactionSubmitterProvider";
import { Settings } from "lucide-react";

export function TransactionSubmitterToggle() {
  const { useCustomSubmitter, setUseCustomSubmitter } =
    useTransactionSubmitter();
  const { toast } = useToast();

  const handleToggle = () => {
    const newValue = !useCustomSubmitter;
    setUseCustomSubmitter(newValue);

    toast({
      title: newValue
        ? "Custom Transaction Submitter Enabled"
        : "Custom Transaction Submitter Disabled",
      description: newValue
        ? "Using custom transaction submitter. Transaction details will be logged to the console."
        : "Using default transaction submission.",
      duration: 3000,
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Settings
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          useCustomSubmitter
            ? "rotate-180 text-blue-600 dark:text-blue-400"
            : "rotate-0 text-muted-foreground"
        }`}
      />
      <span className="sr-only">Toggle custom transaction submitter</span>
    </Button>
  );
}
