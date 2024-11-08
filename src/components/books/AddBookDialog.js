import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material';
import { Search, Plus, X } from 'lucide-react';
import bookService from '../../services/bookService';

export default function AddBookDialog({ open, onClose, onBookAdded }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setSearching(true);
            setError('');
            const results = await bookService.searchBooks(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('Failed to search books. Please try again.');
            setSearchResults(null);
        } finally {
            setSearching(false);
        }
    };

    const handleAddBook = async (book) => {
        try {
            setAdding(true);
            setError('');
            const addedBook = await bookService.createBook(book);
            onBookAdded(addedBook);
            setError('');
            onClose();
        } catch (err) {
            setError(err.response?.data || 'Failed to add book. It might already exist in the library.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className="flex justify-between items-center">
                Add Book from Google Books
                <IconButton onClick={onClose} size="small">
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <TextField
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, author, or ISBN..."
                        disabled={searching}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={searching}
                        startIcon={<Search className="w-4 h-4" />}
                    >
                        Search
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {searching && (
                    <Box className="flex justify-center my-4">
                        <CircularProgress />
                    </Box>
                )}

                {searchResults && (
                    <Box className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
                        {searchResults.items?.map((book) => (
                            <Card key={book.id} variant="outlined">
                                <CardContent className="flex gap-4">
                                    {book.volumeInfo.imageLinks?.thumbnail && (
                                        <img
                                            src={book.volumeInfo.imageLinks.thumbnail}
                                            alt={book.volumeInfo.title}
                                            className="w-24 h-32 object-cover"
                                        />
                                    )}
                                    <Box>
                                        <Typography variant="h6" className="font-medium">
                                            {book.volumeInfo.title}
                                        </Typography>
                                        {book.volumeInfo.authors?.length > 0 && (
                                            <Typography variant="body2" color="text.secondary">
                                                by {book.volumeInfo.authors.join(', ')}
                                            </Typography>
                                        )}
                                        {book.volumeInfo.publishedDate && (
                                            <Typography variant="body2" color="text.secondary">
                                                Published: {book.volumeInfo.publishedDate}
                                            </Typography>
                                        )}
                                        {book.volumeInfo.description && (
                                            <Typography
                                                variant="body2"
                                                className="mt-2 line-clamp-2"
                                                title={book.volumeInfo.description}
                                            >
                                                {book.volumeInfo.description}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions className="justify-end">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        onClick={() => handleAddBook(book)}
                                        disabled={adding}
                                    >
                                        Add to Library
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                        {searchResults.items?.length === 0 && (
                            <Typography color="text.secondary" className="text-center py-4">
                                No books found matching your search.
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}