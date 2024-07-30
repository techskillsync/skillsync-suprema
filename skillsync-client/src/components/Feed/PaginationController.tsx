import React from "react";

const PaginationController = ({
    handlePageChange,
    currentPage,
    totalPages,
}: {
    handlePageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
}) => {
    const renderPageNumbers = () => {
        const pageNumbers: JSX.Element[] = [];
        const maxPageNumbersToShow = 5; // Adjust this number as needed
        const halfMaxPageNumbersToShow = Math.floor((maxPageNumbersToShow - 2) / 2); // -2 for first and last pages

        if (totalPages <= maxPageNumbersToShow) {
            // Show all pages if total pages are less than or equal to max pages to show
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${currentPage === i ? "active" : ""} bg-transparent`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Always show the first page
            pageNumbers.push(
                <button key={1} onClick={() => handlePageChange(1)} className="bg-transparent">
                    1
                </button>
            );

            let startPage = Math.max(2, currentPage - halfMaxPageNumbersToShow);
            let endPage = Math.min(totalPages - 1, currentPage + halfMaxPageNumbersToShow);

            if (currentPage <= halfMaxPageNumbersToShow + 1) {
                endPage = maxPageNumbersToShow - 2;
            } else if (currentPage + halfMaxPageNumbersToShow >= totalPages - 1) {
                startPage = totalPages - maxPageNumbersToShow + 3;
            }

            if (startPage > 2) {
                pageNumbers.push(
                    <button key="start-ellipsis" disabled className="bg-transparent">
                        ...
                    </button>
                );
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${currentPage === i ? "active" : ""} bg-transparent`}
                    >
                        {i}
                    </button>
                );
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <button key="end-ellipsis" disabled className="bg-transparent">
                        ...
                    </button>
                );
            }

            // Always show the last page
            pageNumbers.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="bg-transparent">
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="pagination !mx-auto !text-white">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-transparent"
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-transparent"
            >
                Next
            </button>
        </div>
    );
};

export default PaginationController;