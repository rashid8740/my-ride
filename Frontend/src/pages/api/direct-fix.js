export default async function handler(req, res) {
  try {
    // The car ID to update
    const carId = '67f1826a4d0870549fe6f515';
    
    // Hardcoded Cloudinary URLs (without any extra quotes or characters)
    const cloudinaryUrls = [
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880807/my-ride/cars/n0tbglnjqhxr8i9djknn.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880806/my-ride/cars/hdohua7ueoaexnvjd2fw.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880288/my-ride/cars/xctfqqzwciza04cb2nkl.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880282/my-ride/cars/pbolveboi5euurqwaisc.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879987/my-ride/cars/boucidflcyleeovsquje.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879984/my-ride/cars/zj0ycau0w4hm3rhstcia.png"
    ];
    
    // Format images for the car update
    const images = cloudinaryUrls.map(url => ({ url }));
    
    // Configure API URL (using cars not vehicles)
    const backendUrl = 'http://localhost:5000';
    
    // First, get the current car data
    console.log(`Fetching current data for car ${carId}...`);
    const getUrl = `${backendUrl}/api/cars/${carId}`;
    
    const carResponse = await fetch(getUrl);
    if (!carResponse.ok) {
      throw new Error(`Car does not exist: ${carResponse.status}`);
    }
    
    let carData;
    try {
      carData = await carResponse.json();
      console.log("Current car data:", JSON.stringify(carData));
    } catch (error) {
      console.error("Error parsing car JSON:", error);
      throw new Error("Failed to parse car data");
    }
    
    // Update the car with the images
    console.log(`Updating car ${carId} with ${images.length} images...`);
    const updateUrl = `${backendUrl}/api/cars/${carId}`;
    
    console.log("Update URL:", updateUrl);
    console.log("Update payload:", JSON.stringify({ images }));
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images })
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error(`Error response from server: ${errorText}`);
      throw new Error(`Failed to update car: ${updateResponse.status}`);
    }
    
    let updateData;
    try {
      updateData = await updateResponse.json();
    } catch (error) {
      console.error("Error parsing update JSON:", error);
      throw new Error("Failed to parse update response");
    }
    
    return res.status(200).json({
      status: 'success',
      message: `Successfully updated car with ${images.length} images`,
      carId,
      imageCount: images.length,
      data: updateData
    });
  } catch (error) {
    console.error('Error fixing car images:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while fixing car images',
      stack: error.stack
    });
  }
} 