import { Component } from "react";
import "./index.css";
import Logger from "./Logger.mjs"; // Custom Logger for frontend

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",           // Input from the user
      shortUrls: [],     // Array to store shortened URLs
    };
  }

  // Handles input changes in the text field
  handleChange = (event) => {
    this.setState({ url: event.target.value });
  };

  // Sends URL to backend to shorten it
  handleShorten = async () => {
    const { url, shortUrls } = this.state;
    if (url.trim() === "") return;

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await response.json();

      if (response.ok) {
        const newEntry = {
          original: url,
          short: data.shortUrl,
        };

        // Update state with new short URL
        this.setState({
          shortUrls: [newEntry, ...shortUrls],
          url: "",
        });

        Logger("frontend", "info", "component", "URL shortened and added to UI");
      } else {
        Logger("frontend", "error", "component", `Error shortening: ${data.message}`);
        alert("Failed to shorten URL");
      }
    } catch (err) {
      Logger("frontend", "error", "component", `Exception: ${err.message}`);
      alert("An error occurred while shortening the URL.");
    }
  };

  // Copies short URL to clipboard
  handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      alert("Copy failed!");
    }
  };

  // Opens short URL in new tab
  handleVisit = (url) => {
    // Adjust URL for local development
    const shortPath = url.split("/").pop();
    window.open(`http://localhost:5000/${shortPath}`, "_blank");
  };

  render() {
    const { url, shortUrls } = this.state;

    return (
      <div className="url-shortener-container">
        <h1>URL Shortener</h1>

        {/* Input section */}
        <div className="input-section">
          <input
            type="url"
            placeholder="Enter long URL here..."
            value={url}
            onChange={this.handleChange}
          />
          <button onClick={this.handleShorten}>Shorten</button>
        </div>

        {/* Display short URLs */}
        <div className="url-list">
          {shortUrls.map((item, index) => (
            <div key={index} className="url-card">
              <div className="url-info">
                <p className="original-url">{item.original}</p>
                <p className="short-url">{item.short}</p>
              </div>
              <div className="url-actions">
                <button onClick={() => this.handleCopy(item.short)}>Copy</button>
                <button onClick={() => this.handleVisit(item.short)}>Visit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
