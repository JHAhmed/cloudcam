import { json } from '@sveltejs/kit';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

const s3 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});

export async function POST({ request }) {
  const { fileKey } = await request.json(); // Assume you pass name for disposition

  if (!fileKey) {
    return json({ error: 'Missing fileKey' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${fileKey}"`
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiry

    return json({ signedUrl });
  } catch (error) {
    console.error('Signed URL error:', error);
    return json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}