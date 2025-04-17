export default async function handler(req, res) {
  try {
    // This approach first logs in as admin to get a token
    console.log("Starting authenticated fix process...");
    
    // Step 1: Login as admin to get a token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@myride.com',
        password: 'Admin@123'
      })
    });
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error("Login failed:", errorText);
      throw new Error(`Admin login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log("Login response:", JSON.stringify(loginData));
    
    // Token is inside data object, not directly in the response
    const token = loginData.data && loginData.data.token;
    
    if (!token) {
      throw new Error("No token received from login");
    }
    
    console.log("Admin login successful, received token");
    
    // Step 2: Get car details to confirm it exists
    const carId = '67f1826a4d0870549fe6f515';
    const getCarResponse = await fetch(`http://localhost:5000/api/cars/${carId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!getCarResponse.ok) {
      const errorText = await getCarResponse.text();
      console.error("Car fetch failed:", errorText);
      throw new Error(`Failed to get car: ${getCarResponse.status}`);
    }
    
    const carData = await getCarResponse.json();
    console.log("Retrieved car data:", JSON.stringify(carData.data));
    
    // Step 3: Update the car with images
    const cloudinaryUrls = [
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880807/my-ride/cars/n0tbglnjqhxr8i9djknn.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880806/my-ride/cars/hdohua7ueoaexnvjd2fw.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880288/my-ride/cars/xctfqqzwciza04cb2nkl.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880282/my-ride/cars/pbolveboi5euurqwaisc.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879987/my-ride/cars/boucidflcyleeovsquje.png",
      "https://res.cloudinary.com/dghr3juaj/image/upload/v1743879984/my-ride/cars/zj0ycau0w4hm3rhstcia.png"
    ];
    
    const images = cloudinaryUrls.map(url => ({ 
      url,
      isMain: false
    }));
    
    // Set the first image as main
    if (images.length > 0) {
      images[0].isMain = true;
    }
    
    console.log(`Updating car ${carId} with ${images.length} images...`);
    
    const updateResponse = await fetch(`http://localhost:5000/api/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ images })
    });
    
    const responseText = await updateResponse.text();
    console.log(`Update response status: ${updateResponse.status}`);
    console.log(`Raw response: ${responseText}`);
    
    let updateData;
    try {
      updateData = JSON.parse(responseText);
      console.log("Parsed update response:", updateData);
    } catch (e) {
      console.error("Error parsing response:", e);
      updateData = { raw: responseText };
    }
    
    if (updateResponse.ok) {
      return res.status(200).json({
        success: true,
        message: `Successfully updated car with ${images.length} images`,
        data: updateData
      });
    } else {
      return res.status(updateResponse.status).json({
        success: false,
        message: "Failed to update car",
        data: updateData
      });
    }
    
  } catch (error) {
    console.error("Error in auth-fix:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred",
      stack: error.stack
    });
  }
} 