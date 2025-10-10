
export interface LocationPoint {
  type: "Point";
  coordinates: [number, number]; 
  address?: string;
}

export interface LiveLocation {
  timestamp: string; 
  coordinates: [number, number];
}

export interface IEvent {
  _id?: string | undefined;
  eventPlace: string;
  date: string | Date; 
  endDate: string | Date;             
  location: string;
  // time?: string;
  adminId: string;
  status:"active"| "cancelled"| "shipped"| "ongoing"| "delayed"|"delivered"|"completed";
  pincode: string;
  area: string;
  city: string;
  description: string;
  image: string;
  eventName: string;
  clientName: string;
  contactPersonNumber: string;
  pickUpPerson?: PickUpPersonI;
  delayedReason?: string;
  eventMode?: "eventDeparture" | "eventReturn";
  relatedDepartureEvent?: string;
  dateStatus?:string | null;
  startLocation?: LocationPoint;
  destinationLocation?: LocationPoint;
  liveLocationHistory?: LiveLocation[];
}


export interface PickUpPersonI {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "Driver" | "Employee" | "Admin"; 
  LicenceImage: string;
  LicenceValidityDate: string; 
  status: "approved" | "pending" | "rejected"; 
  createdAt: string;
  updatedAt: string;
   liveLocationHistory?: LiveLocation[];
}
