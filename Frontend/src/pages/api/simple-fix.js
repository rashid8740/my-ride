export default async function handler(req, res) {
  try {
    // Simple approach with maximum logging
    const carId = '67f1826a4d0870549fe6f515';
    
    // Clean, verified Cloudinary URLs, one item at a time
    const imageUrl = "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880807/my-ride/cars/n0tbglnjqhxr8i9djknn.png";
    const images = [{ url: imageUrl }];
    
    console.log(`Starting simple fix for car ${carId} with image: ${imageUrl}`);
    
    // Backend URL
    const backendUrl = 'http://localhost:5000';
    const updateUrl = `${backendUrl}/api/cars/${carId}`;
    
    console.log(`Making PUT request to ${updateUrl}`);
    console.log(`Request payload: ${JSON.stringify({ images })}`);
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images })
    });
    
    console.log(`Response status: ${updateResponse.status}`);
    const responseText = await updateResponse.text();
    console.log(`Raw response text: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("Parsed response:", responseData);
    } catch (error) {
      console.error("Error parsing response:", error);
      responseData = { rawText: responseText };
    }
    
    if (updateResponse.ok) {
      return res.status(200).json({
        success: true,
        message: "Image update successful",
        responseData
      });
    } else {
      return res.status(updateResponse.status).json({
        success: false,
        message: "Image update failed",
        responseData
      });
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
      stack: error.stack
    });
  }
} 