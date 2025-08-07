// src/components/form-sections/Depreciation.tsx
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function Depreciation({ control }: { control: Control<FormValues> }) {
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">8️⃣ Depreciation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WDV">W.D.V</SelectItem>
                    <SelectItem value="SLM">S.L.M</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="assetLife"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Life (Years)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="depreciationRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depreciation Rate %</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10,15,40].map((r) => (
                      <SelectItem key={r} value={String(r)}>{r}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
