import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ScanInput } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scans");
      const data = await res.json();
      // Use responses[200] schema to validate
      return parseWithLogging(api.scans.list.responses[200], data, "scans.list");
    },
  });
}

export function useScan(id: number | null) {
  return useQuery({
    queryKey: [api.scans.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.scans.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scan details");
      
      const data = await res.json();
      return parseWithLogging(api.scans.get.responses[200], data, "scans.get");
    },
    enabled: id !== null,
  });
}

export function useCreateScan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ScanInput) => {
      const validated = api.scans.create.input.parse(data);
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create scan");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.scans.create.responses[201], responseData, "scans.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
    },
  });
}
