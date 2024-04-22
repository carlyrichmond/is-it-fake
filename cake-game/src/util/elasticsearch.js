import { Client } from '@elastic/elasticsearch-serverless';

const classificationsIndex = 'classifications';
const userClassificationsIndex = 'user-classifications';
const pipeline = 'add-classifications-to-gameplay';


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
 * @param { game_id, username, timestamp, image_url, expected_category, user_category } userClassification 
 * @returns 
 */
export async function saveUserClassification(userClassification) {
    return await client.index({
        index: userClassificationsIndex,
        document: userClassification,
        pipeline: pipeline
    });
}

/**
 * 
 * @param { username, game_ud} gameMetadata 
 * @returns 
 */
export async function getGameResults(gameMetadata) {
    return await client.search({
        index: userClassificationsIndex,
        _source: ["image_url", "expected_category", "user_category", "models"], 
        query: {
            match: {
                game_id: gameMetadata.game_id
            }
        }
    });
}