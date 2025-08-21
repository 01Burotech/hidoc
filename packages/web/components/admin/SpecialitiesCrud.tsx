"use client";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";

const SPECIALITIES_QUERY = gql`
  query Specialities {
    specialities {
      id
      name
      baseTarif
      weekendPremium
    }
  }
`;

const UPSERT_SPECIALITY = gql`
  mutation UpsertSpeciality($id: ID, $name: String!, $baseTarif: Float!, $weekendPremium: Float!) {
    upsertSpeciality(input: {id:$id, name:$name, baseTarif:$baseTarif, weekendPremium:$weekendPremium}) {
      id
      name
    }
  }
`;

const DELETE_SPECIALITY = gql`
  mutation DeleteSpeciality($id: ID!) {
    deleteSpeciality(id:$id) { id }
  }
`;

export default function SpecialitiesCrud() {
  const { data, refetch } = useQuery(SPECIALITIES_QUERY);
  const [upsert] = useMutation(UPSERT_SPECIALITY);
  const [del] = useMutation(DELETE_SPECIALITY);
  const [form, setForm] = useState({id:null,name:'',baseTarif:0,weekendPremium:0});

  const save = async () => {
    await upsert({ variables: form });
    refetch();
    setForm({id:null,name:'',baseTarif:0,weekendPremium:0});
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-1 rounded"/>
        <input type="number" placeholder="Tarif" value={form.baseTarif} onChange={e=>setForm({...form,baseTarif:parseFloat(e.target.value)})} className="border p-1 rounded"/>
        <input type="number" placeholder="Maj Week-end %" value={form.weekendPremium} onChange={e=>setForm({...form,weekendPremium:parseFloat(e.target.value)})} className="border p-1 rounded"/>
        <button onClick={save} className="px-2 py-1 bg-green-600 text-white rounded">Sauver</button>
      </div>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Base Tarif</th>
            <th className="border px-2 py-1">Maj Week-end</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.specialities.map((s:any) => (
            <tr key={s.id} className="hover:bg-gray-100">
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.baseTarif}</td>
              <td className="border px-2 py-1">{s.weekendPremium}%</td>
              <td className="border px-2 py-1 flex gap-2">
                <button onClick={()=>setForm({...s})} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={async()=>{await del({variables:{id:s.id}}); refetch();}} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
