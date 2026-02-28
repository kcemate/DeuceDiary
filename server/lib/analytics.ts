import { db } from "../db";
import { analyticsEvents } from "@shared/schema";

export async function track(event: string, userId?: string, props?: Record<string, unknown>) {
  try {
    await db.insert(analyticsEvents).values({
      userId: userId ?? null,
      event,
      properties: props ? JSON.stringify(props) : null,
    });
  } catch (e) {
    console.error("[analytics]", e);
  }
}
