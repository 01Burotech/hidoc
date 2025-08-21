"use client";
import KycList from "../../../components/admin/KycList";
import SpecialitiesCrud from "../../../components/admin/SpecialitiesCrud";
import PaymentsDisputes from "../../../components/admin/PaymentsDisputes";

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Vérification KYC</h2>
        <KycList />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gestion des spécialités & tarifs</h2>
        <SpecialitiesCrud />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Litiges paiements</h2>
        <PaymentsDisputes />
      </section>
    </div>
  );
}
