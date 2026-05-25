function FilterBar({
  filter,
  setFilter
}) {

  return (

    <select
      value={filter}
      onChange={(e) =>
        setFilter(e.target.value)
      }
      className="filter-bar"
    >

      <option value="">
        All Status
      </option>

      <option value="Scheduled">
        Scheduled
      </option>

      <option value="Completed">
        Completed
      </option>

      <option value="Cancelled">
        Cancelled
      </option>

      <option value="Missed">
        Missed
      </option>

    </select>
  )
}

export default FilterBar