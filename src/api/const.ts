const isProduction =false;

const PROD_URL = "https://saasco-tracking.onrender.com/api/v1";
const DEV_URL = "http://localhost:7001/api/v1";

export const baseUrl = isProduction ? PROD_URL : DEV_URL;
export const LocalUrl = isProduction ? PROD_URL : DEV_URL;


// http://localhost:7000/api/v1
//  "https://backend.magicmusicuae.com/api/v1";

// https://tracking.magicmusicuae.com:7000/api/v1  this one final

// https://trackingapp-backend-fksa.onrender.com/api/v1

// https://trackingapp-backend-fksa.onrender.com/api/v1

// https://saasco-tracking.onrender.com