import React from "react";

function DocCard({ data, index, action }) {
  return (
    <div
      onClick={action}
      key={index}
      className="border-[1px] border-black/50 flex  flex-col"
    >
      <div className="flex justify-center items-center h-40 w-36 bg-slate-100/80 text-[6px]">
        {data?.content}
      </div>
      <div className="px-2 py-2">
        <h2 className="text-base capitalize font-semibold">{data?.title}</h2>
        <h2 className="text-xs font-light">Feb 20, 2024</h2>
      </div>
    </div>
  );
}

export default DocCard;
