"use client";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/75 backdrop-blur-sm z-50">
      <svg
        className="w-16 h-16 text-[#ca2a15] animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {/* <p className="mt-4 text-lg text-gray-700 font-medium">
        Loading, please wait...
      </p> */}
    </div>
  );
}
