import React from "react";

function Get_Quotes() {
  const [quotes, setQuotes] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [quote, setQuote] = React.useState("");
  const [author, setAuthor] = React.useState("");

  const timeoutRef = React.useRef(null);

  const api_url = "http://localhost:5000/api/quotes";

  const fetchQuotes = async () => {
    try {
      const response = await fetch(api_url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("quotes", JSON.stringify(data));
        localStorage.setItem("index", "0");

        setQuotes(data);
        setIndex(0);
        setQuote(data[0].q);
        setAuthor(data[0].a);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const changeQuote = (i) => {
    const nextIndex = index + 1;
    if (nextIndex >= quotes.length) {
      fetchQuotes(api_url);
    } else if (i === "+") {
      setIndex(nextIndex);
      localStorage.setItem("index", nextIndex.toString());

      const next = quotes[nextIndex];
      setQuote(next.q || "No quote available");
      setAuthor(next.a || "Unknown Author");
    } else if (i === "-") {
      if (index <= 0) {
        return; // Prevent going below index 0
      }
      setIndex(index - 1);
      localStorage.setItem("index", (index - 1).toString());
      const prev = quotes[index - 1];
      setQuote(prev.q || "No quote available");
      setAuthor(prev.a || "Unknown Author");
    }
  };

  React.useEffect(() => {
    const savedQuotes = localStorage.getItem("quotes");
    const savedIndex = parseInt(localStorage.getItem("index") || "0", 10);

    if (savedQuotes) {
      const parsed = JSON.parse(savedQuotes);
      setQuotes(parsed);
      setIndex(savedIndex);
      setQuote(parsed[savedIndex]?.q || "No quote");
      setAuthor(parsed[savedIndex]?.a || "Unknown");
    } else {
      fetchQuotes(api_url);
    }
  }, []);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      changeQuote("+");
    }, 60000); // 60000 ms = 1 minutes

    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <div className="container">
      <div
        className="button-container prev"
        onClick={() => changeQuote("-")}
      ></div>
      <div className="quote-container">
        <div className="quote-box">
          <h1>{quote}</h1>
          <span>- {author}</span>
        </div>
      </div>
      <div
        className="button-container next"
        onClick={() => changeQuote("+")}
      ></div>
    </div>
  );
}

export default Get_Quotes;
