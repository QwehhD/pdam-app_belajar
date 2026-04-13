export interface User {
  id: number
  username: string
  password: string
  role: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface AdminProfile {
  success: boolean
  message: string
  data: Admin
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface CustomerProfile {
  success: boolean
  message: string
  data: Customer
}

export interface Customer {
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface Services {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bills {
  id: number
  customer_id: number
  admin_id: number
  month: number
  year: number
  measurement_number: string
  usage_value: number
  price: number
  service_id: number
  paid: boolean
  owner_token: string
  createdAt: string
  updatedAt: string
  service: Services
  admin: Admin
  customer: Customer
  payments: Payments
  amount: number
}

export interface Payments {
  id: number
  bill_id: number
  payment_date: string
  verified: boolean
  total_amount: number
  payment_proof: string
  owner_token: string
  createdAt: string
  updatedAt: string
}
