import { useCallback, useEffect, useState } from "react";
import dashboardService from "../api/dashboardService";
import type { DashboardSummaryData } from "../types";

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await dashboardService.getSummary();
      setData(res.data);
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat statistik dashboard.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    dashboardService
      .getSummary()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat statistik dashboard.";
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error, refetch: fetchSummary };
}

export default useDashboardSummary;
