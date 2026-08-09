"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function StatsPage() {
  const { setActiveTab } = useApp();

  useEffect(() => {
    setActiveTab("stats");
  }, [setActiveTab]);

  return <Home />;
}
