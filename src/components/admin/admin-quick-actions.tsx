/**
 * Admin Quick Actions Component
 * Temporary component to fix build error
 */

import React from "react";

export function AdminQuickActions() {
  return (
    <div className="border border-white bg-black p-4">
      <h3 className="mb-4 font-mono font-bold text-white uppercase">
        Quick Actions
      </h3>
      <div className="space-y-2">
        <button className="w-full border border-white p-2 font-mono text-white uppercase transition-colors hover:bg-white hover:text-black">
          Create Post
        </button>
        <button className="w-full border border-white p-2 font-mono text-white uppercase transition-colors hover:bg-white hover:text-black">
          Manage Projects
        </button>
        <button className="w-full border border-white p-2 font-mono text-white uppercase transition-colors hover:bg-white hover:text-black">
          View Analytics
        </button>
      </div>
    </div>
  );
}

export default AdminQuickActions;
