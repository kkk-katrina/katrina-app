import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

interface WeatherApiResponse {
    weather: Weather[];
    main: MainWeatherData;
}

export default function WeatherCard() {
    const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
        null,
    );

    function fetchLocation(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error('Geolocation is not supported by your browser'),
                );
            } else {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            }
        });
    }
    async function fetchWeatherData(
        latitude: number,
        longitude: number,
    ): Promise<WeatherApiResponse> {
        console.log(process.env);
        const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data could not be fetched');
        }
        return (await response.json()) as WeatherApiResponse;
    }
    useEffect(() => {
        fetchLocation()
            .then((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude)
                    .then((data) => setWeatherData(data))
                    .catch((error) =>
                        console.error('Error fetching weather data:', error),
                    );
            })
            .catch((error) => console.error('Error fetching location:', error));
    }, []);

    if (!weatherData) return <div>Loading weather data...</div>;
    const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    return (
        <Card
            sx={{
                position: 'relative',
                display: 'flex',
                minWidth: 275,
                margin: '16px',
                backgroundColor: '#d3eeff',
                alignItems: 'center',
                padding: '8px',
            }}
        >
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                    {Math.round(weatherData.main.temp)}°C
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 1.5 }}
                    fontWeight="bold"
                >
                    {weatherData.weather[0].description}
                </Typography>
                <Typography variant="body2">
                    Humidity: {weatherData.main.humidity}%
                </Typography>
            </CardContent>
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                }}
            >
                <img
                    src={iconUrl}
                    alt="Weather Icon"
                    style={{ width: 80, height: 80 }}
                />
            </Box>
        </Card>
    );
}
