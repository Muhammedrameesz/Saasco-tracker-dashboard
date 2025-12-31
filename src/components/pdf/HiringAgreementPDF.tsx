"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

interface Props {
  event: any;
  agreement: any;
}

export default function HiringAgreementPDF({ event, agreement }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== Background Watermark Logo ===== */}
        <Image src="/magic-music-Icon.png" style={styles.backgroundLogo} />

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          {/* Company Branding */}
          <View style={styles.brandRow}>
            <Image src="/logo/magic-logo.jpg" style={styles.logo} />
          </View>

          <View style={styles.headerDivider} />

          {/* Document Title */}
          <Text style={styles.title}>HIRING AGREEMENT</Text>
          <Text style={styles.sub}>Event ID: {event._id}</Text>
        </View>

        {/* ================= BASIC DETAILS ================= */}
        <View style={styles.box}>
          <InfoRow label="Client Name" value={event.clientName} />
          <InfoRow label="Contact" value={event.contactPersonNumber} />

          <View style={styles.spacer} />

          <InfoRow
            label="Location"
            value={event.destinationLocation?.address}
          />
          <InfoRow label="Car Number" value={agreement.carNumber} />
        </View>

        {/* ================= ITEMS + REMARKS (2 COLUMN LAYOUT) ================= */}
        <Section title="Items">
          <View style={styles.itemsLayout}>
            {/* -------- LEFT: ITEMS TABLE -------- */}
            <View style={styles.itemsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, styles.colSno]}>S.No</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colItem]}>
                  Item Description
                </Text>
              </View>

              {agreement.items.map((item: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.td, styles.colSno]}>{index + 1}</Text>
                  <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
                  <Text style={[styles.td, styles.colItem]}>{item.item}</Text>
                </View>
              ))}
            </View>

            {/* -------- RIGHT: REMARKS BOX -------- */}
            {/* -------- RIGHT COLUMN -------- */}
            <View style={styles.rightColumn}>
              {agreement?.remarks?.note && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteTitle}>Note</Text>
                  <Text style={styles.noteText}>{agreement.remarks.note}</Text>
                </View>
              )}

              <View style={styles.remarksBox}>
                <Text style={styles.remarksTitle}>Remarks</Text>

                <RemarkRow
                  label="Delivery Date"
                  value={format(
                    new Date(agreement.remarks.deliveryDate),
                    "dd MMM yyyy"
                  )}
                />
                <RemarkRow
                  label="Receive Date"
                  value={format(
                    new Date(agreement.remarks.receiveDate),
                    "dd MMM yyyy"
                  )}
                />
                <RemarkRow
                  label="Transport"
                  value={agreement.remarks.transport}
                />
                <RemarkRow
                  label="Operator"
                  value={agreement.remarks.operator}
                />

                <View style={styles.remarkDivider} />

                <RemarkRow label="Total Days" value={agreement.totalDays} />
                <RemarkRow
                  label="Per Day"
                  value={`AED ${agreement.remarks.totalPerDay}`}
                />
                <RemarkRow
                  label="Advance"
                  value={`AED ${agreement.remarks.advance}`}
                />
                <RemarkRow
                  label="Total Amount"
                  value={`AED ${agreement.totalAmount}`}
                />

                <View style={styles.balanceBox}>
                  <Text style={styles.balanceLabel}>Balance</Text>
                  <Text style={styles.balanceValue}>
                    AED {agreement.balance}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Section>

        {/* ================= FOOTER ================= */}
        <View style={styles.footerWrapper}>
          {/* Red title bar */}
          <View style={styles.footerTitleBar}>
            <Text style={styles.footerTitleText}>
              Authorized dealers in all kinds of musical instruments, sales,
              services and audio & visual rentals
            </Text>
          </View>

          {/* Footer content */}
          <View style={styles.footerContent}>
            {/* LEFT COLUMN */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerText}>
                Telephone : +971-6-538 4340, +971 55 769 1134{" "}
              </Text>
              <Text style={styles.footerText}>Web : www.magicmusicuae.com</Text>
              <Text style={styles.footerText}>
                AI Wasit Street, Sharjah - UAE, Ajman
              </Text>
            </View>

            {/* RIGHT COLUMN */}
            <View style={[styles.footerColumn, styles.footerRight]}>
              <Text style={styles.footerText}>
                Email : hello@magicmusicuae.com
              </Text>
              <Text style={styles.footerText}>magicdubai@yahoo.com</Text>
              <Text style={styles.footerText}>
                Instagram : @officialmagicmusic
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ================= HELPERS ================= */

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value ?? "-"}</Text>
  </View>
);

const RemarkRow = ({ label, value }: any) => (
  <View style={styles.remarkRow}>
    <Text style={styles.remarkKey}>{label}</Text>
    <Text style={styles.remarkColon}>:</Text>
    <Text style={styles.remarkValue}>{value ?? "-"}</Text>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 11,
    color: "#0f172a",
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  sub: {
    marginTop: 4,
    fontSize: 10,
    color: "#475569",
  },

  section: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },

  box: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 4,
  },

  spacer: {
    height: 6,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  infoLabel: {
    width: "30%",
    color: "#64748b",
  },

  infoValue: {
    width: "70%",
    fontWeight: "bold",
  },

  /* ITEMS + REMARKS LAYOUT */
  itemsLayout: {
    flexDirection: "row",
    alignItems: "flex-end", // ⬅ remarks align to bottom
    gap: 12,
  },

  /* TABLE */
  itemsTable: {
    width: "62%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  th: {
    padding: 6,
    fontWeight: "bold",
  },

  td: {
    padding: 6,
  },

  colSno: {
    width: "15%",
    textAlign: "center",
  },

  colQty: {
    width: "20%",
    textAlign: "center",
  },

  colItem: {
    width: "65%",
  },

  /* REMARKS */
  remarksWrapper: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    backgroundColor: "#ffffff",
  },

  remarksTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

  remarkRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  remarkKey: {
    width: "45%",
    fontSize: 9,
    color: "#64748b",
  },

  remarkColon: {
    width: "5%",
    textAlign: "center",
  },

  remarkValue: {
    width: "50%",
    fontSize: 10,
    fontWeight: "bold",
  },

  remarkDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 6,
  },

  balanceBox: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    backgroundColor: "#eef2ff",
  },

  balanceLabel: {
    fontSize: 9,
    color: "#475569",
  },

  balanceValue: {
    fontSize: 14,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: "80%",
    height: 82,
  },
  headerDivider: {
    width: "90%",
    height: 1.5,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  backgroundLogo: {
    position: "absolute",
    top: "55%",
    left: "50%",
    width: 320,
    height: 320,
    opacity: 0.06,

    marginLeft: -160,
    marginTop: -160,
  },
  footerWrapper: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    alignItems: "center",
  },

  /* RED TITLE BAR */
  footerTitleBar: {
    width: "95%",
    backgroundColor: "#c82716",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
  },

  footerTitleText: {
    color: "#ffffff",
    fontSize: 9,
    textAlign: "center",
    fontWeight: "bold",
  },

  /* FOOTER CONTENT */
  footerContent: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerColumn: {
    width: "48%",
  },

  footerRight: {
    alignItems: "flex-end",
  },

  footerText: {
    fontSize: 9,
    color: "#0f172a",
    marginBottom: 3,
  },
  noteBox: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },

  noteTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0f172a",
  },

  noteText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.4,
  },

  rightColumn: {
    width: "36%",
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  remarksBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    backgroundColor: "#ffffff",
  },
});
