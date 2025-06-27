import { getGameResults } from "../util/elasticsearch";
import { convertRequest, generateResponse } from "../util/helper";

/**
 * Get a random image
 * Note: Netlify deploys this function at the endpoint /.netlify/functions/image
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function handler(event, context) {
  const gameMetadata = convertRequest(event.body);

  try {
    const response = await getGameResults(gameMetadata);
    const results = response.hits.hits.flatMap((document) => {
      return document._source;
    });

    return generateResponse(200, results);
  } catch (e) {
    console.log(e);

    return generateResponse(500, e);
  }
}
