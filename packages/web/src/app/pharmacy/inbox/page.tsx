"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import PrescriptionTable from "@/components/pharmacy/PrescriptionTable";
import PrescriptionDetail from "@/components/pharmacy/PrescriptionDetail";

const PRESCRIPTIONS_QUERY = gql`
  query PharmacyPrescriptions {
    pharmacyPrescriptions {
      id
      patient { userId }
      doctor { userId }
      status
      createdAt
    }
  }
`;

export default function InboxPage() {
  const { data, refetch } = useQuery(PRESCRIPTIONS_QUERY);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inbox Pharmacie</h1>
      <div className="flex gap-8">
        <div className="w-1/2">
          <PrescriptionTable prescriptions={data?.pharmacyPrescriptions} onSelect={setSelected} />
        </div>
        <div className="w-1/2">
          {selected && <PrescriptionDetail prescriptionId={selected} refreshList={refetch} />}
        </div>
      </div>
    </div>
  );
}
