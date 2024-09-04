import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [textTyping, setTextTyping] = useState("");
  const [debouncedText, setDebouncedText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(textTyping);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [textTyping]);

  // Memoize filtered results to avoid redundant calculations
  const filteredData = useMemo(() => {
    if (debouncedText) {
      return data.filter((user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(debouncedText.toLowerCase())
      );
    }
    return data;
  }, [data, debouncedText]);

  return (
    <>
      <div className="input">
        <input
          className="search"
          placeholder="Search"
          value={textTyping}
          onChange={(e) => setTextTyping(e.target.value)}
        />
      </div>

      {filteredData.map(({ id, title, body }) => (
        <div className="grid-main" key={id}>
          <h1>{id}</h1>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </>
  );
};

export default App;
