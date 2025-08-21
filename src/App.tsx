import React from "react";
import ApplicantListPage from "@/components/applicant-list";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <ApplicantListPage />
      </main>
      <Toaster richColors position="top-right" />
    </>
  );
}
