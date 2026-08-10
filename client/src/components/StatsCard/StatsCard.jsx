import './StatsCard.css'

function StatsCard({ label, value, icon }) {
  return (
    <div className="stats-card">
      {icon && <div className="stats-icon">{icon}</div>}
      <div>
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </div>
  )
}

export default StatsCard
