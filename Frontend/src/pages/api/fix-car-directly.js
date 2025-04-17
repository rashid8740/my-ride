export default async function handler(req, res) {
  // This is a simpler direct fix approach
  try {
    const carId = '67f1826a4d0870549fe6f515';
    
    // Clean, verified Cloudinary URLs
    const images = [
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880807/my-ride/cars/n0tbglnjqhxr8i9djknn.png" },
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880806/my-ride/cars/hdohua7ueoaexnvjd2fw.png" },
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880288/my-ride/cars/xctfqqzwciza04cb2nkl.png" },
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880282/my-ride/cars/pbolveboi5euurqwaisc.png" },
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879987/my-ride/cars/boucidflcyleeovsquje.png" },
      { url: "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879984/my-ride/cars/zj0ycau0w4hm3rhstcia.png" }
    ];
    
    console.log("Attempting to update car with these images:", JSON.stringify(images));
    
    // Use the native Node.js http module for most direct approach
    const http = require('http');
    
    // Create the request options
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/cars/${carId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Create a promise to handle the HTTP request
    const updateCar = new Promise((resolve, reject) => {
      const req = http.request(options, (response) => {
        let data = '';
        
        // A chunk of data has been received
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        // The whole response has been received
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              console.error("Error parsing response:", e);
              resolve({ rawResponse: data });
            }
          } else {
            reject({
              statusCode: response.statusCode,
              body: data
            });
          }
        });
      });
      
      // Handle request errors
      req.on('error', (error) => {
        console.error("Request error:", error);
        reject(error);
      });
      
      // Write data to request body
      req.write(JSON.stringify({ images }));
      req.end();
    });
    
    // Execute the update
    try {
      const result = await updateCar;
      return res.status(200).json({
        success: true,
        message: `Successfully updated car with ${images.length} images`,
        data: result
      });
    } catch (error) {
      console.error("Update failed:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update car",
        error: error
      });
    }
    
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred",
      error: error.message
    });
  }
} 