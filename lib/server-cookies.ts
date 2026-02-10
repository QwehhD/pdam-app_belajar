import{ cookies }from "next/headers";

export const getCookie = async (key: string): Promise<string> => {
   return (await cookies()).get(key)?.value || ""

}

export const setCookie = async (key: string, value: string) => {
   (await cookies()).set(key, value)
}

export const removeCookie = async (key: string) => {
   (await cookies()).delete(key)
}