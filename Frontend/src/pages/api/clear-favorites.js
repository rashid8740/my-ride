export default async function handler(req, res) {
  try {
    // This approach directly clears local favorites from the user document
    console.log("Starting local favorites clearing process...");
    
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
    const token = loginData.data && loginData.data.token;
    
    if (!token) {
      throw new Error("No token received from login");
    }
    
    console.log("Admin login successful, received token");
    
    // Step 2: Make request to update user document directly
    const userId = '67ebe847f71e2f6d318ee74f'; // Admin user ID
    const updateResponse = await fetch(`http://localhost:5000/api/users/${userId}/clear-local-favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const responseText = await updateResponse.text();
    console.log(`Update response status: ${updateResponse.status}`);
    console.log(`Raw response: ${responseText}`);
    
    let updateData;
    try {
      updateData = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing response:", e);
      updateData = { raw: responseText };
    }
    
    if (updateResponse.ok) {
      return res.status(200).json({
        success: true,
        message: "Successfully cleared local favorites",
        data: updateData
      });
    } else {
      return res.status(updateResponse.status).json({
        success: false,
        message: "Failed to clear local favorites",
        data: updateData
      });
    }
    
  } catch (error) {
    console.error("Error in clear-favorites:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred",
      stack: error.stack
    });
  }
} 