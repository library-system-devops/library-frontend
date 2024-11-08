import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Alert,
    Typography,
    MenuItem,
    Tooltip
} from '@mui/material';
import { X, Info } from 'lucide-react';
import bookService from '../../services/bookService';
import loanPolicyService from '../../services/loanPolicyService';

export default function EditBookDialog({ book, open, onClose, onBookUpdated }) {
    const [formData, setFormData] = useState({
        title: '',
        publishedDate: '',
        description: '',
        copiesOwned: 0,
        policyType: 'BOOK'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [policies, setPolicies] = useState([]);
    const [policyDetails, setPolicyDetails] = useState({});

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                publishedDate: book.publishedDate || '',
                description: book.description || '',
                copiesOwned: book.copiesOwned || 0,
                policyType: book.policyType || 'BOOK'
            });
        }
    }, [book]);

    useEffect(() => {
        if (open) {
            fetchPolicies();
        }
    }, [open]);

    const fetchPolicies = async () => {
        try {
            const policiesData = await loanPolicyService.getAllPolicies();
            console.log('Fetched policies:', policiesData);
            if (!policiesData || policiesData.length === 0) {
                console.error('No policies returned from server');
                return;
            }
            setPolicies(policiesData);

            // Create a lookup object for policy details
            const policyLookup = {};
            policiesData.forEach(policy => {
                policyLookup[policy.itemType] = {
                    loanPeriodDays: policy.loanPeriodDays,
                    maxRenewals: policy.maxRenewals,
                    gracePeriodDays: policy.gracePeriodDays,
                    description: policy.description
                };
            });
            setPolicyDetails(policyLookup);
        } catch (err) {
            console.error('Failed to fetch loan policies:', err);
            setError('Failed to load loan policies');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First update general book information
            const updatedBook = await bookService.updateBook(book.id, {
                ...book,
                title: formData.title,
                publishedDate: formData.publishedDate,
                description: formData.description,
                policyType: formData.policyType
            });

            // Then update inventory if copies owned has changed
            if (formData.copiesOwned !== book.copiesOwned) {
                const inventoryUpdated = await bookService.updateInventory(
                    book.id,
                    parseInt(formData.copiesOwned)
                );
                onBookUpdated(inventoryUpdated);
            } else {
                onBookUpdated(updatedBook);
            }

            onClose();
        } catch (err) {
            setError(err.response?.data || 'Failed to update book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPolicyTooltip = (policyType) => {
        const policy = policyDetails[policyType];
        if (!policy) return 'Loading policy details...';

        return `Loan Period: ${policy.loanPeriodDays} days
Maximum Renewals: ${policy.maxRenewals}
Grace Period: ${policy.gracePeriodDays} days
${policy.description || ''}`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex justify-between items-center">
                Edit Book
                <IconButton onClick={onClose} size="small">
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <Box className="space-y-4">
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Published Date"
                            name="publishedDate"
                            value={formData.publishedDate}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            disabled={loading}
                        />

                        <Box>
                            <Typography variant="subtitle2" className="mb-2">
                                Inventory Management
                            </Typography>
                            <TextField
                                fullWidth
                                label="Copies Owned"
                                name="copiesOwned"
                                type="number"
                                value={formData.copiesOwned}
                                onChange={handleChange}
                                disabled={loading}
                                inputProps={{ min: book?.copiesOwned - book?.copiesAvailable }}
                                helperText={`Currently ${book?.copiesAvailable} copies available. Cannot reduce below ${book?.copiesOwned - book?.copiesAvailable} (copies on loan).`}
                            />
                        </Box>

                        <Box className="flex items-center gap-2">
                            <TextField
                                select
                                fullWidth
                                label="Loan Policy"
                                name="policyType"
                                value={formData.policyType}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                {policies.map((policy) => (
                                    <MenuItem key={policy.itemType} value={policy.itemType}>
                                        {policy.itemType.replace(/_/g, ' ')}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Tooltip title={getPolicyTooltip(formData.policyType)}>
                                <IconButton size="small">
                                    <Info className="w-4 h-4" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {policies.length === 0 && (
                            <Typography color="error" variant="caption">
                                No loan policies available
                            </Typography>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions className="p-4">
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}