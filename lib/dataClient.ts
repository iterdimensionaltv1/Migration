export type Dataset = { routes: any[]; sources: Record<string, any> };

export async function loadDataset(): Promise<Dataset | null> {
  try {
    const res = await fetch('/data/dataset.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.routes)) return null;
    return data as Dataset;
  } catch {
    return null;
  }
}

