import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Box,
  Typography,
  Chip,
  TablePagination,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { PlusCircle, Pencil, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/bookService';
import AddBookDialog from './AddBookDialog';
import EditBookDialog from './EditBookDialog';
import ReserveBookDialog from '../reservations/ReserveBookDialog';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookForReserve, setSelectedBookForReserve] = useState(null);
  const { userRole, isAuthenticated } = useAuth();

  const isStaff = userRole === 'ADMIN' || userRole === 'LIBRARIAN';

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditDialogOpen(true);
  };

  const handleReserveClick = (book) => {
    setSelectedBookForReserve(book);
    setReserveDialogOpen(true);
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks(prevBooks =>
        prevBooks.map(book =>
            book.id === updatedBook.id ? updatedBook : book
        )
    );
  };

  const handleReservationSuccess = () => {
    fetchBooks(); // Refresh the book list to update availability
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const getAvailabilityChip = (book) => {
    if (book.copiesOwned === 0) {
      return <Chip label="Discontinued" color="error" size="small" />;
    } else if (book.copiesAvailable > 0) {
      return <Chip label="Available" color="success" size="small" />;
    } else {
      return <Chip label="All Copies Loaned" color="warning" size="small" />;
    }
  };

  const getBookActions = (book) => {
    if (!isAuthenticated) {
      return null;
    }

    return (
        <Box className="flex gap-2">
          {isStaff && (
              <Tooltip title="Edit book">
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(book)}
                >
                  <Pencil className="w-4 h-4" />
                </IconButton>
              </Tooltip>
          )}

          {book.copiesAvailable === 0 && userRole === 'MEMBER' && (
              <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleReserveClick(book)}
              >
                Reserve
              </Button>
          )}
        </Box>
    );
  };

  const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.authors && Array.from(book.authors).some(author =>
          author.toLowerCase().includes(search.toLowerCase())
      ))
  );

  if (loading) {
    return (
        <Box className="flex items-center justify-center p-4">
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Box className="p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" component="h2">
            Book Collection
          </Typography>
          {isStaff && (
              <Button
                  startIcon={<PlusCircle className="w-4 h-4" />}
                  variant="contained"
                  color="primary"
                  onClick={() => setAddDialogOpen(true)}
              >
                Add Book
              </Button>
          )}
        </Box>

        {error && (
            <Alert severity="error" className="mb-4" onClose={() => setError('')}>
              {error}
            </Alert>
        )}

        <Box className="mb-4">
          <TextField
              fullWidth
              variant="outlined"
              placeholder="Search books..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <Search className="w-4 h-4 mr-2 text-gray-500" />
              }}
              size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Copies</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <Typography variant="body2" className="font-medium">
                            {book.title}
                          </Typography>
                          {book.authors && book.authors.size > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                by {Array.from(book.authors).join(', ')}
                              </Typography>
                          )}
                        </TableCell>
                        <TableCell>{book.publishedDate}</TableCell>
                        <TableCell>
                          {book.averageRating ? (
                              <span>{book.averageRating.toFixed(1)} ({book.ratingsCount})</span>
                          ) : (
                              'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography
                              variant="body2"
                              className="max-w-md truncate"
                              title={book.description}
                          >
                            {book.description || 'No description available'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {book.copiesAvailable} / {book.copiesOwned}
                        </TableCell>
                        <TableCell>{getAvailabilityChip(book)}</TableCell>
                        <TableCell>{getBookActions(book)}</TableCell>
                      </TableRow>
                  ))}
            </TableBody>
          </Table>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
          />
        </TableContainer>

        {/* Add Book Dialog */}
        <AddBookDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            onBookAdded={handleBookAdded}
        />

        {/* Edit Book Dialog */}
        <EditBookDialog
            book={selectedBook}
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedBook(null);
            }}
            onBookUpdated={handleBookUpdated}
        />

        {/* Reserve Book Dialog */}
        <ReserveBookDialog
            book={selectedBookForReserve}
            open={reserveDialogOpen}
            onClose={() => {
              setReserveDialogOpen(false);
              setSelectedBookForReserve(null);
            }}
            onSuccess={handleReservationSuccess}
        />
      </Box>
  );
}