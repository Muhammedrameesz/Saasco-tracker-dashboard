"use client";

import React from "react";
import { ShieldAlert, Home, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="min-h-screen w-full font-Lexend flex items-center justify-center bg-[#fafafa] selection:bg-red-50 antialiased">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-red-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-slate-200/50 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="flex flex-col items-center">
          {/* Minimalist Icon Stack */}
          <div className="relative mb-12 group">
            {/* Outer Glow - Brand Red */}
            <div className="absolute inset-0 bg-red-500/15 rounded-[2.5rem] blur-2xl group-hover:bg-red-500/25 transition-all duration-700 scale-90 group-hover:scale-110" />

            {/* Main Container */}
            <div className="relative bg-white border border-slate-200/80 p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="bg-slate-50/50 rounded-[2.2rem] p-8 relative overflow-hidden">
                {/* Animated Scanning Line */}
                <div className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-red-500/5 to-transparent -translate-y-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />

                <div className="relative flex items-center justify-center">
                  {/* The "Shield" Layer */}
                  <ShieldAlert
                    className="absolute w-20 h-20 text-red-50/80 -rotate-12 transition-transform duration-500 group-hover:rotate-0"
                    strokeWidth={1}
                  />

                  {/* The Focus Lock */}
                  <div className="relative z-10 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 transition-transform duration-500 group-hover:scale-110">
                    <Lock
                      className="w-10 h-10 text-red-600"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Orbiting Security Ring */}
                  <svg
                    className="absolute w-28 h-28 animate-[spin_8s_linear_infinite]"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-200"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-800 tracking-tighter uppercase">
              Encrypted
            </div>
          </div>

          {/* Add this to your globals.css or tailwind config for the scan effect */}
          <style jsx>{`
            @keyframes scan {
              0% {
                transform: translateY(-100%);
              }
              50% {
                transform: translateY(200%);
              }
              100% {
                transform: translateY(-100%);
              }
            }
          `}</style>

          {/* Typography Section */}
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] font-bold tracking-widest uppercase text-red-600 mb-2">
              <Lock className="w-3 h-3" />
              Security Block
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
              Access Restricted
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-[320px] mx-auto">
              You don&apos;t have the necessary permissions to view this
              resource.
            </p>
          </div>

          {/* Glass Card Details */}
          <div className="w-full bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/50">
            <div className="flex items-start gap-4">
              <div className="h-10 w-1 bg-red-500 rounded-full mt-1" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Privilege Elevation Required
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  This area is reserved for{" "}
                  <span className="text-red-600 font-medium italic">
                    Super Administrators
                  </span>
                  . If you believe this is an error, please contact your systems
                  lead.
                </p>
              </div>
            </div>
          </div>

          {/* Refined Actions */}
          <div className="flex flex-col w-full gap-3">
            <Link
              href="/dashboard"
              className="group relative flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 active:scale-[0.98]"
            >
              <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              Return to Dashboard
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full bg-transparent text-slate-500 py-3 px-6 rounded-2xl font-medium transition-all hover:text-slate-800 hover:bg-slate-100/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
