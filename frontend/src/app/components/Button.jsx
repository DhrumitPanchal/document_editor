import React from "react";
import Spiner from "./Spiner";

function Button({ text, action, loading }) {
  return (
    <>
      {loading ? (
        <div
          className={`flex justify-center items-center cursor-pointer h-9 w-24 ${
            text === "Delete" ? "bg-red-600/80" : "bg-blue-600/80"
          } rounded-md text-white font-medium`}
        >
          <Spiner size="small" />
        </div>
      ) : (
        <div
          onClick={action}
          className={`cursor-pointer flex justify-center items-center text-center px-6 py-1  h-9 w-24 ${
            text === "Delete" ? "bg-red-600" : "bg-blue-600"
          } rounded-md text-white font-medium`}
        >
          {text}
        </div>
      )}
    </>
  );
}

export default Button;
