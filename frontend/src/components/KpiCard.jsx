export default function KpiCard({ title, value }) {
  return (
    <div className="backdrop-blur-lg bg-white/70 border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}