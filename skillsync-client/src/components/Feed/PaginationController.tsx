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
    return (
        <div className="pagination !mx-auto !text-white">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-transparent"
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
                if (totalPages <= 5) {
                    return (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`${
                                currentPage === index + 1 ? "active" : ""
                            } bg-transparent`}
                        >
                            {index + 1}
                        </button>
                    );
                } else {
                    if (
                        index === 0 ||
                        index === totalPages - 1 ||
                        (index >= currentPage - 2 && index <= currentPage + 2)
                    ) {
                        return (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`${
                                    currentPage === index + 1 ? "active" : ""
                                } bg-transparent`}
                            >
                                {index + 1}
                            </button>
                        );
                    } else if (index === currentPage - 3 || index === currentPage + 3) {
                        return (
                            <button key={index} disabled className="bg-transparent">
                                ...
                            </button>
                        );
                    } else {
                        return null;
                    }
                }
            })}
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
