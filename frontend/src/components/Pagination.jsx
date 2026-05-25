function Pagination({
  currentPage,
  totalPages,
  setCurrentPage
}) {

  return (

    <div className="pagination">

      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(
            currentPage - 1
          )
        }
      >
        Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          setCurrentPage(
            currentPage + 1
          )
        }
      >
        Next
      </button>

    </div>
  )
}

export default Pagination