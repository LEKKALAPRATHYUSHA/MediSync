function SearchBar({
  search,
  setSearch,
  placeholder
}) {

  return (

    <input
      type="text"
      placeholder={placeholder}
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="search-bar"
    />
  )
}

export default SearchBar