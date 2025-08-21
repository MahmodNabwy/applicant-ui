import { useState, useEffect, useRef } from "react";
import { useApplicantStore } from "@/store/applicant-store";
import { ApplicantCard } from "./applicant-card";
import { ApplicantForm } from "./applicant-form";
import { Pagination } from "./pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

export default function ApplicantListPage() {
  const {
    applicants,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCount,
    setCurrentPage,
    setItemsPerPage,
    loadApplicants,
  } = useApplicantStore();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hired" | "pending">(
    "all"
  );

  // --- Fetch applicants whenever page/size changes ---
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) {
      void loadApplicants();
    } else {
      didFetchRef.current = true;
      void loadApplicants();
    }
  }, [currentPage, itemsPerPage]);

  // --- Local filtering on the already-loaded page ---
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.country?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "hired" && applicant.hired) ||
      (filterStatus === "pending" && !applicant.hired);

    return matchesSearch && matchesFilter;
  });

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <ApplicantForm onClose={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applicant Management</h1>
          <p className="text-muted-foreground">
            Manage your job applicants ({totalCount} total)
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Applicant
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: "all" | "hired" | "pending") =>
            setFilterStatus(value)
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applicants</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredApplicants.length} of {applicants.length} applicants
        (page {currentPage}/{totalPages})
      </div>

      {/* Applicant Grid */}
      {filteredApplicants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No applicants found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplicants.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalCount}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}
