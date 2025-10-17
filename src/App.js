import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "UNC QR Code Generator";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShowQR(false);

    if (!/^https?:\/\/.+\..+/.test(url)) {
      setError("❌ Invalid URL format. Please enter a valid http or https URL.");
      return;
    }

    if (/patient|name|dob|email|ssn|mrn|phone/i.test(url)) {
      setError("⚠️ PHI detected in the URL. Please remove sensitive patient information.");
      return;
    }

    setShowQR(true);
  };

  const sanitizeFilename = (url) => {
    const parsedUrl = new URL(url);
    let filename = `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/[^a-zA-Z0-9]/g, '-');
    if (filename.startsWith('-')) {
      filename = filename.substring(1);
    }
    return filename || 'qr-code';
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;

    // Sanitize URL to create a filename
    const filename = sanitizeFilename(url);
    link.download = `${filename}.png`;
    link.click();
  };

  return (
    <div
      className="overlay"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/unc-health-bg.jpg'})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="qr-box text-center">
        <h3 className="mb-3">UNC Health</h3>
        <h4 className="mb-4">QR Code Generator</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group mb-5">
            <input
              type="text"
              className="form-control"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Generate QR Code
            </button>
          </div>
          <div className="warning-text">
            ⚠️ Please do not include any personal identifiers (e.g. name, DOB, email, patient ID, etc.) in the URL.
          </div>
        </form>

        {showQR && (
          <div className="mb-4">
            <h5>Your QR Code:</h5>
            <QRCodeCanvas value={url} size={256} />
            <div className="btn-group mt-3">
              <button className="btn btn-success" onClick={handleDownload}>
                Download QR Code
              </button>
              <button className="btn btn-secondary" onClick={() => setShowQR(false)}>
                New QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;