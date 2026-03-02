import { db } from "./db";
import {
  scans,
  type InsertScan,
  type Scan,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getScans(): Promise<Scan[]>;
  getScan(id: number): Promise<Scan | undefined>;
  createScan(scan: InsertScan & { score: number; analysis: any }): Promise<Scan>;
}

export class DatabaseStorage implements IStorage {
  async getScans(): Promise<Scan[]> {
    return await db.select().from(scans).orderBy(desc(scans.createdAt));
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan || undefined;
  }

  async createScan(scan: InsertScan & { score: number; analysis: any }): Promise<Scan> {
    const [newScan] = await db.insert(scans).values(scan).returning();
    return newScan;
  }
}

export const storage = new DatabaseStorage();
