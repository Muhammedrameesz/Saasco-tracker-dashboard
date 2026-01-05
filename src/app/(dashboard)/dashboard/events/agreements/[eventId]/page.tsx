"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  ChevronsUpDown,
  Check,
  Save,
  X,
  PencilLine,
  PencilLineIcon,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useEventStore } from "@/store/useEventStore";
import Loading from "@/components/loading/loading";
import axios from "axios";
import { baseUrl } from "@/api/const";
import Link from "next/link";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

import dynamic from "next/dynamic";
import PageTitle from "@/components/pageTitle/pageTitle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DownloadAgreementBtn = dynamic(
  () => import("@/components/pdf/DownloadAgreementBtn"),
  { ssr: false, loading: () => null }
);

const DownloadAgreementBtn2 = dynamic(
  () => import("@/components/pdf/DownloadAgreementBtn2"),
  { ssr: false, loading: () => null }
);

/* ================= TYPES ================= */

type AgreementFormValues = {
  carNumber: string;
  items: {
    qty: number;
    item: string;
  }[];
  remarks: {
    deliveryDate?: Date;
    receiveDate?: Date;
    transport: string;
    operator: string;
    totalPerDay: number;
    advance: number;
    note?: string;
  };
  totalAmount?: number;
};

interface Product {
  _id: string;
  name: string;
}

/* ================= PAGE ================= */

