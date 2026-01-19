import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main className="flex justify-center items-center h-screen flex-col bg-zinc-900">
      {children}
    </main>
  );
};

export default AuthLayout;
