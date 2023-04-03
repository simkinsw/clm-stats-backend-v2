export const responseBuilder = (payload: string, statusCode = 200) => {
    return {
      statusCode,
      body: JSON.stringify({ payload })
    };
};