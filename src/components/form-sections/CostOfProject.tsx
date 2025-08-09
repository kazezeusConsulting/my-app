import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

const typeOptions = [
  "Machinery & Equipment",
  "Furniture / Fixtures",
  "Other Fixed Assets",
  "Pre-operating Expenses",
  "Working Capital Requirement",
];

export default function CostOfProject({ control }: { control: Control<FormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: "costItems" });

  return (
    <section className="rounded-lg border border-slate-300 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">3️⃣ Cost of Project</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left border">Type</th>
            <th className="p-2 text-right border">Margin %</th>
            <th className="p-2 text-right border">Dep %</th>
            <th className="p-2 text-right border">Amount</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`costItems.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`costItems.${index}.marginPercent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.01" className="text-right" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`costItems.${index}.depreciationRate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.01" className="text-right" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`costItems.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="text-right" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border text-center">
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        type="button"
        className="mt-4"
        onClick={() => append({ type: "", marginPercent: 0, depreciationRate: 0, amount: 0 })}
      >
        Add Row
      </Button>
    </section>
  );
}
