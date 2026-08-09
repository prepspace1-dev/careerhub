"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/app-context";
import Home from "@/app/page";

export default function WorkspaceDayPage() {
  const params = useParams();
  const { setCurrentDay, setActiveTab } = useApp();

  useEffect(() => {
    if (params?.day) {
      const dayStr = String(params.day).replace("day-", "");
      const dayNum = parseInt(dayStr, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 30) {
        setCurrentDay(dayNum);
        setActiveTab("workspace");
      }
    }
  }, [params, setCurrentDay, setActiveTab]);

  return <Home />;
}
