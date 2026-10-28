import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export const PagiPageCount = ({ pageCount, setStartOffset, itemsPerPage }) => {
  const pageChangeHandler = (e) => setStartOffset(e.selected * itemsPerPage);
  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageCount={pageCount}
      onPageChange={pageChangeHandler}
      pageRangeDisplayed={1}
      marginPagesDisplayed={1}
      containerClassName="pagination pagination-sm justify-content-end flex-wrap"
      pageClassName="page-item"
      pageLinkClassName="page-link theme-clr"
      nextClassName="page-item"
      nextLinkClassName="page-link shadow-none theme-clr"
      previousClassName="page-item"
      previousLinkClassName="page-link shadow-none theme-clr"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      activeLinkClassName="shadow-none"
    />
  );
};

export const PagiSearch = ({
  setSearch,
  setStartOffset,
  totalEntries,
  setTableDataStatus,
  totalAmount,
  allColumns,
  visibleColumns,
  handleColumnToggle,
}) => {
  const [changeVal, setChangeVal] = useState(0);

  useEffect(() => {
    if (totalEntries < 1) {
      setTableDataStatus("Not Found");
    }
  }, [changeVal]);

  const searchHandler = (e) => {
    setSearch(e.target.value);
    setChangeVal(e.target.value);
    setStartOffset(0);
    document
      .querySelector(".pagination")
      .children[1].querySelector("a")
      .click();
  };
  // console.log(totalAmount)

  return (
    // <div className="row">
    //   <div className="col-sm-12 col-md-8 col-lg-8 col-xl-9">
    //     <div className="d-sm-flex">
    //       <h6 className="me-3">TOTAL ENTRIES :- {totalEntries}</h6>
    //       {totalAmount !== undefined ? (
    //         <h6>TOTAL AMOUNT :- {totalAmount}</h6>
    //       ) : (
    //         ""
    //       )}
    //     </div>
    //   </div>
    //   <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
    //     <input
    //       type="search"
    //       className="form-control form-control-sm shadow-none"
    //       placeholder="Search.."
    //       onChange={searchHandler}
    //     />
    //   </div>

    //   <div className="dropdown mb-3">
    //     <button
    //       className="btn btn-secondary dropdown-toggle"
    //       type="button"
    //       data-bs-toggle="dropdown"
    //       aria-expanded="false"
    //     >
    //       Select Columns
    //     </button>
    //     <ul
    //       className="dropdown-menu p-2"
    //       style={{ maxHeight: "300px", overflowY: "auto" }}
    //     >
    //       {allColumns.map((col) => (
    //         <li key={col.key} className="dropdown-item">
    //           <div className="form-check">
    //             <input
    //               className="form-check-input"
    //               type="checkbox"
    //               checked={visibleColumns.includes(col.key)}
    //               onChange={() => handleColumnToggle(col.key)}
    //               id={`check-${col.key}`}
    //             />
    //             <label
    //               className="form-check-label ms-2"
    //               htmlFor={`check-${col.key}`}
    //             >
    //               {col.label}
    //             </label>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>

    <div
      className="row align-items-center justify-content-between "
      style={{ paddingRight: 0 }}
    >
      {/* Left Section: Total Entries & Total Amount */}
      <div className="col-12 col-lg-5 mb-2 mb-lg-0">
        <div className="d-flex flex-wrap align-items-center">
          <h6 className="me-3 mb-0">TOTAL ENTRIES :- {totalEntries}</h6>
          {totalAmount !== undefined && (
            <h6 className="mb-0">TOTAL AMOUNT :- {totalAmount}</h6>
          )}
        </div>
      </div>

      {/* Middle Section: Search Input */}
      <div
        className="col-12 col-lg-4 mb-2 mb-lg-0 d-flex gap-2 "
        style={{ paddingRight: 0 }}
      >
        <input
          type="search"
          className="form-control form-control-sm shadow-none"
          placeholder="Search.."
          onChange={searchHandler}
        />
        {/* </div> */}

        {/* Right Section: Dropdown */}
        {/* <div className="col-12 col-lg-2"> */}
        <div className="dropdown" style={{ marginRight: "15px" }}>
          <button
            className="btn btn-secondary p-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ background: "#6163ad" }}
          >
            <i
              class="bi bi-caret-down-fill"
              style={{ fontSize: "20px", margin: "10px" }}
            ></i>
          </button>
          <ul
            className="dropdown-menu p-2"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {allColumns?.map((col) => (
              <li key={col.key} className="dropdown-item">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => handleColumnToggle(col.key)}
                    id={`check-${col.key}`}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor={`check-${col.key}`}
                  >
                    {col.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const SortTableHeader = ({ text, change }) => {
  return (
    <label role="button">
      <input type="checkbox" className="d-none" onChange={change} />
      {text}{" "}
      <i
        className="fa-solid fa-up-down ms-1"
        style={{ fontSize: "12px", color: "#8f8f8f" }}
      ></i>
    </label>
  );
};
