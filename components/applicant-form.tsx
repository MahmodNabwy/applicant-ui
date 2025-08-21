import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicantStore, type Applicant } from "@/store/applicant-store";
import { ApiValidationError } from "@/lib/api";

interface ApplicantFormProps {
  applicant?: Applicant;
  onClose: () => void;
}

export function ApplicantForm({ applicant, onClose }: ApplicantFormProps) {
  const { addApplicant, updateApplicant } = useApplicantStore();

  const [formData, setFormData] = useState({
    name: applicant?.name || "",
    familyName: applicant?.familyName || "",
    address: applicant?.address || "",
    country: applicant?.country || "",
    email: applicant?.email || "",
    age: applicant?.age || 20,
    hired: applicant?.hired || false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError("");
    try {
      // Client-side validation with zod (no extra dependency needed)
      const schema = z
        .object({
          name: z.string().min(5, "Name must be at least 5 characters"),
          familyName: z
            .string()
            .min(5, "Family Name must be at least 5 characters"),
          address: z.string().min(1, "Address is required"),
          country: z.string().min(1, "Country is required"),
          email: z.string().email("Invalid email"),
          age: z.number({ coerce: true }),
          hired: z.boolean(),
        })
        .superRefine((data, ctx) => {
          if (data.age < 20 || data.age > 60) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Age' must be between 20 and 60. You entered ${data.age}.`,
              path: ["age"],
            });
          }
        });
      const parsed = schema.safeParse(formData);
      if (!parsed.success) {
        const fieldKeyMap: Record<string, string> = {
          name: "Name",
          familyName: "FamilyName",
          address: "Address",
          country: "Country",
          email: "EmailAdress",
          age: "Age",
          hired: "Hired",
        };
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of parsed.error.issues) {
          const key = (issue.path?.[0] as string) || "form";
          const mapped = fieldKeyMap[key] || key;
          fieldErrors[mapped] = fieldErrors[mapped] || [];
          fieldErrors[mapped].push(issue.message);
        }
        setErrors(fieldErrors);
        return;
      }

      setSubmitting(true);
      if (applicant) {
        await updateApplicant(applicant.id, formData);
        toast.success("Applicant updated");
      } else {
        await addApplicant(formData);
        toast.success("Applicant added");
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setErrors(err.errors);
        toast.error(
          "Something went wrong, please check the form and try again."
        );
        return;
      }
      // Non-API validation errors handled above
      setFormError("Request failed. Check CORS or server connectivity.");
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {applicant ? "Edit Applicant" : "Add New Applicant"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={submitting}
              />
              {errors.Name && (
                <p className="text-sm text-red-600 mt-1">{errors.Name[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                value={formData.familyName}
                onChange={(e) => handleChange("familyName", e.target.value)}
                required
                disabled={submitting}
              />
              {errors.FamilyName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.FamilyName[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
              disabled={submitting}
            />
            {errors.Address && (
              <p className="text-sm text-red-600 mt-1">{errors.Address[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
              disabled={submitting}
            />
            {(errors.CountryOfOrigin || errors.Country) && (
              <p className="text-sm text-red-600 mt-1">
                {(errors.CountryOfOrigin || errors.Country)[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={submitting}
            />
            {errors.EmailAdress && (
              <p className="text-sm text-red-600 mt-1">
                {errors.EmailAdress[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="20"
              max="60"
              value={formData.age}
              onChange={(e) =>
                handleChange("age", Number.parseInt(e.target.value))
              }
              required
              disabled={submitting}
            />
            {errors.Age && (
              <p className="text-sm text-red-600 mt-1">{errors.Age[0]}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="hired"
              type="checkbox"
              checked={formData.hired}
              onChange={(e) => handleChange("hired", e.target.checked)}
              className="rounded border-gray-300"
              disabled={submitting}
            />
            <Label htmlFor="hired">Hired</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <span className="inline-flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {applicant ? "Updating..." : "Adding..."}
                </span>
              ) : (
                <>{applicant ? "Update" : "Add"} Applicant</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
