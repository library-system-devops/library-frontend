import {Typography} from "@mui/material";

function ValidationMessage({ message }) {
    return message ? (
        <Typography color="error" variant="caption" sx={{ ml: 1 }}>
            {message}
        </Typography>
    ) : null;
}