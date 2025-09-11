import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';

// Import environment variables
import {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_ENDPOINT,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME
} from '$env/static/private';

// Create an S3 client configured for Cloudflare R2
const S3 = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});

export async function POST({ request }) {
    try {
        const { fileName, fileType, userId } = await request.json();

        const fileExtension = fileType.split('/')[1] || 'png';
        const newFileName = `${userId}/${fileName}.${fileExtension}`;

        if (!fileName || !fileType) {
            return json({ error: 'Missing fileName or fileType' }, { status: 400 });
        }

        // Create the command to put an object in the R2 bucket
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: newFileName,
            ContentType: fileType,
        });

        // Generate the pre-signed URL, valid for 5 minutes
        const signedUrl = await getSignedUrl(S3, command, { expiresIn: 300 });

        return json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}