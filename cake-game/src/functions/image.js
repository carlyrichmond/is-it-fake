import { getRandomImage } from "../util/elasticsearch";
import { convertRequest, generateResponse } from "../util/helper";

/**
 * Get a random image
 * Note: Netlify deploys this function at the endpoint /.netlify/functions/image
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function handler(event, context) {
  try {
    const response = await getRandomImage();

    const result = response.hits.hits[0]._source;

    console.log(result);
    return generateResponse(200, result);
  } catch (e) {
    console.log(e);

    return generateResponse(500, e);
  }
}
