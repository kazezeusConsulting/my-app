import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function CostOfProject({ control }: { control: Control<FormValues> }) {
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">3️⃣ Cost of Project</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="machineryEquipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machinery & Equipment</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="furnitureFixtures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Furniture / Fixtures</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="otherFixedAssets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Fixed Assets</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="preOpExpenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-operating Expenses</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workingCapitalRequirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Capital Requirement</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="marginPercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Margin %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contingencyPercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contingency %</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
