import { create } from "zustand"

export interface Applicant {
  id: string
  name: string
  familyName: string
  country: string
  email: string
  age: number
  hired: boolean
}

interface ApplicantStore {
  applicants: Applicant[]
  currentPage: number
  itemsPerPage: number
  addApplicant: (applicant: Omit<Applicant, "id">) => void
  updateApplicant: (id: string, applicant: Partial<Applicant>) => void
  deleteApplicant: (id: string) => void
  toggleHired: (id: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
}

export const useApplicantStore = create<ApplicantStore>((set) => ({
  applicants: [
    {
      id: "1",
      name: "John",
      familyName: "Doe",
      country: "United States",
      email: "john.doe@email.com",
      age: 28,
      hired: false,
    },
    {
      id: "2",
      name: "Jane",
      familyName: "Smith",
      country: "Canada",
      email: "jane.smith@email.com",
      age: 32,
      hired: true,
    },
    {
      id: "3",
      name: "Ahmed",
      familyName: "Hassan",
      country: "Egypt",
      email: "ahmed.hassan@email.com",
      age: 25,
      hired: false,
    },
    {
      id: "4",
      name: "Maria",
      familyName: "Garcia",
      country: "Spain",
      email: "maria.garcia@email.com",
      age: 29,
      hired: true,
    },
    {
      id: "5",
      name: "Chen",
      familyName: "Wei",
      country: "China",
      email: "chen.wei@email.com",
      age: 31,
      hired: false,
    },
    {
      id: "6",
      name: "Pierre",
      familyName: "Dubois",
      country: "France",
      email: "pierre.dubois@email.com",
      age: 27,
      hired: true,
    },
    {
      id: "7",
      name: "Yuki",
      familyName: "Tanaka",
      country: "Japan",
      email: "yuki.tanaka@email.com",
      age: 26,
      hired: false,
    },
    {
      id: "8",
      name: "Lars",
      familyName: "Andersen",
      country: "Norway",
      email: "lars.andersen@email.com",
      age: 33,
      hired: true,
    },
    {
      id: "9",
      name: "Priya",
      familyName: "Sharma",
      country: "India",
      email: "priya.sharma@email.com",
      age: 24,
      hired: false,
    },
    {
      id: "10",
      name: "Carlos",
      familyName: "Silva",
      country: "Brazil",
      email: "carlos.silva@email.com",
      age: 30,
      hired: true,
    },
  ],
  currentPage: 1,
  itemsPerPage: 6,

  addApplicant: (applicant) =>
    set((state) => ({
      applicants: [...state.applicants, { ...applicant, id: Date.now().toString() }],
    })),

  updateApplicant: (id, updatedApplicant) =>
    set((state) => ({
      applicants: state.applicants.map((applicant) =>
        applicant.id === id ? { ...applicant, ...updatedApplicant } : applicant,
      ),
    })),

  deleteApplicant: (id) =>
    set((state) => ({
      applicants: state.applicants.filter((applicant) => applicant.id !== id),
    })),

  toggleHired: (id) =>
    set((state) => ({
      applicants: state.applicants.map((applicant) =>
        applicant.id === id ? { ...applicant, hired: !applicant.hired } : applicant,
      ),
    })),

  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
    })),

  setItemsPerPage: (items) =>
    set(() => ({
      itemsPerPage: items,
      currentPage: 1, // Reset to first page when changing items per page
    })),
}))
