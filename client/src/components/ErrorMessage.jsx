import React from 'react';

function ErrorMessage({message}){
    return (
        <div style={{ color: 'red', fontSize: '14px' }}>
            {message}
        </div>
    );
};

export default ErrorMessage;
