import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function SalesRevenue({
  control,
}: {
  control: Control<FormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "products" });
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">
        5️⃣ Sales & Revenue Assumptions
      </h2>
      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left border">Product</th>
            <th className="p-2 text-right border">Unit Price</th>
            <th className="p-2 text-right border">Quantity</th>
            <th className="p-2 text-left border">Unit</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`products.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`products.${index}.unitPrice`}
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
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`products.${index}.quantity`}
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
              <td className="p-2 border">
                <FormField
                  control={control}
                  name={`products.${index}.unit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="p-2 border text-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        type="button"
        onClick={() => append({ name: "", unitPrice: 0, quantity: 0, unit: "" })}
        className="mb-4"
      >
        Add Product
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="annualGrowthRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Sales Growth %</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="priceInflation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Inflation %</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workingDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Days / Year</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Hours / Day</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
