import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import {
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_ENDPOINT,
	R2_BUCKET_NAME
} from '$env/static/private';

const client = new S3Client({
	endpoint: R2_ENDPOINT,
	region: 'auto',
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

export async function POST({ request }) {
	const { userId } = await request.json();

	// 1. List objects
	const listCmd = new ListObjectsV2Command({
		Bucket: R2_BUCKET_NAME,
		Prefix: `${userId}/`
	});
	const listResult = await client.send(listCmd);
	const files = listResult.Contents?.map((obj) => obj.Key) || [];

	// 2. Generate signed URLs
	const signedUrls = await Promise.all(
		files.map(async (key) => {
			const getCmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
			return {
				key,
				url: await getSignedUrl(client, getCmd, { expiresIn: 3600 }) // 1 hour
			};
		})
	);

	return new Response(JSON.stringify(signedUrls), { status: 200 });
}
