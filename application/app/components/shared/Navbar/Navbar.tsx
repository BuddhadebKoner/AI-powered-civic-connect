import React from "react";

const Navbar = () => (
  <nav
    className="h-[60px] bg-[#181c20] border-b border-gray-800 flex items-center justify-between px-8 fixed top-0 z-50"
    style={{ left: 80, width: "calc(100% - 80px)" }} // 80px = w-20
  >
    <div className="flex items-center font-bold text-2xl text-white">
      <span className="text-3xl mr-2">🧵</span>
      Civic Connect
    </div>
    <div>
      <button className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
        Login
      </button>
    </div>
  </nav>
);

export default Navbar;