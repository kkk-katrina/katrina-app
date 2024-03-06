import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from '@mui/material';

interface Article {
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
}

interface NewsApiResponse {
    articles: Article[];
    totalResults: number;
}

export default function NewsFeed() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [category, setCategory] = useState<string>('');
    const [totalResults, setTotalResults] = useState<number>(0);
    const categories = [
        'business',
        'entertainment',
        'general',
        'health',
        'science',
        'technology',
        'sports',
    ];

    useEffect(() => {
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;
        let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
        if (category) {
            url += `&category=${category}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data: NewsApiResponse) => {
                setArticles(data.articles);
                setTotalResults(data.totalResults);
            })
            .catch((error: Error) =>
                console.error('Error fetching news:', error),
            );
    }, [category]);

    return (
        <Box sx={{ maxWidth: '90%', margin: 'auto' }}>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: 3 }}
            >
                <Grid item>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) =>
                                setCategory(e.target.value as string)
                            }
                        >
                            {categories.map((categoryItem: string) => (
                                <MenuItem
                                    key={categoryItem}
                                    value={categoryItem}
                                >
                                    {categoryItem.charAt(0).toUpperCase() +
                                        categoryItem.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        Total Results: {totalResults}
                    </Typography>
                </Grid>
            </Grid>
            {articles &&
                articles.map((article: Article, index: number) => (
                    <Card key={index} sx={{ marginBottom: 4 }}>
                        {article.urlToImage && (
                            <CardMedia
                                component="img"
                                height="140"
                                image={article.urlToImage}
                                alt={article.title}
                            />
                        )}
                        <CardActionArea
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                >
                                    {article.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {article.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
        </Box>
    );
}
