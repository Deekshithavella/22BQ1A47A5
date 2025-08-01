// Logger.mjs
const Logger = async (stack, level, pkg, message) => {
  const url = "http://20.244.56.144/evaluation-service/logs";

  const payload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmJxYTE0NzYyQHZ2aXQubmV0IiwiZXhwIjoxNzU0MDI4NTMyLCJpYXQiOjE3NTQwMjc2MzIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMjlkMjNlZi00MDI4LTQ2YWUtYmY1NC1mNGYwYjc1ODNjZTIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoaW1hdmFudGggbXV0dGUiLCJzdWIiOiIxYWQ5MzQ5MC1jMmFkLTQwMTMtODEwMi05NTJiYjA4ZGU1MjgifSwiZW1haWwiOiIyMmJxYTE0NzYyQHZ2aXQubmV0IiwibmFtZSI6ImhpbWF2YW50aCBtdXR0ZSIsInJvbGxObyI6IjIyYnFhMWE0NzYyIiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiMWFkOTM0OTAtYzJhZC00MDEzLTgxMDItOTUyYmIwOGRlNTI4IiwiY2xpZW50U2VjcmV0IjoieEFEdlJGcG1KQWJ4UFl0TSJ9.Tr80FaNjONc-dcYNi5sJGNa8-y641jA3geKj6vd8SyY",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Log sent:", result);
  } catch (error) {
    console.error("Logging failed:", error.message);
  }
};

export default Logger;
