import { Hymn } from "@/types";

export const mockHymns: Hymn[] = [
  { id: "1", title: "Hallelujah", sortOrder: 10, category: "Praise", author: "Leonard Cohen" },
  { id: "2", title: "Amazing Grace", sortOrder: 20, category: "Classic", author: "John Newton" },
  { id: "3", title: "How Great Thou Art", sortOrder: 30, category: "Worship", author: "Carl Boberg" },
  { id: "4", title: "Great Is Thy Faithfulness", sortOrder: 40, category: "Classic", author: "Thomas Chisholm" },
  { id: "5", title: "It Is Well With My Soul", sortOrder: 50, category: "Classic", author: "Horatio Spafford" },
  { id: "6", title: "Holy, Holy, Holy", sortOrder: 60, category: "Praise", author: "Reginald Heber" },
  { id: "7", title: "Blessed Assurance", sortOrder: 70, category: "Assurance", author: "Fanny Crosby" },
  { id: "8", title: "To God Be the Glory", sortOrder: 80, category: "Praise", author: "Fanny Crosby" },
  { id: "9", title: "Crown Him with Many Crowns", sortOrder: 90, category: "Worship", author: "Matthew Bridges" },
  { id: "10", title: "Be Thou My Vision", sortOrder: 100, category: "Classic", author: "Dallan Forgaill" },
  { id: "11", title: "Rock of Ages", sortOrder: 110, category: "Classic", author: "Augustus Toplady" },
  { id: "12", title: "Abide With Me", sortOrder: 120, category: "Comfort", author: "Henry Lyte" },
  { id: "13", title: "O For a Thousand Tongues", sortOrder: 130, category: "Praise", author: "Charles Wesley" },
  { id: "14", title: "What a Friend We Have in Jesus", sortOrder: 140, category: "Comfort", author: "Joseph Scriven" },
  { id: "15", title: "Fairest Lord Jesus", sortOrder: 150, category: "Worship", author: "Anonymous" },
];

export async function fetchHymns(): Promise<Hymn[]> {
  await new Promise((r) => setTimeout(r, 400));
  return mockHymns;
}

export async function createHymn(data: Omit<Hymn, "id" | "createdAt">): Promise<Hymn> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...data,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
}

export async function updateHymn(id: string, data: Partial<Hymn>): Promise<Hymn> {
  await new Promise((r) => setTimeout(r, 300));
  const hymn = mockHymns.find((h) => h.id === id);
  if (!hymn) throw new Error("Hymn not found");
  return { ...hymn, ...data };
}

export async function deleteHymn(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 250));
}

export const CATEGORIES = ["All", "Praise", "Classic", "Worship", "Comfort", "Assurance"];
