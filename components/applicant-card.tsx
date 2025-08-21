"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, User } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import { useApplicantStore, type Applicant } from "@/store/applicant-store";
import { ApplicantForm } from "./applicant-form";

interface ApplicantCardProps {
  applicant: Applicant;
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  const { deleteApplicant, toggleHired } = useApplicantStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    deleteApplicant(applicant.id);
  };

  if (isEditing) {
    return (
      <ApplicantForm
        applicant={applicant}
        onClose={() => setIsEditing(false)}
      />
    );
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
          <Badge variant={applicant.hired ? "default" : "secondary"}>
            {applicant.hired ? "Hired" : "Pending"}
          </Badge>
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant={applicant.hired ? "secondary" : "default"}
            onClick={async () => {
              if (applicant.hired) return;
              await toggleHired(applicant.id);
              toast.success("Applicant marked as hired");
            }}
            disabled={applicant.hired}
            className="flex-1"
          >
            {applicant.hired ? "Hired" : "Mark Hired"}
          </Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 w-11/12 max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-background p-6 shadow-lg">
                <AlertDialog.Title className="text-lg font-semibold">
                  Delete applicant
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                  Are you sure you want to delete {applicant.name}{" "}
                  {applicant.familyName}? This action cannot be undone.
                </AlertDialog.Description>
                <div className="mt-6 flex justify-end gap-2">
                  <AlertDialog.Cancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </CardContent>
    </Card>
  );
}
