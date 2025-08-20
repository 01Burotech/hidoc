"use client";
import { useQuery, gql, useMutation } from "@apollo/client";
import PrintLabelButton from "./PrintLabelButton";
import ExportCsvButton from "./ExportCsvButton";
import PrescriptionChat from "./PrescriptionChat";

const PRESCRIPTION_QUERY = gql`
  query Prescription($id: ID!) {
    prescription(id: $id) {
      id
      jsonPayload
      pdfUrl
      status
      patient { userId }
      doctor { userId }
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateDispatch($dispatchId: ID!, $status: String!, $reason: String) {
    updateDispatchStatus(dispatchId: $dispatchId, status: $status, reason: $reason) {
      id
      status
    }
  }
`;

export default function PrescriptionDetail({ prescriptionId, refreshList }: { prescriptionId: string, refreshList: any }) {
  const { data } = useQuery(PRESCRIPTION_QUERY, { variables: { id: prescriptionId } });
  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleStatus = async (status: string) => {
    const reason = status === "rejected" ? prompt("Motif rejet") : undefined;
    await updateStatus({ variables: { dispatchId: prescriptionId, status, reason } });
    refreshList();
  };

  if (!data) return <p>Chargement...</p>;

  const p = data.prescription;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Ordonnance {p.id}</h2>
      <p>Patient: {p.patient.userId}</p>
      <p>Docteur: {p.doctor.userId}</p>
      <p>Status: {p.status}</p>
      <div className="flex gap-2 mt-4">
        {["received","accepted","prepared","dispensed","rejected"].map(s => (
          <button key={s} onClick={()=>handleStatus(s)} className="px-2 py-1 bg-blue-600 text-white rounded">{s}</button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <PrintLabelButton pdfUrl={p.pdfUrl} />
        <ExportCsvButton prescriptionId={p.id} />
      </div>
      <div className="mt-4">
        <PrescriptionChat threadId={p.id} />
      </div>
    </div>
  );
}
