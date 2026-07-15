"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import HiringAgreementPDF from "./HiringAgreementPDF";
import { Download } from "lucide-react";

export default function DownloadAgreementBtn({
  event,
}: {
  event: any;
}) {
  const agreement = event?.hiringAgreement?.[0];

  if (!agreement) return null;

  return (
    <PDFDownloadLink
      document={
        <HiringAgreementPDF
          event={event}
          agreement={agreement}
        />
      }
      fileName={`Hiring-Agreement-${event.eventName}.pdf`}
    >
      {({ loading }) => (
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer
                     bg-primary/10 text-blue-950 rounded-lg hover:bg-primary/20 border border-slate-400 hover:border-primary/30  transform transition-colors "
        >
          <Download className="w-4 h-4" />
          {loading
            ? "Preparing Agreement..."
            : "Download Agreement"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
