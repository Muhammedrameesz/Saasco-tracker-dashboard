"use client";
import { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useRouter } from "next/navigation";
import { Eye, Plus } from "lucide-react";
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
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [fetchEvents, currentPage]);

  const handlePageChange = (page: number) => {
    if (page && page !== currentPage) fetchEvents(page);
  };

  if (loading) return <Spinner />;

  const filteredEvents = events.filter((event) => {
    const lowerSearch = search.toLowerCase();

    return (
      event.eventName.toLowerCase().includes(lowerSearch) ||
      event.status.toLowerCase().includes(lowerSearch) ||
      event.clientName.toLowerCase().includes(lowerSearch) ||
      event.dateStatus?.toLowerCase().includes(lowerSearch)
    );
  });

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
          <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full text-white shadow-md transform transition-transform hover:scale-110">
            <BsCalendar2EventFill className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Event Listings
          </h2>
        </div>

        <Link
          href="/dashboard/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-white via-orange-50 to-red-50 
             shadow-md hover:shadow-lg border border-orange-100 transition-all duration-300 group active:scale-95"
        >
          <Plus
            size={18}
            className="text-orange-500 group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 tracking-wide">
            Add Event
          </span>
        </Link>
      </section>

      {filteredEvents.length === 0 ? (
        <div>
          <NoSearchMatch />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border-b  border-gray-300 ">
            <table className="min-w-full table-auto divide-y divide-gray-200 overflow-auto">
              <thead className="bg-gradient-to-r from-orange-50 to-red-50 text-gray-800 sticky top-0 rounded-t-md">
                <tr>
                  {[
                    "#",
                    "Event",
                    "Client",
                    "Date Status",
                    "Date",
                    "Contact",
                    "Status",
                    "View",
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
                  {filteredEvents.map((event, idx) => (
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
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500">
                          <Image
                            src={event.image || "/placeholder.png"}
                            alt={event.eventName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
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
                              "bg-red-100 text-red-600":
                                event.dateStatus === "past",
                              "bg-yellow-100 text-yellow-700":
                                event.dateStatus === "current",
                              "bg-green-100 text-green-600":
                                event.dateStatus === "upcoming",
                            }
                          )}
                        >
                          {event.dateStatus
                            ? event.dateStatus.charAt(0).toUpperCase() +
                              event.dateStatus.slice(1)
                            : "Unknown"}
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
                              "bg-green-500": event.status === "active",
                              "bg-red-500": event.status === "cancelled",
                              "bg-blue-500": event.status === "ongoing",
                              "bg-yellow-500": event.status === "delayed",
                              "bg-purple-500": event.status === "delivered",
                              "bg-indigo-500": event.status === "shipped",
                            }
                          )}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-red-600 flex space-x-4 justify-center">
                        <Eye
                          size={18}
                          className="hover:text-blue-600 cursor-pointer"
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
