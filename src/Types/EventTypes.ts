export interface IEvent {
  _id?: string | undefined;
  eventPlace: string;
  date: string;             
  location: string;
  time: string;
  adminId: string;
  status: "active" | "cancelled" | "ongoing" | "delayed" | "delivered";
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
  dateStatus?:string | null
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
}
