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
          name="rawMaterialMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raw Material Cost (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wagesLabourMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wages & Labour (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="electricityMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Electricity / Overhead (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="otherOverheadsMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Overheads (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="outwardFreightMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outward Freight (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="inwardFreightMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inward Freight (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="adminExpensesMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrative Expenses (Monthly)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
