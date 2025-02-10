// Do your work here...
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const storageKey = "bookshelfData";

  function getBooks() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  }

  function saveBooks(books) {
    localStorage.setItem(storageKey, JSON.stringify(books));
  }

  function renderBooks(books = getBooks()) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.dataset.bookid = book.id;
      bookElement.dataset.testid = "bookItem";
      bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${
            book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
          }</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

      bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => toggleBookStatus(book.id));
      bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => deleteBook(book.id));
      bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => editBook(book.id));

      book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
    });
  }

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    
    const books = getBooks();
    books.push({ id: Date.now(), title, author, year, isComplete });
    saveBooks(books);
    renderBooks();
    bookForm.reset();
  }

  function toggleBookStatus(id) {
    const books = getBooks();
    const book = books.find((b) => b.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks(books);
      renderBooks();
    }
  }

  function deleteBook(id) {
    const books = getBooks().filter((b) => b.id !== id);
    saveBooks(books);
    renderBooks();
  }

  function editBook(id) {
    const books = getBooks();
    const book = books.find((b) => b.id === id);
    if (book) {
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;
      deleteBook(id);
    }
  }

  function searchBooks(event) {
    event.preventDefault();
    const query = document.getElementById("searchBookTitle").value.toLowerCase();
    const books = getBooks().filter((book) => book.title.toLowerCase().includes(query));
    renderBooks(books);
  }

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBooks);

  renderBooks();
});