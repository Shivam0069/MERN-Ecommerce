import jwt from "jsonwebtoken";

// Function to check if the token is valid
function isTokenValid(token: string) {
  try {
    console.log(token);
    const tokenSecret =
      process.env.TOKEN_SECRET || "abcdefghijklmnopqrstuvwxyz";

    const decoded = jwt.verify(token, tokenSecret); // Replace with your actual secret key
    console.log("Decoded Token:", decoded);
    return true;
  } catch (err) {
    console.error("Token verification failed:", err);
    return false;
  }
}

export function isLoggedIn() {
  const token = localStorage.getItem("token"); // Fetch the token from local storage
  if (!token) {
    console.log("No token found. User is not logged in.");
    return false;
  }
  if (!isTokenValid(token)) {
    console.log("Invalid token. User is not logged in.");
    return false;
  }
  console.log("User is logged in.");
  return true;
}
