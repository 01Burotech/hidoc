"use client";
import { useQuery, gql } from "@apollo/client";
import { PHARMACIES_NEARBY } from "../../../graphql/queries";

export default function PharmacyDashboard() {
  const { data, loading, error } = useQuery(PHARMACIES_NEARBY, {
    variables: { lat: 6.370774, lng: 2.394587, radiusKm: 5 },
  });
  console.log("GraphQL data:", data);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pharmacie</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Adresse</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.pharmaciesNearby.map((p: any) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.nom}</td>
              <td className="border px-2 py-1">{p.adresse}</td>
              <td className="border px-2 py-1">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
