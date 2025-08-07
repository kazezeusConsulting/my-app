// src/components/outputs/ProjectionTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Projection } from "@/types/formTypes";

type ProjectionTableProps = {
  data: Projection[];
};

export default function ProjectionTable({ data }: ProjectionTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Revenue (₹)</TableHead>
            <TableHead>Cost of Sales (₹)</TableHead>
            <TableHead>Depreciation (₹)</TableHead>
            <TableHead>Net Profit (₹)</TableHead>
            <TableHead>Profit Margin (%)</TableHead>
            <TableHead>Working Capital (₹)</TableHead>
            <TableHead>DSCR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.year}>
              <TableCell>{row.year}</TableCell>
              <TableCell>₹{row.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>₹{row.costOfSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>₹{row.depreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>₹{row.netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>{(row.profitMargin * 100).toFixed(2)}%</TableCell>
              <TableCell>₹{row.workingCapital.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>{row.dscr.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