export default function HiringAgreementPage() {
  const params = useParams();
  const eventId = typeof params.eventId === "string" ? params.eventId : "";

  const {
    getEventsById,
    selectedEvent,
    loading,
    error,
    deleteHiringAgreement,
    delLoading,
  } = useEventStore();

  const [loadings, setLoading] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/products/get-products`);
      setProducts(res.data || []);
    } catch (err) {
      console.log("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ================= FORM ================= */

  const toDate = (value?: string | Date) =>
    value ? new Date(value) : undefined;

  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<AgreementFormValues>({
    defaultValues: {
      carNumber: "",
      items: [{ qty: 1, item: "" }],
      remarks: {
        deliveryDate: undefined,
        receiveDate: undefined,
        transport: "",
        operator: "",
        totalPerDay: 0,
        advance: 0,
        note: "",
      },
    },
  });

  useEffect(() => {
    if (!selectedEvent) return;

    const agreement = selectedEvent.hiringAgreement?.[0];

    reset({
      carNumber: agreement?.carNumber ?? "",
      items: agreement?.items?.length
        ? agreement.items
        : [{ qty: 1, item: "" }],
      remarks: {
        deliveryDate: agreement?.remarks?.deliveryDate
          ? new Date(agreement.remarks.deliveryDate)
          : selectedEvent.date
          ? new Date(selectedEvent.date)
          : undefined,

        receiveDate: agreement?.remarks?.receiveDate
          ? new Date(agreement.remarks.receiveDate)
          : selectedEvent.endDate
          ? new Date(selectedEvent.endDate)
          : undefined,

        transport: agreement?.remarks?.transport ?? "",
        operator: agreement?.remarks?.operator ?? "",
        totalPerDay: agreement?.remarks?.totalPerDay ?? 0,
        advance: agreement?.remarks?.advance ?? 0,
        note: agreement?.remarks?.note ?? "",
      },
    });
  }, [eventId, selectedEvent, reset]);

  const calculateDays = (start?: Date, end?: Date): number => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    return diff >= 0 ? diff + 1 : 0; // inclusive days
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [isEditingTotal, setIsEditingTotal] = React.useState(false);

  const deliveryDate = watch("remarks.deliveryDate", undefined);
  const receiveDate = watch("remarks.receiveDate", undefined);

  const totalPerDay = Number(watch("remarks.totalPerDay")) || 0;
  const advance = Number(watch("remarks.advance")) || 0;

  const manualTotalAmount = Number(watch("totalAmount")) || 0;

  const totalDays = calculateDays(deliveryDate, receiveDate);

  const autoTotalAmount =
    totalDays > 0 && totalPerDay > 0 ? totalPerDay * totalDays : 0;

  const totalAmount =
    totalPerDay > 0
      ? autoTotalAmount
      : manualTotalAmount > 0
      ? manualTotalAmount
      : selectedEvent?.hiringAgreement?.[0]?.totalAmount ?? 0;

  const balance = Math.max(totalAmount - advance, 0);

  /* ================= FETCH EVENT ================= */

  useEffect(() => {
    if (!eventId) return;
    getEventsById(eventId);
  }, [eventId, getEventsById]);

  /* ================= AUTO-FILL FROM STORE ================= */

  useEffect(() => {
    if (!selectedEvent) return;
  }, [selectedEvent, reset]);

  const haSequence = selectedEvent?.hiringAgreement?.[0]?.haSequence;

  const [haValue, setHaValue] = useState("");
  const [isEditingHA, setIsEditingHA] = useState(true);

  useEffect(() => {
    if (haSequence !== undefined && haSequence !== null) {
      // Existing agreement
      setHaValue(String(haSequence));
      setIsEditingHA(false);
    } else {
      // New agreement
      setHaValue("");
      setIsEditingHA(true);
    }
  }, [eventId, haSequence]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: AgreementFormValues) => {
    if (totalDays <= 0) {
      toast.error("Please select valid delivery and receive dates");
      return;
    }

    if (data.remarks.advance > totalAmount) {
      toast.error("Advance cannot be greater than total amount");
      return;
    }

    const payload = {
      eventId,
      hiringAgreement: [
        {
          haSequence: haValue || "",
          carNumber: data.carNumber,
          items: data.items,
          remarks: {
            ...data.remarks,
          },
          totalDays,
          totalAmount,
          balance,
        },
      ],
    };

    try {
      await axios.post(`${baseUrl}/event/hiring-agreement`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Hiring agreement saved successfully ✅");

      // refresh values from backend (recommended)
      getEventsById(eventId);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save hiring agreement"
      );
    }
  };

  /* ================= UI ================= */

  if (!eventId) {
    return <div className="p-6 text-red-600">Invalid Event ID</div>;
  }

  if (loading) return <Loading />;
  if (error)
    return (
      <span
        className="
  flex items-center gap-2
  max-w-lg mx-auto
  rounded-lg border border-red-200
  bg-red-50 px-4 py-3
  text-sm md:text-base
  font-medium text-red-600
"
      >
        <AlertCircle className="h-5 w-5" />
        <span>Error fetching events: {error}</span>
      </span>
    );

  const handleDeleteHiringAgreement = async () => {
    if (!selectedEvent?._id) return;

    await deleteHiringAgreement(selectedEvent._id);
  };

  const displayedTotalAmount = totalAmount;
  // totalPerDay > 0
  //   ? autoTotalAmount
  //   : manualTotalAmount > 0
  //   ? manualTotalAmount
  //   : selectedEvent?.hiringAgreement?.[0]?.totalAmount ?? 0;

  return (
    <>
      <PageTitle
        title="Hiring Agreement"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Events", href: "/dashboard/events" },
          { title: "Hiring Agreement" },
        ]}
      ></PageTitle>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* ================= HEADER ================= */}
            <header className="relative bg-white border-b border-slate-200 px-6 py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Side: Title and Meta */}

                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
                    Hiring Agreement
                  </h1>

                  <div className="flex items-center gap-3">
                    <div
                      className="
      inline-flex items-center gap-2
      px-[14px] py-2
      rounded-[10px]
      border border-slate-200
      bg-gradient-to-br from-slate-50 to-slate-100
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      transition-all duration-200 ease-in-out
      hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
    "
                    >
                      {/* Label */}
                      <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-500">
                        HA Number
                      </span>

                      {/* Divider */}
                      <div className="w-px h-4 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                      {/* Input OR Value */}
                      {isEditingHA ? (
                        <input
                          value={haValue}
                          onChange={(e) => setHaValue(e.target.value)}
                          placeholder="Enter HA number"
                          className="
          bg-transparent outline-none
          text-[13px] font-mono font-bold text-slate-800
          tracking-[0.3px] w-[140px]
          border-b border-slate-300
          focus:border-slate-600
        "
                        />
                      ) : (
                        <code className="text-[13px] font-mono font-bold text-slate-800 tracking-[0.3px]">
                          {haValue}
                        </code>
                      )}

                      {/* Edit / Save */}
                      <button
                        type="button"
                        onClick={() => setIsEditingHA((p) => !p)}
                        className="ml-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title={
                          isEditingHA ? "Save HA number" : "Edit HA number"
                        }
                      >
                        {isEditingHA ? (
                          <Check size={18} />
                        ) : (
                          <PencilLine size={18} />
                        )}
                      </button>
                    </div>

                    <span className="h-5 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="inline-flex items-center gap-5">
                  {selectedEvent?.hiringAgreement &&
                    selectedEvent?.hiringAgreement?.length > 0 && (
                      <>
                        <DownloadAgreementBtn event={selectedEvent} />
                        <DownloadAgreementBtn2 event={selectedEvent} />
                      </>
                    )}
                </div>
              </div>

              {/* Subtle Decorative Accent */}
              <div className="absolute bottom-[-1px] left-6 w-24 h-0.5 bg-red-600"></div>
            </header>

            <div className="p-8 sm:p-10 space-y-10">
              {/* ================= EVENT INFO ================= */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Event Name
                  </Label>
                  <Input
                    value={selectedEvent?.eventName ?? ""}
                    disabled
                    className="bg-slate-50 border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Client Name
                  </Label>
                  <Input
                    value={selectedEvent?.clientName ?? ""}
                    disabled
                    className="bg-slate-50 border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Contact
                  </Label>
                  <Input
                    value={selectedEvent?.contactPersonNumber ?? ""}
                    disabled
                    className="bg-slate-50 border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Location
                  </Label>
                  <Input
                    value={selectedEvent?.destinationLocation?.address ?? ""}
                    disabled
                    className="bg-slate-50 border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Car Number
                  </Label>
                  <Input
                    className="bg-slate-50 border-slate-200 font-medium"
                    {...register("carNumber", {
                      required: "Car number is required",
                    })}
                  />
                </div>
              </section>

              <form
                key={eventId}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-10"
              >
                {/* ================= ITEMS ================= */}
                <section className="space-y-6 max-w-6xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Package className="w-5 h-5 text-slate-700" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Items
                    </h2>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                          <TableHead className="w-20 font-semibold text-slate-700">
                            S.No
                          </TableHead>
                          <TableHead className="w-28 font-semibold text-slate-700">
                            Qty
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Item Description
                          </TableHead>
                          <TableHead className="w-24 text-center font-semibold text-slate-700">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow
                            key={field.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="font-medium text-slate-600">
                              {index + 1}
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                                {...register(`items.${index}.qty`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </TableCell>

                            <TableCell className="">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between border-slate-200 text-slate-700 hover:bg-slate-50"
                                  >
                                    {watch(`items.${index}.item`) ||
                                      "Select product"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandInput placeholder="Search product..." />
                                    <CommandEmpty>
                                      No product found.
                                    </CommandEmpty>

                                    <CommandList>
                                      {products.map((product) => (
                                        <CommandItem
                                          key={product._id}
                                          value={product.name}
                                          onSelect={(value) => {
                                            setValue(
                                              `items.${index}.item`,
                                              value,
                                              {
                                                shouldValidate: true,
                                              }
                                            );
                                          }}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              watch(`items.${index}.item`) ===
                                              product.name
                                                ? "opacity-100"
                                                : "opacity-0"
                                            }`}
                                          />
                                          {product.name}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>

                            <TableCell className="text-center">
                              {fields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="group p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors cursor-pointer" />
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ qty: 1, item: "" })}
                    className="group flex items-center gap-2 px-5 py-2.5 
                           text-sm font-medium text-slate-600
                           bg-transparent border-2 border-dashed border-slate-300
                           hover:border-solid hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800
                           rounded-xl transition-all duration-200 cursor-pointer
                           active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-90 duration-200" />
                    Add Item
                  </button>
                </section>

                {/* Extra Note */}

                <div className="grid w-full gap-3">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Enter any additional notes here..."
                    className="min-h-[140px] resize-y"
                    {...register("remarks.note")}
                  />
                </div>

                {/* ================= REMARKS ================= */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Remarks & Details
                  </h2>

                  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Delivery Date */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Delivery Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                {watch("remarks.deliveryDate")
                                  ? format(
                                      watch("remarks.deliveryDate")!,
                                      "PPP"
                                    )
                                  : "Pick date"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Calendar
                              mode="single"
                              selected={watch("remarks.deliveryDate")}
                              onSelect={(d) =>
                                setValue("remarks.deliveryDate", d)
                              }
                              // disabled={(d) => d < today}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Receive Date */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Receive Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                {watch("remarks.receiveDate")
                                  ? format(watch("remarks.receiveDate")!, "PPP")
                                  : "Pick date"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Calendar
                              mode="single"
                              selected={watch("remarks.receiveDate")}
                              onSelect={(d) =>
                                setValue("remarks.receiveDate", d)
                              }
                              // disabled={(d) => d < today}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Transport
                        </Label>
                        <Input
                          placeholder="Transport details"
                          className="border-slate-200 focus:border-slate-400"
                          {...register("remarks.transport")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Operator
                        </Label>
                        <Input
                          placeholder="Operator name"
                          className="border-slate-200 focus:border-slate-400"
                          {...register("remarks.operator")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Total per Day
                        </Label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                            AED
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10 border-slate-200 focus:border-slate-400"
                            {...register("remarks.totalPerDay", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                          Advance
                        </Label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                            AED
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10 border-slate-200 focus:border-slate-400"
                            required
                            {...register("remarks.advance", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Total Days */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-5">
                        <p className="text-sm font-medium text-slate-500 mb-1">
                          Total Days
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                          {totalDays}
                        </p>
                      </div>

                      {/* Total Amount */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-5">
                        <p className="text-sm font-medium text-slate-500 mb-1">
                          Total Amount
                        </p>

                        {!isEditingTotal ? (
                          <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-slate-900">
                              <span className="text-base font-semibold mr-1">
                                AED
                              </span>
                              {displayedTotalAmount}
                            </p>

                            <button
                              type="button"
                              onClick={() => setIsEditingTotal(true)}
                              className="
    text-slate-400 hover:text-slate-600 cursor-pointer
    transition-colors
    p-1 rounded-md
    hover:bg-slate-200
  "
                              title="Edit total amount"
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-slate-600">
                              AED
                            </span>

                            <input
                              type="number"
                              min={0}
                              {...register("totalAmount", {
                                valueAsNumber: true,
                              })}
                              className="
          w-40 text-2xl font-bold
          bg-white border border-slate-300 rounded-lg
          px-3 py-1
          focus:outline-none focus:ring-2 focus:ring-slate-400
        "
                              autoFocus
                              onBlur={() => setIsEditingTotal(false)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-5">
                      <span className="text-sm font-medium text-slate-500">
                        Balance Amount
                      </span>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                          <span className="text-base font-semibold mr-1 text-slate-600">
                            AED
                          </span>
                          {balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <footer className="flex flex-wrap justify-end gap-4 pt-6 border-t border-slate-200">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 px-6 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Agreement
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Hiring Agreement?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The hiring agreement
                          will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteHiringAgreement}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Link
                    href="/dashboard/events"
                    className="flex items-center gap-2 px-6 border border-slate-300 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Link>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex cursor-pointer items-center gap-2 px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Agreement
                      </>
                    )}
                  </Button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
