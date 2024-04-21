export function generateResponse(statusCode, data) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
  };
}

export function convertRequest(data) {
  return JSON.parse(data);
}
