import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemSecondaryAction,
    Chip,
    CircularProgress,
    Box,
    Typography, Alert
} from '@mui/material';
import { Search } from 'lucide-react';
import bookService from '../../services/bookService';

export default function BookSelectionDialog({ open, onClose, onBookSelected }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchBooks();
        } else {
            setSearchQuery('');
            setError('');
        }
    }, [open]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await bookService.getAllBooks();
            setBooks(response);
        } catch (error) {
            setError('Failed to fetch books');
            console.error('Failed to fetch books:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAvailabilityChip = (book) => {
        if (book.copiesAvailable > 0) {
            return <Chip
                label={`${book.copiesAvailable} available`}
                color="success"
                size="small"
            />;
        }
        return <Chip label="Not Available" color="error" size="small" />;
    };

    const getPublishedYear = (publishedDate) => {
        if (!publishedDate) return 'Year unknown';
        return publishedDate.substring(0, 4);
    };

    const filteredBooks = searchQuery.trim() === '' ? books : books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.authors && Array.from(book.authors).some(author =>
            author.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );

    const formatAuthors = (authors) => {
        if (!authors || authors.size === 0) return 'Unknown Author';
        const authorArray = Array.from(authors);

        if (authorArray.length === 1) return authorArray[0];
        if (authorArray.length === 2) return `${authorArray[0]} and ${authorArray[1]}`;

        return authorArray.slice(0, -1).join(', ') + ', and ' + authorArray[authorArray.length - 1];
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle>Select Book</DialogTitle>
            <DialogContent>
                <Box className="space-y-4 pt-2">
                    <TextField
                        fullWidth
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search className="w-4 h-4 mr-2 text-gray-500" />
                        }}
                    />

                    {error && (
                        <Alert severity="error" className="mt-2">
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box className="flex justify-center p-4">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List className="max-h-96 overflow-y-auto">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <ListItem
                                        key={book.id}
                                        button
                                        onClick={() => onBookSelected(book)}
                                        disabled={book.copiesAvailable === 0}
                                        sx={{
                                            borderBottom: '1px solid #eee',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            },
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                            py: 2
                                        }}
                                    >
                                        <Box className="w-full pr-16 relative">
                                            <Typography variant="subtitle1" component="div">
                                                {book.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{
                                                    mt: 0.5,
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                by {formatAuthors(book.authors)}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                Published: {getPublishedYear(book.publishedDate)}
                                            </Typography>

                                            {book.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {book.description}
                                                </Typography>
                                            )}

                                            <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                                                {getAvailabilityChip(book)}
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <Typography color="text.secondary">
                                        {searchQuery ? "No books match your search" : "No books available"}
                                    </Typography>
                                </ListItem>
                            )}
                        </List>
                    )}
                    </Box>
                </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}