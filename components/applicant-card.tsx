"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, User } from "lucide-react"
import { useApplicantStore, type Applicant } from "@/store/applicant-store"
import { ApplicantForm } from "./applicant-form"

interface ApplicantCardProps {
  applicant: Applicant
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  const { deleteApplicant, toggleHired } = useApplicantStore()
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this applicant?")) {
      deleteApplicant(applicant.id)
    }
  }

  if (isEditing) {
    return <ApplicantForm applicant={applicant} onClose={() => setIsEditing(false)} />
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">
              {applicant.name} {applicant.familyName}
            </h3>
          </div>
          <Badge variant={applicant.hired ? "default" : "secondary"}>{applicant.hired ? "Hired" : "Pending"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Country:</span>
            <p className="font-medium">{applicant.country}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Age:</span>
            <p className="font-medium">{applicant.age} years</p>
          </div>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">Email:</span>
          <p className="font-medium">{applicant.email}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant={applicant.hired ? "secondary" : "default"}
            onClick={() => toggleHired(applicant.id)}
            className="flex-1"
          >
            {applicant.hired ? "Mark Pending" : "Mark Hired"}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
