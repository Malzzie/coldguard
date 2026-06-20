// Login page for ColdGuard
// Allows users to authenticate using the backend JWT service.

import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  // Stores email entered by the user
  const [email, setEmail] = useState("");

  // Stores password entered by the user
  const [password, setPassword] = useState("");

  // Stores authentication error messages
  const [error, setError] = useState("");

  // Handle login form submission
  const handleSubmit = async (e) => {

    // Prevent page refresh
    e.preventDefault();

    // Clear previous error messages
    setError("");

    try {

      // Send login request to backend
      const result = await login(
        email,
        password
      );

      // Store JWT token
      localStorage.setItem(
         "token",
         result.access_token
      );

      // Login successful
      console.log("Login successful");
      console.log(result);

      // Redirect user to dashboard
      navigate("/dashboard");

    } catch (err) {

      // Display login error message
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow">
            <div className="card-body">

              <h2 className="text-center mb-4">
                🧊 ColdGuard Login
              </h2>

              <form onSubmit={handleSubmit}>

                <p className="text-center text-muted mb-4">
                  Smart Cold Storage Monitoring System
                </p>

                {/* Email Address Field */}
                <div className="mb-3">
                  <label className="form-label d-block text-start">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label d-block text-start">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                {/* Authentication Error Message */}
                {error && (
                  <div className="mb-3">
                    <small className="text-danger">
                      {error}
                    </small>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Sign In
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;