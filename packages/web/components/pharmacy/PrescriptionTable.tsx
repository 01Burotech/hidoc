"use client";
import { Dispatch, SetStateAction } from "react";

export default function PrescriptionTable({ prescriptions, onSelect }: { prescriptions: any[], onSelect: Dispatch<SetStateAction<string | null>> }) {
  return (
    <table className="w-full table-auto border">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Patient</th>
          <th className="border px-2 py-1">Doctor</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions?.map(p => (
          <tr key={p.id} className="cursor-pointer hover:bg-gray-100" onClick={()=>onSelect(p.id)}>
            <td className="border px-2 py-1">{p.id}</td>
            <td className="border px-2 py-1">{p.patient.userId}</td>
            <td className="border px-2 py-1">{p.doctor.userId}</td>
            <td className="border px-2 py-1">{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
