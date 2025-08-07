// src/components/PdfExporter.tsx
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Captures the DOM element with id "report" and generates a PDF.
 */
export async function exportToPdf() {
  const report = document.getElementById("report");
  if (!report) return;

  // Render the report element to a canvas
  const canvas = await html2canvas(report, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  // Convert canvas to an image
  const imgData = canvas.toDataURL("image/png");

  // Create PDF and add the image
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Calculate dimensions to maintain aspect ratio
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 20; // top margin

  pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save("projection-report.pdf");
}
