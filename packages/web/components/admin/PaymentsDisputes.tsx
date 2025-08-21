"use client";
import { useQuery, gql } from "@apollo/client";

const DISPUTES_QUERY = gql`
  query PaymentDisputes {
    paymentDisputes {
      id
      patient { userId }
      doctor { userId }
      amount
      currency
      status
      reason
      createdAt
    }
  }
`;

export default function PaymentsDisputes() {
  const { data } = useQuery(DISPUTES_QUERY);

  return (
    <table className="w-full table-auto border">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Patient</th>
          <th className="border px-2 py-1">Doctor</th>
          <th className="border px-2 py-1">Montant</th>
          <th className="border px-2 py-1">Status</th>
          <th className="border px-2 py-1">Motif</th>
        </tr>
      </thead>
      <tbody>
        {data?.paymentDisputes.map((d:any)=>(
          <tr key={d.id} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{d.id}</td>
            <td className="border px-2 py-1">{d.patient.userId}</td>
            <td className="border px-2 py-1">{d.doctor.userId}</td>
            <td className="border px-2 py-1">{d.amount} {d.currency}</td>
            <td className="border px-2 py-1">{d.status}</td>
            <td className="border px-2 py-1">{d.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
