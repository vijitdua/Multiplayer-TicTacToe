import React, {useEffect, useState} from 'react';
import {Alert, Fade, Box} from "@mui/material";

function ErrorMessage(props) {
    const [shouldRender, setShouldRender] = useState(true);
    const timeoutMilliseconds = 10*1000; //Total render time, including fade

    useEffect(() => {
        setShouldRender(true); // Ensure the component should render when errID or message changes

        const renderTimer = setTimeout(() => {
            setShouldRender(false)
        }, timeoutMilliseconds);

        return () => clearTimeout(renderTimer);
    }, [props.errID, props.message]);

    if (!shouldRender) {
        return null;
    }

    return (
        <Fade in={shouldRender} timeout={500}>
            <Box>
                <Alert severity="error">{props.message}</Alert>
            </Box>
        </Fade>
    );


}

export default ErrorMessage;
