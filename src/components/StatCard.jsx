function StatCard({
  label,
  value,
  icon: Icon,
  iconClass = 'text-violet-400',
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        {Icon && <Icon className={iconClass} size={28} />}
      </div>
    </div>
  )
}

export default StatCard