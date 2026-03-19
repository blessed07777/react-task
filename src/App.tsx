import React, { useState } from "react";

type WeatherData = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

const API_KEY = "d885fb899bc444d6a15122410252304";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Введите название города");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
          city
        )}&lang=ru`
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data?.error?.message || "Ошибка загрузки данных");
      }

      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Не удалось получить погоду");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ebd5, #9face6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Погода по городу
        </h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Введите город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            onClick={getWeather}
            style={{
              padding: "12px 16px",
              border: "none",
              borderRadius: "10px",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Найти
          </button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#555" }}>Загрузка...</p>
        )}

        {error && (
          <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {weather && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              borderRadius: "15px",
              background: "#f8fafc",
            }}
          >
            <h2>
              {weather.location.name}, {weather.location.country}
            </h2>
            <p style={{ color: "#666" }}>
              Местное время: {weather.location.localtime}
            </p>

            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
            />

            <h3 style={{ fontSize: "36px", margin: "10px 0" }}>
              {weather.current.temp_c}°C
            </h3>
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
              {weather.current.condition.text}
            </p>

            <div style={{ textAlign: "left", marginTop: "15px" }}>
              <p>Ощущается как: {weather.current.feelslike_c}°C</p>
              <p>Влажность: {weather.current.humidity}%</p>
              <p>Ветер: {weather.current.wind_kph} км/ч</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}