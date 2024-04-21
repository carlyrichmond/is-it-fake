import { Client } from '@elastic/elasticsearch';

const classificationsIndex = 'classifications';

const endpoint = process.env.ELASTIC_URL || '';
//const cloudId = process.env.ELASTIC_CLOUD_ID || '';
const apiKey = process.env.ELASTIC_API_KEY || '';

const client = new Client({
    node: endpoint,
    auth: { apiKey: apiKey },
});

export async function getRandomImage() {
    return await client.search({
        index: classificationsIndex,
        _source: ["image_url", "category"], 
        size: 1,
        query: {
            function_score: {
                query: {
                    match_all: {}
                },
                random_score: {}
            }
        }
    });
}