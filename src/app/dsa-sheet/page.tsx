"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function DsaSheetPage() {
  const { setActiveTab } = useApp();

  useEffect(() => {
    setActiveTab("dsa");
  }, [setActiveTab]);

  return <Home />;
}
