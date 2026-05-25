function AnalyticsCard({
  title,
  value
}) {

  return (

    <div className="analytics-card">

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>
  )
}

export default AnalyticsCard