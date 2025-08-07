import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { CostItem } from "@/types/formTypes";
import type { FormValues } from "@/types/formTypes";

export default function FundingLoans({
  control,
}: {
  control: Control<FormValues>;
}) {
  const { setValue } = useFormContext<FormValues>();
  const costItems = useWatch({ control, name: "costItems" }) as CostItem[];
  const capPct = useWatch({ control, name: "capitalSubsidyPercent" });
  const capToggle = useWatch({ control, name: "capitalSubsidyToggle" });

  const totalCost =
    costItems?.reduce((sum: number, item: CostItem) => sum + Number(item.amount || 0), 0) || 0;
  const totalMargin =
    costItems?.reduce(
      (sum: number, item: CostItem) =>
        sum + Number(item.amount || 0) * (Number(item.marginPercent || 0) / 100),
      0
    ) || 0;
  const wcRequirement =
    costItems?.find((i: CostItem) => i.type === "Working Capital Requirement")?.amount || 0;

  setValue("ownerCapital", totalMargin);

  const subsidyAmount = capToggle
    ? (totalCost * Number(capPct || 0)) / 100
    : 0;

  setValue(
    "termLoanAmount",
    Math.max(totalCost - totalMargin - subsidyAmount, 0)
  );
  setValue("wcLoanAmount", wcRequirement);
  setValue("capitalSubsidyAmount", subsidyAmount);
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">4️⃣ Funding / Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="ownerCapital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Capital</FormLabel>
              <FormControl><Input type="number" readOnly {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="termLoanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Loan Amount</FormLabel>
              <FormControl><Input type="number" readOnly {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="termLoanInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Loan Interest %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="termLoanTenure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Loan Tenure (Years)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="termLoanMoratorium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moratorium (Months)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wcLoanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Capital Loan</FormLabel>
              <FormControl><Input type="number" readOnly {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wcLoanInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Capital Interest %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="capitalSubsidyToggle"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel>Capital Subsidy Applicable?</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="capitalSubsidyPercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital Subsidy %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="capitalSubsidyAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital Subsidy Amount</FormLabel>
              <FormControl><Input type="number" readOnly {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loanProcessingFeePercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Processing Fee %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
