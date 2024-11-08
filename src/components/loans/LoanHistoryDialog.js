import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    TimelineDot
} from '@mui/lab';
import { format } from 'date-fns';
import { Calendar, RefreshCw, ArrowDownCircle } from 'lucide-react';

export default function LoanHistoryDialog({ loan, open, onClose }) {
    if (!loan) return null;

    // Create base events array with checkout event
    const baseEvents = [
        {
            date: loan.loanDate,
            type: 'checkout',
            label: 'Checked Out',
            icon: <ArrowDownCircle className="w-4 h-4" />
        }
    ];

    // Add renewal events if they exist
    const renewalEvents = loan.renewalHistory ?
        loan.renewalHistory.map(renewal => ({
            date: renewal.renewalDate,
            type: 'renewal',
            label: 'Renewed',
            reason: renewal.reason,
            renewedBy: renewal.renewedBy,
            newDueDate: renewal.newDueDate,
            icon: <RefreshCw className="w-4 h-4" />
        })) : [];

    // Add return event if it exists
    const returnEvent = loan.returnDate ? [{
        date: loan.returnDate,
        type: 'return',
        label: 'Returned',
        icon: <Calendar className="w-4 h-4" />
    }] : [];

    // Combine all events and sort them
    const events = [...baseEvents, ...renewalEvents, ...returnEvent]
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Loan History</DialogTitle>
            <DialogContent>
                <Box className="mt-2">
                    <Typography variant="subtitle1" gutterBottom>
                        {loan.bookTitle}
                    </Typography>

                    <Timeline>
                        {events.map((event, index) => (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent className="flex-none w-32">
                                    <Typography variant="caption">
                                        {format(new Date(event.date), 'MMM dd, yyyy')}
                                    </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot color={
                                        event.type === 'checkout' ? 'primary' :
                                            event.type === 'renewal' ? 'info' : 'success'
                                    }>
                                        {event.icon}
                                    </TimelineDot>
                                    {index < events.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography variant="body2">
                                        {event.label}
                                    </Typography>
                                    {event.type === 'renewal' && (
                                        <>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                New due date: {format(new Date(event.newDueDate), 'MMM dd, yyyy')}
                                            </Typography>
                                            {event.reason && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Reason: {event.reason}
                                                </Typography>
                                            )}
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Renewed by: {event.renewedBy}
                                            </Typography>
                                        </>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}