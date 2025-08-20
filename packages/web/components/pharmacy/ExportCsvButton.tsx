"use client";
export default function ExportCsvButton({ prescriptionId }: { prescriptionId: string }) {
  const handleExport = () => {
    fetch(`/api/pharmacy/${prescriptionId}/export-csv`).then(res=>res.blob()).then(blob=>{
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dispatch_${prescriptionId}.csv`;
      a.click();
    });
  };
  return <button onClick={handleExport} className="px-2 py-1 bg-gray-700 text-white rounded">Exporter CSV</button>;
}
