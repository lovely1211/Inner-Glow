import React from 'react';

const Share = () => {
    // Define the link to be shared
    const link = window.location.href; 

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    url: link,
                });
                console.log('Shared successfully');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(link);
            alert('Link copied to clipboard');
        }
    };

    return (
        <div>
            <button onClick={handleShare}>
                Share
            </button>
        </div>
    );
};

export default Share;
