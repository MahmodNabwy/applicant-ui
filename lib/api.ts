const API_BASE = 'https://localhost:7292'

export type Applicant = {
  id: number
  name: string
  familyName: string
  country?: string
  email?: string
  age: number
  hired: boolean
  address?: string
}

type ApplicantListItemDto = {
  id: number
  name?: string | null
  familyName?: string | null
  emailAdress?: string | null
  country?: string | null
  hired: boolean
}

type ApplicantDto = {
  id: number
  name?: string | null
  familyName?: string | null
  address?: string | null
  country?: string | null
  emailAdress?: string | null
  age: number
  hired: boolean
}

type CreateApplicantCommand = {
  name?: string | null
  familyName?: string | null
  address?: string | null
  countryOfOrigin?: string | null
  emailAdress?: string | null
  age: number
  hired?: boolean | null
}

type UpdateApplicantCommand = CreateApplicantCommand & { id: number }


const mapDtoToApplicant = (dto: ApplicantDto | ApplicantListItemDto): Applicant => ({
  id: dto.id,
  name: (dto as ApplicantDto).name ?? '',
  familyName: (dto as ApplicantDto).familyName ?? '',
  country: (dto as ApplicantDto).country ?? undefined,
  email: dto.emailAdress ?? undefined,
  age: (dto as ApplicantDto).age ?? 0,
  hired: dto.hired,
  address: (dto as ApplicantDto).address ?? undefined,
})

const mapApplicantToCreate = (a: Omit<Applicant, 'id'>): CreateApplicantCommand => ({
  name: a.name,
  familyName: a.familyName,
  address: a.address ?? null,
  countryOfOrigin: a.country ?? null,
  emailAdress: a.email ?? null,
  age: a.age,
  hired: a.hired ?? null,
})

const mapApplicantToUpdate = (id: number, a: Partial<Applicant>): UpdateApplicantCommand => ({
  id,
  name: a.name ?? null,
  familyName: a.familyName ?? null,
  address: a.address ?? null,
  countryOfOrigin: a.country ?? null,
  emailAdress: a.email ?? null,
  age: a.age ?? 0,
  hired: a.hired ?? null,
})

export class ApiValidationError extends Error {
  status: number
  errors: Record<string, string[]>
  constructor(message: string, errors: Record<string, string[]>, status = 400) {
    super(message)
    this.name = 'ApiValidationError'
    this.status = status
    this.errors = errors
  }
}

export async function fetchApplicants(page?: number, pageSize?: number): Promise<Applicant[]> {
  const qs = new URLSearchParams()
  if (page) qs.set('Page', String(page))
  if (pageSize) qs.set('PageSize', String(pageSize))
  const res = await fetch(`${API_BASE}/api/Applicants${qs.toString() ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch applicants')
  const data = (await res.json()) as (ApplicantListItemDto | ApplicantDto)[]
  return data.map(mapDtoToApplicant)
}

export async function createApplicant(a: Omit<Applicant, 'id'>): Promise<Applicant> {
  const res = await fetch(`${API_BASE}/api/Applicants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapApplicantToCreate(a)),
  })
  if (!res.ok) {
    if (res.status === 400) {
      const body = await res.json().catch(() => ({} as any))
      if (body && body.errors) {
        throw new ApiValidationError('Validation failed', body.errors, 400)
      }
    }
    throw new Error('Failed to create applicant')
  }
  const dto = (await res.json()) as ApplicantDto
  return mapDtoToApplicant(dto)
}

export async function updateApplicant(id: number, a: Partial<Applicant>): Promise<void> {
  const res = await fetch(`${API_BASE}/api/Applicants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapApplicantToUpdate(id, a)),
  })
  if (!res.ok) {
    if (res.status === 400) {
      const body = await res.json().catch(() => ({} as any))
      if (body && body.errors) {
        throw new ApiValidationError('Validation failed', body.errors, 400)
      }
    }
    throw new Error('Failed to update applicant')
  }
}

export async function deleteApplicant(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/Applicants/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete applicant')
}

export async function fetchApplicantById(id: number): Promise<Applicant> {
  const res = await fetch(`${API_BASE}/api/Applicants/${id}`)
  if (!res.ok) throw new Error('Failed to fetch applicant')
  const dto = (await res.json()) as ApplicantDto
  return mapDtoToApplicant(dto)
}

// Optional specialized endpoint to set hired without sending full object.
export async function setApplicantHired(id: number, hired: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/api/Applicants/${id}/hire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hired }),
  })
  if (!res.ok) throw new Error('Failed to set applicant hired state')
}


