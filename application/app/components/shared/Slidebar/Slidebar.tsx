import React, { useState } from "react";

const navItems = [
  { icon: "🏠", label: "Home" },
  { icon: "🔍", label: "Search" },
  { icon: "➕", label: "Create" },
  { icon: "❤️", label: "Likes" },
  { icon: "👤", label: "Profile" },
];

const Slidebar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <aside className="w-20 h-screen bg-[#181c20] border-r border-gray-800 flex flex-col items-center fixed left-0 top-0 z-40">
      {/* Centered nav items */}
      <div className="flex-1 flex flex-col justify-center">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="w-14 h-14 flex items-center justify-center rounded-xl mb-3 text-2xl cursor-pointer transition-colors text-gray-200 hover:bg-[#23272c]"
          >
            <span title={item.label}>{item.icon}</span>
          </div>
        ))}
      </div>
      {/* Bottom menu icon */}
      <div className="mb-6">
        <button
          className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl cursor-pointer transition-colors text-gray-200 hover:bg-[#23272c]"
          onClick={() => setShowMenu((v) => !v)}
        >
          <span title="More">≡</span>
        </button>
        {/* Slide-out menu */}
        {showMenu && (
          <div className="absolute left-20 bottom-8 bg-[#23272c] border border-gray-700 rounded-lg shadow-lg p-4 min-w-[180px] z-50">
            <div className="text-gray-200 font-semibold mb-2">Settings</div>
            <ul className="text-gray-300 space-y-2">
              <li className="cursor-pointer hover:text-white">Account</li>
              <li className="cursor-pointer hover:text-white">Theme</li>
              <li className="cursor-pointer hover:text-white">Help</li>
              <li className="cursor-pointer hover:text-white">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Slidebar;