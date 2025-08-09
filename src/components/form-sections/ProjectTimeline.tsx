import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function ProjectTimeline({ control }: { control: Control<FormValues> }) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">2️⃣ Project Timeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="projectStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="projectionSpan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projection Span (Years)</FormLabel>
              <FormControl>
                <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                      <SelectItem key={year} value={String(year)}>{year} Year{year > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="emiFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMI Frequency</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
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
