export default function Input({ label, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${className}`}
        {...props}
      />
    </div>
  )
}
