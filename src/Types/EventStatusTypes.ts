export type EventStatus =
  | "active"
  | "cancelled"
  | "shipped"
  | "ongoing"
  | "delayed"
  | "delivered"
  | "completed";

export interface UpdateEventStatusPayload {
  status: EventStatus;
  delayedReason?: string;
}
