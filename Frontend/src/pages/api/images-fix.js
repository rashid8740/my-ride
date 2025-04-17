export default async function handler(req, res) {
  try {
    // This approach uses the dedicated car images endpoint
    console.log("Starting images-fix process...");
    
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
    
    // Step 2: Send images to the car images endpoint
    const carId = '67f1826a4d0870549fe6f515';
    
    // Single test image for troubleshooting
    const imageUrl = "https://res.cloudinary.com/dghr3juaj/image/upload/v1743880807/my-ride/cars/n0tbglnjqhxr8i9djknn.png";
    
    // Create FormData with the image
    const formData = new FormData();
    
    // Create a Blob from the image URL
    const imageBlob = await fetch(imageUrl).then(r => r.blob());
    
    // Add the image file to FormData
    formData.append('images', new File([imageBlob], 'car_image.png', { type: 'image/png' }));
    
    console.log(`Uploading 1 image to car ${carId}...`);
    
    const updateResponse = await fetch(`http://localhost:5000/api/cars/${carId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type with FormData - it sets the boundary automatically
      },
      body: formData
    });
    
    const responseText = await updateResponse.text();
    console.log(`Upload response status: ${updateResponse.status}`);
    console.log(`Raw response: ${responseText}`);
    
    let updateData;
    try {
      updateData = JSON.parse(responseText);
      console.log("Parsed upload response:", updateData);
    } catch (e) {
      console.error("Error parsing response:", e);
      updateData = { raw: responseText };
    }
    
    if (updateResponse.ok) {
      return res.status(200).json({
        success: true,
        message: "Successfully uploaded car image",
        data: updateData
      });
    } else {
      return res.status(updateResponse.status).json({
        success: false,
        message: "Failed to upload car image",
        data: updateData
      });
    }
    
  } catch (error) {
    console.error("Error in images-fix:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred",
      stack: error.stack
    });
  }
} 