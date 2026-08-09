"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function ProjectsPage() {
  const { setActiveTab } = useApp();

  useEffect(() => {
    setActiveTab("projects");
  }, [setActiveTab]);

  return <Home />;
}
