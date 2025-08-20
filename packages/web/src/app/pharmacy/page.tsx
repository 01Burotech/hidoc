import { useQuery, gql } from "@apollo/client";

const PHARMACIES_QUERY = gql`
  query PharmaciesNearby($lat: Float!, $lng: Float!) {
    pharmaciesNearby(lat: $lat, lng: $lng) {
      id
      nom
      adresse
      status
    }
  }
`;

export default function PharmacyDashboard() {
  const { data } = useQuery(PHARMACIES_QUERY, { variables: { lat: 48.8566, lng: 2.3522 } });

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
