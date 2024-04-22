import { saveUserClassification } from "../util/elasticsearch";
import { convertRequest, generateResponse } from "../util/helper";

/**
 * Get a random image
 * Note: Netlify deploys this function at the endpoint /.netlify/functions/image
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function handler(event, context) {
  const userClassification = convertRequest(event.body);

  try {
    const response = await saveUserClassification(userClassification);

    if (response) {
      return generateResponse(200, 'Classification saved');
    }
  } catch (e) {
    console.log(e);

    return generateResponse(500, e);
  }
}
