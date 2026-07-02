import { dashboardApi } from "@/lib/api";

export async function getDashboardData(_token?: string) {
  return dashboardApi.get();
}

export async function createActivity(
  _token: string,
  payload: { title: string; type: string; status: string; amount: number }
) {
  // This is handled by the waste/scan endpoint on the backend
  // Dashboard reads from WasteScan collection
  return { id: Date.now().toString(), ...payload };
}

export async function markActivityAsRecycled(_token: string, _id: string) {
  // Marking as recycled is handled by the backend
  return null;
}
