const stats = [
  { name: 'Total Fungible Tokens', stat: 0 },
  { name: 'Total Non-Fungible Tokens', stat: 0 },
  { name: 'Total Dividend Load', stat: 0 },
]

const EntityStats = () => {
  return (
    <div>
      <dl className="grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default EntityStats
