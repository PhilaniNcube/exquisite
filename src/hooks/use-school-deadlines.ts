"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays, parseISO, endOfDay } from "date-fns";

export interface SchoolDeadline {
  id: number;
  name: string;
  orderDeadline: string | null;
}

export interface DeadlineStatus {
  school: SchoolDeadline;
  hasPassed: boolean;
  daysRemaining: number | null;
  formattedDeadline: string | null;
}

export function getDeadlineStatus(deadline: SchoolDeadline): DeadlineStatus {
  if (!deadline.orderDeadline) {
    return {
      school: deadline,
      hasPassed: false,
      daysRemaining: null,
      formattedDeadline: null,
    };
  }

  const deadlineDate = endOfDay(parseISO(deadline.orderDeadline));
  const now = new Date();
  const daysRemaining = differenceInCalendarDays(deadlineDate, now);
  const hasPassed = daysRemaining < 0;

  const formattedDeadline = new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(deadlineDate);

  return {
    school: deadline,
    hasPassed,
    daysRemaining,
    formattedDeadline,
  };
}

export function useSchoolDeadlines(schoolIds: string[]): {
  deadlines: SchoolDeadline[];
  deadlineStatuses: DeadlineStatus[];
  loading: boolean;
  hasExpiredDeadlines: boolean;
  hasApproachingDeadlines: boolean;
} {
  const [deadlines, setDeadlines] = useState<SchoolDeadline[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uniqueIds = [...new Set(schoolIds.filter(Boolean))];
    if (uniqueIds.length === 0) {
      setDeadlines([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/schools/deadlines?ids=${uniqueIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setDeadlines(data.deadlines);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch school deadlines:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [schoolIds.join(",")]);

  const deadlineStatuses = deadlines.map(getDeadlineStatus);
  const hasExpiredDeadlines = deadlineStatuses.some((s) => s.hasPassed);
  const hasApproachingDeadlines = deadlineStatuses.some(
    (s) => !s.hasPassed && s.daysRemaining !== null && s.daysRemaining <= 7
  );

  return {
    deadlines,
    deadlineStatuses,
    loading,
    hasExpiredDeadlines,
    hasApproachingDeadlines,
  };
}
