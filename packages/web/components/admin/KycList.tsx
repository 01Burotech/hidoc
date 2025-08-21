"use client";
import { useQuery, gql, useMutation } from "@apollo/client";

const KYC_QUERY = gql`
  query KycProfiles {
    users(filterKyc: true) {
      id
      role
      email
      kycStatus
    }
  }
`;

const UPDATE_KYC = gql`
  mutation UpdateKyc($id: ID!, $status: String!) {
    updateKycStatus(id: $id, status: $status) {
      id
      kycStatus
    }
  }
`;

export default function KycList() {
  const { data, refetch } = useQuery(KYC_QUERY);
  const [updateKyc] = useMutation(UPDATE_KYC);

  const toggleKyc = async (id: string, current: string) => {
    const newStatus = current === "verified" ? "pending" : "verified";
    await updateKyc({ variables: { id, status: newStatus } });
    refetch();
  };

  return (
    <table className="w-full table-auto border">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Role</th>
          <th className="border px-2 py-1">KYC</th>
          <th className="border px-2 py-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.users.map((u:any) => (
          <tr key={u.id} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{u.id}</td>
            <td className="border px-2 py-1">{u.email}</td>
            <td className="border px-2 py-1">{u.role}</td>
            <td className="border px-2 py-1">{u.kycStatus}</td>
            <td className="border px-2 py-1">
              <button
                onClick={() => toggleKyc(u.id, u.kycStatus)}
                className="px-2 py-1 bg-blue-600 text-white rounded"
              >
                {u.kycStatus === "verified" ? "Désactiver" : "Activer"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
