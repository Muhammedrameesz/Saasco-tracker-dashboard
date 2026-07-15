"use client";
import { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, ImageOff, Plus, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import Spinner from "@/components/loading/Spinner";
import { BsCalendar2EventFill } from "react-icons/bs";
import Link from "next/link";
import SearchBar from "@/components/Events/SearchBar";
import NoSearchMatch from "@/components/ui/NoSearchMatchUI";
import Pagination from "./pagination";

export default function EventTable() {
  const router = useRouter();
  const { fetchEvents, events, currentPage, totalPage, loading } =
    useEventStore();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput.toLowerCase().trim());
    }, 1600);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  useEffect(() => {
    fetchEvents(1, search);
  }, [fetchEvents, search]);

  const handlePageChange = (page: number) => {
    if (page && page !== currentPage) fetchEvents(page, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Spinner />;

  const getStatusLabel = (status?: string | null) => {
    if (!status) return "Unknown";
    if (status === "current") return "Running";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      className="rounded-2xl bg-white  overflow-hidden mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}

      <SearchBar
        className="m-5"
        searchValue={searchInput}
        onChange={setSearchInput}
      />

      <section className="flex flex-col md:flex-row items-center md:items-center justify-between w-full gap-4 px-6 py-4 bg-white  rounded-lg mt-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-primary to-primary rounded-full text-white shadow-md transform transition-transform hover:scale-110">
            <BsCalendar2EventFill className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Event Listings
          </h2>
        </div>

        <Link
          href="/dashboard/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-white via-brand-50 to-brand-50 
             shadow-md hover:shadow-lg border border-brand-100 transition-all duration-300 group active:scale-95"
        >
          <Plus
            size={18}
            className="text-primary group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-sm font-semibold text-gray-800 group-hover:text-primary tracking-wide">
            Add Event
          </span>
        </Link>
      </section>

      {events.length === 0 ? (
        <div>
          <NoSearchMatch />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border-b  border-gray-300 ">
            <table className="min-w-full table-auto divide-y divide-gray-200 overflow-auto">
              <thead className="bg-gradient-to-r from-brand-50 to-brand-50 text-gray-800 sticky top-0 rounded-t-md">
                <tr>
                  {[
                    "#",
                    "Event",
                    "Client",
                    "Date Status",
                    "Date",
                    "Contact",
                    "Status",
                    "Agrements & Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-sm font-bold uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <AnimatePresence>
                  {events.map((event, idx) => (
                    <motion.tr
                      key={event._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={clsx(
                        "hover:bg-gray-50 transition-colors",
                        idx % 2 === 0 && "bg-gray-0"
                      )}
                    >
                      <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                      <td className="flex  items-center px-4 py-3 space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary flex items-center justify-center bg-brand-50">
                          {event.image ? (
                            <Image
                              src={event.image}
                              alt={event.eventName}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageOff className="text-primary w-5 h-5" />
                          )}
                        </div>

                        <span className="font-medium text-gray-800">
                          {event.eventName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {event.clientName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            " rounded-full px-3 py-1 text-xs font-semibold text-center  ",
                            {
                              "bg-destructive/10 text-destructive":
                                event.dateStatus === "past",
                              "bg-secondary text-secondary-foreground":
                                event.dateStatus === "current",
                              "bg-success/10 text-success":
                                event.dateStatus === "upcoming",
                            }
                          )}
                        >
                          {getStatusLabel(event.dateStatus)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {event.contactPersonNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            "px-3 py-1 text-xs font-semibold rounded-full text-white",
                            {
                              "bg-success": event.status === "active",
                              "bg-destructive": event.status === "cancelled",
                              "bg-info": event.status === "ongoing",
                              "bg-warning": event.status === "delayed",
                              "bg-purple-500": event.status === "delivered",
                              "bg-indigo-500": event.status === "shipped",
                            }
                          )}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary flex space-x-4 justify-center">
                        <Link
                          href={`/dashboard/events/agreements/${event._id}`}
                          className="inline-flex items-center gap-3"
                        >
                          <button
                            type="button"
                            className="
      inline-flex items-center cursor-pointer
      px-3 py-1.5
      text-xs font-semibold text-white
      rounded-xl
      bg-gradient-to-r from-slate-800 to-slate-600
      hover:from-slate-700 hover:to-slate-600
      shadow-sm hover:shadow-lg hover:shadow-slate-900/30
      transition-all duration-300
      active:scale-[0.97]
      focus:outline-none focus:ring-2 focus:ring-slate-400/40
    "
                          >
                            {event.hiringAgreement &&
                            Array.isArray(event.hiringAgreement) &&
                            event.hiringAgreement.length > 0 ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-rose-500" />
                            )}
                            <span className="ml-2">Hiring Agreement</span>
                          </button>
                        </Link>
                        <Eye
                          size={18}
                          className="hover:text-blue-600 cursor-pointer text-blue-500  mt-3"
                          onClick={() =>
                            router.push(`/dashboard/events/view/${event._id}`)
                          }
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPage ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Table */}
    </motion.div>
  );
}
