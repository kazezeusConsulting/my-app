// src/components/form-sections/ExpenseAssumptions.tsx
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function ExpenseAssumptions({ control }: { control: Control<FormValues> }) {
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">6️⃣ Expense Assumptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="rawMaterialCostPct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raw Material Cost %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wagesLabourPct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wages & Labour %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="electricityOverheadPct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Electricity / Overhead %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sellingAdminPct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling / Admin %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fixedMonthlyCosts"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Fixed Monthly Costs (e.g., Rent)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
