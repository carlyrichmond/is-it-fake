import { Client } from '@elastic/elasticsearch-serverless';

const classificationsIndex = 'classifications';
const userClassificationsIndex = 'user-classifications'

const endpoint = process.env.ELASTIC_URL || '';
const apiKey = process.env.ELASTIC_API_KEY || '';

const client = new Client({
    node: endpoint,
    auth: { apiKey: apiKey },
});

/**
 * Get a random image from the classifications index
 * @returns url and category of randomly returned image
 */
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

/**
 * Adds manual classification from user gameplay to the index
 * @param { username, timestamp, imageUrl, expectedCategory, userCategory } userClassification 
 * @returns 
 */
export async function saveUserClassification(userClassification) {
    return await client.index({
        index: userClassificationsIndex,
        document: userClassification
    });
}