import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchBook } from './components/SearchBook';
import { Pagination } from '../Utils/Pagination';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerStage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    // Called when SearchBookPage is frist time loaded or Each time 'currentPage' change
    // Get data for SearchBookPage
    useEffect(() => {
        // Get 9 books from API for SearchBookPage
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books`;
            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                });
            }

            setBooks(loadedBooks);
            setLoading(false);
        };

        // Check if there is any error
        fetchBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        });

        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    // Loading text displayed when data is not loaded
    if (isLoading) {
        return <SpinnerLoading />;
    }

    // If there is an error with calling the API, this text will appear
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;

    let lastItem =
        booksPerPage * currentPage <= totalAmountOfBooks
            ? booksPerPage * currentPage
            : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const searchHandleChange = () => {
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(
                `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`
            );
        }
        setCurrentPage(1);
        setCategorySelection('Book category');
    };

    const categoryField = (value: string) => {
        if (
            value === 'Front End' ||
            value === 'Back End' ||
            value === 'Data' ||
            value === 'DevOps'
        ) {
            setCategorySelection(value);

            if (value === 'Front End') value = 'fe';
            if (value === 'Back End') value = 'be';

            setSearchUrl(
                `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
            );
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }

        setCurrentPage(1);
    };

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-labelledby="Search"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-success"
                                    onClick={() => searchHandleChange()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {categorySelection}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => categoryField('All')}>
                                        <a className="dropdown-item" href="#">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Front End')}>
                                        <a className="dropdown-item" href="#">
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Back End')}>
                                        <a className="dropdown-item" href="#">
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Data')}>
                                        <a className="dropdown-item" href="#">
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('DevOps')}>
                                        <a className="dropdown-item" href="#">
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ? (
                        <>
                            <div className="mt-3">
                                <h5>Number of results: {totalPages}</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map((book) => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    paginate={paginate}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <div className="m-5">
                                <h3>Can't find what you are looking for?</h3>
                                <a
                                    type="button"
                                    href="#"
                                    className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                                >
                                    Library Services
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
