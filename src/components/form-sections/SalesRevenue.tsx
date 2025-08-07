// src/components/form-sections/SalesRevenue.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { FormValues } from "@/types/formTypes";

export default function SalesRevenue({
  control,
}: {
  control: Control<FormValues>;
}) {
  return (
    <section className="border border-slate-200 rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">
        5️⃣ Sales & Revenue Assumptions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="baseYearSales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Year Sales</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="avgSellingPriceYear1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avg. Selling Price (Year 1)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="unitsSoldYear1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Units Sold in Year 1</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
          name="capacityUtilization"
          render={({ field }) => {
            // ensure we never map on undefined
            const values: number[] = Array.isArray(field.value)
              ? field.value
              : [];
            return (
              <FormItem className="md:col-span-2">
                <FormLabel>Capacity Utilization (% per Year)</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    {values.map((val, idx) => (
                      <Input
                        key={idx}
                        type="number"
                        value={val}
                        onChange={(e) => {
                          // copy and update
                          const newArr = [...values];
                          newArr[idx] = Number(e.target.value);
                          field.onChange(newArr);
                        }}
                        className="w-16"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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
