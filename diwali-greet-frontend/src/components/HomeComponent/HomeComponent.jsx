import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useRef } from "react";
import axios from "axios";
import HOC from "../../hoc/HigherOrderComponent";
import Stack from "@mui/material/Stack";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";

const language = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Hinglish", label: "Hinglish" },
];

const tones = [
  { value: "Formal", label: "Formal" },
  { value: "Informal", label: "Informal" },
];

const diyaDataURL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23E65100' d='M10 80 Q 50 100 90 80 Q 50 60 10 80 Z'/%3E%3Cpath fill='%23FF9800' d='M50 50 Q 60 30 50 10 Q 40 30 50 50 Z'/%3E%3Cpath fill='%23FFEB3B' d='M50 45 Q 55 30 50 20 Q 45 30 50 45 Z'/%3E%3C/svg%3E";

function HomeComponent() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiVersion = import.meta.env.VITE_APP_API_VERSION;

  const [form, setForm] = useState({
    receiptName: "",
    language: "English",
    tone: "Formal",
  });

  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingImage, setIsCreatingImage] = useState(false);

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseText("");

    axios
      .post(`${apiUrl}/${apiVersion}/gemini/generate`, form, {
        withCredentials: true,
      })
      .then((res) => {
        setResponseText(res.data.message || res.data);
      })
      .catch((err) => {
        console.log("❌ Error:", err.response?.data || err.message);
        setResponseText("Sorry, something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const generateCardBlob = () => {
    return new Promise((resolve) => {
      const textContent = document.getElementById("response-text-content");
      if (!textContent) return resolve(null);

      const cardToDownload = document.createElement("div");
      cardToDownload.style.display = "grid";
      cardToDownload.style.gridTemplateColumns = "50px 1fr 50px";
      cardToDownload.style.gridTemplateRows = "50px 1fr 50px";
      cardToDownload.style.background =
        "linear-gradient(135deg, #ffdf7e, #ff9a3c)";
      cardToDownload.style.color = "#000000";
      cardToDownload.style.width = "650px";
      cardToDownload.style.borderRadius = "16px";
      cardToDownload.style.position = "relative";
      cardToDownload.style.overflow = "hidden";
      cardToDownload.style.padding = "20px";
      cardToDownload.style.boxSizing = "border-box";

      const textElement = document.createElement("div");
      textElement.style.fontFamily = "Poppins, sans-serif";
      textElement.style.fontSize = "18px";
      textElement.style.lineHeight = "1.7";
      textElement.style.whiteSpace = "pre-line";
      textElement.innerHTML = textContent.innerHTML;
      textElement.style.gridColumn = "1 / 4";
      textElement.style.gridRow = "2 / 3";
      textElement.style.padding = "0 20px";
      cardToDownload.appendChild(textElement);

      const createDiya = () => {
        const diya = document.createElement("div");
        diya.style.width = "40px";
        diya.style.height = "40px";
        diya.style.backgroundImage = `url("${diyaDataURL}")`;
        diya.style.backgroundSize = "contain";
        diya.style.backgroundRepeat = "no-repeat";
        diya.style.backgroundPosition = "center";
        return diya;
      };

      const topLeft = createDiya();
      topLeft.style.gridColumn = "1 / 2";
      topLeft.style.gridRow = "1 / 2";
      cardToDownload.appendChild(topLeft);

      const topRight = createDiya();
      topRight.style.gridColumn = "3 / 4";
      topRight.style.gridRow = "1 / 2";
      topRight.style.alignSelf = "flex-start";
      topRight.style.justifySelf = "flex-end";
      cardToDownload.appendChild(topRight);

      const bottomLeft = createDiya();
      bottomLeft.style.gridColumn = "1 / 2";
      bottomLeft.style.gridRow = "3 / 4";
      bottomLeft.style.alignSelf = "flex-end";
      bottomLeft.style.justifySelf = "flex-start";
      cardToDownload.appendChild(bottomLeft);

      const bottomRight = createDiya();
      bottomRight.style.gridColumn = "3 / 4";
      bottomRight.style.gridRow = "3 / 4";
      bottomRight.style.alignSelf = "flex-end";
      bottomRight.style.justifySelf = "flex-end";
      cardToDownload.appendChild(bottomRight);

      cardToDownload.style.position = "absolute";
      cardToDownload.style.left = "-9999px";
      document.body.appendChild(cardToDownload);

      setTimeout(() => {
        html2canvas(cardToDownload, {
          useCORS: true,
          backgroundColor: "#ffffff",
        }).then((canvas) => {
          document.body.removeChild(cardToDownload);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/png");
        });
      }, 100);
    });
  };

  const handleShare = async () => {
    setIsCreatingImage(true);
    const blob = await generateCardBlob();
    if (!blob) {
      setIsCreatingImage(false);
      return;
    }

    const file = new File([blob], "diwali-greeting.png", { type: "image/png" });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Diwali Greeting",
          text: "Here's the Diwali greeting I made for you!",
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(responseText);
        alert(
          "Greeting copied to clipboard! (Image sharing not supported on this browser)"
        );
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
    setIsCreatingImage(false);
  };

  const handleDownload = async () => {
    setIsCreatingImage(true);
    const blob = await generateCardBlob();
    if (!blob) {
      setIsCreatingImage(false);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diwali-greeting-card.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsCreatingImage(false);
  };

  return (
    <main>
      <div className="form-card">
        <h2 style={{ marginBottom: "25px", fontWeight: 600 }}>
          Create Your Personalized Greeting
        </h2>
        <form
          onSubmit={handleGenerate}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Recipient Name"
            variant="outlined"
            onChange={handleChange("receiptName")}
            disabled={isLoading}
          />
          <TextField
            select
            label="Language"
            defaultValue="English"
            onChange={handleChange("language")}
            slotProps={{ select: { native: true } }}
            style={{ minWidth: "140px" }}
            disabled={isLoading}
          >
            {language.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            select
            label="Tone"
            defaultValue="Formal"
            onChange={handleChange("tone")}
            slotProps={{ select: { native: true } }}
            style={{ minWidth: "140px" }}
            disabled={isLoading}
          >
            {tones.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            className="generate-btn"
            variant="contained"
            type="submit"
            disabled={isLoading}
            style={{
              padding: "14px 25px",
              background: "#ff8c00",
              fontWeight: 600,
            }}
          >
            {isLoading ? "Generating..." : "Generate ✨"}
          </Button>
        </form>
      </div>

      <div
        className="form-card response-card"
        style={{
          textAlign: "left",
          animation: responseText ? "cardPopIn 0.5s ease-out" : "none",
        }}
      >
        <h3
          id="response-title"
          style={{
            fontWeight: 600,
            color: "#ff8c00",
            borderBottom: "2px solid #ffdf7e",
            paddingBottom: "5px",
          }}
        >
          Your Message:
        </h3>

        <div
          id="response-text-content"
          className="response-text"
          style={{
            fontSize: "18px",
            lineHeight: "1.7",
            marginTop: "15px",
            color: responseText ? "#333" : "#999",
            whiteSpace: "pre-line",
          }}
        >
          {responseText ? (
            <ReactMarkdown>{responseText}</ReactMarkdown>
          ) : (
            "Click 'Generate' to see your message appear here."
          )}
        </div>

        {responseText && !isLoading && (
          <Stack
            id="action-buttons"
            direction="row"
            spacing={1}
            style={{ marginTop: "20px", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={isCreatingImage}
            >
              {isCreatingImage ? "Wait..." : "Share"}
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={isCreatingImage}
            >
              {isCreatingImage ? "Wait..." : "Download Card"}
            </Button>
          </Stack>
        )}
      </div>
    </main>
  );
}

export default HOC(HomeComponent);
