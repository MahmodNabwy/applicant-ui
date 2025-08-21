import { create } from "zustand"
import {
  apiFetchApplicants as apiFetchApplicants,
  createApplicant as apiCreateApplicant,
  updateApplicant as apiUpdateApplicant,
  deleteApplicant as apiDeleteApplicant,
  type Applicant as ApiApplicant,
  setApplicantHired,
} from "@/lib/api"

export type Applicant = ApiApplicant

interface ApplicantStore {
  applicants: Applicant[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  totalCount: number
  loadApplicants: () => Promise<void>
  addApplicant: (applicant: Omit<Applicant, "id">) => Promise<void>
  updateApplicant: (id: number, applicant: Partial<Applicant>) => Promise<void>
  deleteApplicant: (id: number) => Promise<void>
  toggleHired: (id: number) => Promise<void>
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
}

export const useApplicantStore = create<ApplicantStore>((set, get) => ({
  applicants: [],
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 0,
  totalCount: 0,

  loadApplicants: async () => {
    const { applicants, page } = await apiFetchApplicants(
      get().currentPage,
      get().itemsPerPage
    )
    set({
      applicants,
      currentPage: page.currentPage,
      itemsPerPage: page.pageSize,
      totalPages: page.totalPages,
      totalCount: page.totalCount,
    })
  },

  addApplicant: async (applicant) => {
    const created = await apiCreateApplicant(applicant)
    set((state) => ({ applicants: [...state.applicants, created] }))
  },

  updateApplicant: async (id, updatedApplicant) => {
    await apiUpdateApplicant(id, updatedApplicant)
    set((state) => ({
      applicants: state.applicants.map((applicant) =>
        applicant.id === id ? { ...applicant, ...updatedApplicant } : applicant
      ),
    }))
  },

  deleteApplicant: async (id) => {
    await apiDeleteApplicant(id)
    set((state) => ({
      applicants: state.applicants.filter((applicant) => applicant.id !== id),
    }))
  },

  toggleHired: async (id) => {
    const target = get().applicants.find((a) => a.id === id)
    const next = !target?.hired
    try {
      await setApplicantHired(id, next)
    } catch {
      // fallback if specialized endpoint not available
      await apiUpdateApplicant(id, { hired: next })
    }
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.id === id ? { ...a, hired: next } : a
      ),
    }))
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setItemsPerPage: (items) =>
    set(() => ({
      itemsPerPage: items,
      currentPage: 1,
    })),
}))
