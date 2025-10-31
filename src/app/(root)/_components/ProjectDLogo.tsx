import React from "react";

export default function ProjectDLogo() {
  return (
    <div className="relative inline-block">
      <h1
        className="
          text-4xl font-extrabold italic tracking-widest
          text-transparent bg-clip-text
          bg-gradient-to-b from-white via-gray-300 to-gray-700
          drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]
          select-none
        "
        style={{
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.15em",
        }}
      >
        PROJECT.D
      </h1>

      {/* Optional subtle speed streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-20 blur-sm transform -translate-y-1/2 -rotate-6"></div>
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-10 blur-sm transform -translate-y-1/2 rotate-6"></div>
      </div>
    </div>
  );
}
