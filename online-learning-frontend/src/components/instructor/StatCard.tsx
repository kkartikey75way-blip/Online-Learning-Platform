interface StatCardProps {
    label: string;
    value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-indigo-900">{value}</p>
        </div>
    );
}
