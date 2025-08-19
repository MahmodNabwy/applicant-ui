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
  addApplicant: (applicant: Omit<Applicant, "id">) => void
  updateApplicant: (id: string, applicant: Partial<Applicant>) => void
  deleteApplicant: (id: string) => void
  toggleHired: (id: string) => void
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
  ],

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
}))
