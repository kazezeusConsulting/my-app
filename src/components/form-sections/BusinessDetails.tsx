import { Input, Textarea, Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Field } from "@/components/forms/Field";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function BusinessDetails({ control }: { control: Control<FormValues> }) {
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">1️⃣ Business Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field control={control} name="businessName" label="Business Name">
          {(field) => <Input {...field} />}
        </Field>

        <FormField
          control={control}
          name="constitutionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constitution Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select constitution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sole Proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Private Ltd">Private Ltd</SelectItem>
                    <SelectItem value="LLP">LLP</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Field control={control} name="ownerName" label="Owner Name">
          {(field) => <Input {...field} />}
        </Field>

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email / Phone</FormLabel>
              <FormControl><Input type="text" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address / City / State</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="industryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Type / Segment</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="schemeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheme Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PMEGP">PMEGP</SelectItem>
                    <SelectItem value="CGTMSE">CGTMSE</SelectItem>
                    <SelectItem value="MSME Scheme">MSME Scheme</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="employmentGenerated"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Generated</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Business Description</FormLabel>
              <FormControl><Textarea rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
