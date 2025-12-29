export interface EmployeeI {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role:string 
  LicenceImage: string;
  LicenceValidityDate: string; 
  status: "approved" | "pending" | "rejected"; 
  createdAt: string;
  updatedAt: string;
  isActive:boolean;
}