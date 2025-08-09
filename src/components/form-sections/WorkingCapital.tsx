// src/components/form-sections/WorkingCapital.tsx
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function WorkingCapital({ control }: { control: Control<FormValues> }) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">7️⃣ Working Capital</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="inventoryDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Days</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="debtorDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debtor Days</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="creditorDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Creditor Days</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="advanceFromCustomersPercent"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Advance from Customers %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
