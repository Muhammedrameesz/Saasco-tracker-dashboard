"use client";

import React from "react";
import WithProtectedRoute from "@/lib/withProtectedRoute";

function Dashboard() {

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-6 border-2 border-blue-700 rounded-xl text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-medium text-white mb-1">Past Events</h3>
          <h4 className="font-bold text-5xl text-white drop-shadow-sm">120</h4>
        </div>

        {/* Current Events - Slightly lighter blue gradient */}
        <div className="p-6 border-2 border-blue-600 rounded-xl text-center bg-gradient-to-br from-blue-800 to-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-medium text-white mb-1">
            Current Events
          </h3>
          <h4 className="font-bold text-5xl text-white drop-shadow-sm">54</h4>
        </div>

        {/* Future Events - Even lighter blue gradient */}
        <div className="p-6 border-2 border-blue-500 rounded-xl text-center bg-gradient-to-br from-blue-700 to-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-medium text-white mb-1">Future Events</h3>
          <h4 className="font-bold text-5xl text-white drop-shadow-sm">47</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* Past Events - Blue gradient */}
        <div className="p-6 border-2 border-blue-700 rounded-xl text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-medium text-white mb-1">
            Total Delivered
          </h3>
          <h4 className="font-bold text-5xl text-white drop-shadow-sm">240</h4>
        </div>
      </div>
    </div>
  );
}

export default WithProtectedRoute(Dashboard);
