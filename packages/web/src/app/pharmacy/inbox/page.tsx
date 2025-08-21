"use client";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import PrescriptionDetail from "../../../../components/pharmacy/PrescriptionDetail";
import PrescriptionTable from "../../../../components/pharmacy/PrescriptionTable";
import { PRESCRIPTIONS_QUERY } from "../../../../graphql/queries";

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
