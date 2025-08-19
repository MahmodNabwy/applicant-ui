"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApplicantStore, type Applicant } from "@/store/applicant-store"

interface ApplicantFormProps {
  applicant?: Applicant
  onClose: () => void
}

export function ApplicantForm({ applicant, onClose }: ApplicantFormProps) {
  const { addApplicant, updateApplicant } = useApplicantStore()

  const [formData, setFormData] = useState({
    name: applicant?.name || "",
    familyName: applicant?.familyName || "",
    country: applicant?.country || "",
    email: applicant?.email || "",
    age: applicant?.age || 18,
    hired: applicant?.hired || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (applicant) {
      updateApplicant(applicant.id, formData)
    } else {
      addApplicant(formData)
    }

    onClose()
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{applicant ? "Edit Applicant" : "Add New Applicant"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                value={formData.familyName}
                onChange={(e) => handleChange("familyName", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => handleChange("age", Number.parseInt(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="hired"
              type="checkbox"
              checked={formData.hired}
              onChange={(e) => handleChange("hired", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="hired">Hired</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {applicant ? "Update" : "Add"} Applicant
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
