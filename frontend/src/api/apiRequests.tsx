import axiosInstance from "./axiosInstance";


export const postRequest = async (
  endpoint: string,
  data: any,
  setLoading: (val: boolean) => void,
  setError: (val: string | null) => void
) => {
  try {
    setLoading(true);
    const res = await axiosInstance.post(endpoint, data);
    return res.data;
  } catch (err: any) {
    const errorMsg = err.response?.data?.error;
    setError(errorMsg);
    return null; 
  } finally {
    setLoading(false);
  }
};


export const putRequest = async (
  endpoint: string,
  data: any,
  setLoading: (value: boolean) => void,
  setError: (value: null | string) => void) => {
  
  try {
    setLoading(true);
    const res = await axiosInstance.put(endpoint, data);
    return res.data;

  } catch (err: any) {
    const errorMsg = err.response?.data?.error;
    setError(errorMsg);
    return null; 
    
  } finally {
    setLoading(false);
  }
}


export const getRequest = async (
  endpoint: string,
  setLoading: ((val: boolean) => void) | null,
  setError: ((val: string | null) => void) | null
): Promise<any | null> => {
  try {
    setLoading?.(true);

    const res = await axiosInstance.get(endpoint);

    return res.data;
  } catch (err: any) {
    const errorMsg = err.response?.data?.error;
    setError?.(errorMsg);
    return null;
  } finally {
    setLoading?.(false);
  }
};