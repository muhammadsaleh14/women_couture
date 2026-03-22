import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

/**
 * Orval mutator: all generated requests use the shared Axios instance (base URL + Bearer).
 */
export function customInstance<T>(config: AxiosRequestConfig): Promise<T> {
  return api(config).then((res) => res.data);
}
