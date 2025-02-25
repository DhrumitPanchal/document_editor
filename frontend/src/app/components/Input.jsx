import React from "react";

function Input({ type, action, value, placeholder }) {
  return (
    <input
      className="border-2 border-blue-500 px-2 py-1 rounded-md w-full"
      type={type}
      onChange={action}
      value={value}
      placeholder={placeholder}
    />
  );
}

export default Input;
