import { json } from '@sveltejs/kit';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
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
  const { fileKey } = await request.json();

  if (!fileKey || typeof fileKey !== 'string' || fileKey.trim() === '') {
    return json({ error: 'Missing or invalid fileKey' }, { status: 400 });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey
    });

    await s3.send(command); // actually perform the delete

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return json({ error: 'Failed to delete object' }, { status: 500 });
  }
}
