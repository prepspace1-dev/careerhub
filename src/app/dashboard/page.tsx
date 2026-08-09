"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function DashboardPage() {
  const { setActiveTab } = useApp();

  useEffect(() => {
    setActiveTab("dashboard");
  }, [setActiveTab]);

  return <Home />;
}
