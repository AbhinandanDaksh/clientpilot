import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export type Lead = {
  _id: string;
  name: string;
  category: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  notes: string;
  source: string;
  sourceUrl: string;
  status: string;
  discoveredAt: string;
};

type Run = {
  _id: string;
  startedAt: string;
  status: string;
  saved: number;
  duplicates: number;
  error?: string;
};

type LeadFields = Partial<Pick<Lead, "name" | "category" | "location" | "website" | "email" | "phone" | "notes" | "status">>;
type LeadFilters = { search?: string; status?: string; page?: number; limit: number };
type LeadRequest = {
  url: string;
  method?: "POST" | "PATCH" | "DELETE";
  params?: LeadFilters;
  body?: LeadFields | { location: string; limit: number };
};

const leadsClient = axios.create({ baseURL: "/api/leads" });
const axiosBaseQuery: BaseQueryFn<
  LeadRequest,
  unknown,
  { status: number | "FETCH_ERROR"; data?: unknown }
> = async ({ url, method, params, body }, { signal }) => {
  try {
    const response = await leadsClient.request({ url, method, params, data: body, signal });
    return { data: response.status === 204 ? null : response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { error: { status: error.response.status, data: error.response.data } };
    }
    return { error: { status: "FETCH_ERROR" } };
  }
};

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Leads", "Runs"],
  endpoints: (build) => ({
    getLeads: build.query<{ data: Lead[]; total: number }, LeadFilters>({
      query: (params) => ({ url: "", params }),
      providesTags: ["Leads"],
    }),
    getRuns: build.query<{ data: Run[] }, void>({
      query: () => ({ url: "/hunter/runs" }),
      providesTags: ["Runs"],
    }),
    createLead: build.mutation<{ data: Lead }, LeadFields>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Leads"],
    }),
    updateLead: build.mutation<{ data: Lead }, { id: string; fields: LeadFields }>({
      query: ({ id, fields }) => ({ url: `/${id}`, method: "PATCH", body: fields }),
      invalidatesTags: ["Leads"],
    }),
    deleteLead: build.mutation<null, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Leads"],
    }),
    runDiscovery: build.mutation<{ data: Run }, { location: string; limit: number }>({
      query: (body) => ({ url: "/hunter/run", method: "POST", body }),
      invalidatesTags: ["Leads", "Runs"],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetRunsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useRunDiscoveryMutation,
} = leadsApi;

export function leadErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data as { error?: { message?: string } } | null;
    if (typeof data?.error?.message === "string") return data.error.message;
  }
  if (error instanceof Error) return error.message;
  return "Backend unavailable. Check that the API and MongoDB are running.";
}
