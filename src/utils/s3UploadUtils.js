export async function getPresignedUrl(fileName) {
    const response = await fetch('/api/presigned-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
    });
    const data = await response.json();
    return data.presignedUrl;
}

export async function uploadFileToS3(file, presignedUrl) {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (response.ok) {
        // presigned URL에서 실제 S3 URL 추출
        const s3Url = presignedUrl.split('?')[0];
        return s3Url;
    } else {
        throw new Error('File upload failed');
    }
}

export async function getImageFromS3(imageKey) {
    try {
        const response = await fetch(`/api/get-image?key=${encodeURIComponent(imageKey)}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching image from S3:', error);
        throw error;
    }
}