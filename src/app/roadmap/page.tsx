"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function RoadmapPage() {
  const { setActiveTab } = useApp();

  useEffect(() => {
    setActiveTab("roadmap");
  }, [setActiveTab]);

  return <Home />;
}
