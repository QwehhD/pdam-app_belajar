import { Bills } from "@/app/types"
import { drop, get, patch, post } from "@/lib/action"


const token = process.env.NEXT_PUBLIC_TOKEN || `accessToken`;
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`


export const getBillsByAdmin = async (params?: { [key: string]: string | number | undefined }): Promise<{ counts: number, bills: Bills[] }> => {
   try {
       const queryParams: string = params ? Object.keys(params).filter(key => typeof params[key] !== `undefined`).map(key => `${key}=${params[key]}`).join(`&`) : ``
       const url = `${BASE_API_URL}/bills?${queryParams}`


       const { data } = await get(url, token)
       if (data?.success == true) {
           return {
               counts: data.count,
               bills: [...data.data]
           }
       }
       return { counts: 0, bills: [] }
   } catch (error) {
       console.log(error);
       return { counts: 0, bills: [] }
   }
}


export const getBillById = async (id: number) => {
   const url = `${BASE_API_URL}/bills/${id}`


   const res = await get(url, token)


   if (!res || !res.data) {
       throw new Error("Failed to fetch bill")
   }


   return res.data.data
}


export const addBill = async (payload: string): Promise<Record<string, never>> => {
   const url = `${BASE_API_URL}/bills`
   const { data } = await post(url, payload, token)
   return data;
}


export const editBill = async (payload: string, id: number): Promise<Record<string, never>> => {
   const url = `${BASE_API_URL}/bills/${id}`
   const { data } = await patch(url, payload, token)
   return data;
}


export const dropBill = async (id: number): Promise<Record<string, never>> => {
   const url = `${BASE_API_URL}/bills/${id}`
   const { data } = await drop(url, token)
   return data;
}


export const verifyPayment = async (id: number) => {
   const url = `${BASE_API_URL}/payments/${id}`
   const response = await patch(url, "", token)
   return response;
}
