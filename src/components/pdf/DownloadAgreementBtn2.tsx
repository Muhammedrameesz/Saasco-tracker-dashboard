"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import HiringAgreementNoPricingPDF from "./HiringAgreementNoPricingPDF";
import { Download } from "lucide-react";

export default function DownloadAgreementBtn2({
  event,
}: {
  event: any;
}) {
  const agreement = event?.hiringAgreement?.[0];

  if (!agreement) return null;

  return (
    <PDFDownloadLink
      document={
        <HiringAgreementNoPricingPDF
          event={event}
          agreement={agreement}
        />
      }
      fileName={`Hiring-Agreement-${event.eventName}-No-Pricing.pdf`}
    >
      {({ loading }) => (
        <button
         className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer
                     bg-red-50 text-blue-950 rounded-lg hover:bg-red-100 border border-slate-400 hover:border-red-200  transform transition-colors "
        >
          <Download className="w-4 h-4" />
           {loading
            ? "Preparing Agreement..."
            : "Download Agreement (No Pricing)"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
