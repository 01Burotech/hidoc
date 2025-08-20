"use client";
export default function PrintLabelButton({ pdfUrl }: { pdfUrl: string }) {
  const handlePrint = () => {
    window.open(pdfUrl, "_blank");
  };
  return <button onClick={handlePrint} className="px-2 py-1 bg-gray-700 text-white rounded">Imprimer étiquette</button>;
}
