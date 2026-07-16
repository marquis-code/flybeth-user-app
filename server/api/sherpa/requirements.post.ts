export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  
  if (!config.sherpaApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Sherpa API Key is missing from environment variables',
    });
  }

  const { origin, destination, passport, departureDate, arrivalDate } = body;

  if (!origin || !destination || !passport || !departureDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters',
    });
  }

  try {
    const response = await $fetch('https://api-sandbox.joinsherpa.com/v3/trips?include=restriction,procedure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'x-api-key': config.sherpaApiKey,
      },
      body: {
        data: {
          type: "TRIP",
          attributes: {
            locale: "en-US",
            traveller: {
              passports: [passport]
            },
            currency: "USD",
            travelNodes: [
              {
                type: "ORIGIN",
                airportCode: origin,
                departure: {
                  date: departureDate,
                  time: "12:00", // Defaulting time
                  travelMode: "AIR"
                }
              },
              {
                type: "DESTINATION",
                airportCode: destination,
                arrival: {
                  date: arrivalDate || departureDate,
                  time: "14:00",
                  travelMode: "AIR"
                }
              }
            ]
          }
        }
      }
    });

    return response;
  } catch (err: any) {
    console.error('Sherpa API Error:', err);
    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.message || 'Error fetching Sherpa API',
      data: err.data
    });
  }
});
