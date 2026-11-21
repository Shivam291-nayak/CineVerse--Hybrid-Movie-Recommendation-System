
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Movie = require('../models/Movie');

const OMDB_URL = 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;

const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

async function updateMoviePosters() {
  try {
    if (!API_KEY) {
      throw new Error('OMDB_API_KEY is missing from server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    const movies = await Movie.find({
      $or: [
        { poster: '' },
        { poster: { $exists: false } },
        { poster: null }
      ]
    });

    console.log(`Movies needing posters: ${movies.length}`);

    let updated = 0;
    let notFound = 0;
    let failed = 0;

    for (const movie of movies) {
      try {
        const response = await axios.get(OMDB_URL, {
          params: {
            apikey: API_KEY,
            t: movie.title,
            y: movie.releaseYear || undefined,
            type: 'movie'
          },
          timeout: 15000
        });

        const data = response.data;

        if (
          data.Response === 'True' &&
          data.Poster &&
          data.Poster !== 'N/A'
        ) {
          movie.poster = data.Poster;
          await movie.save();
          updated++;

          console.log(`Updated: ${movie.title}`);
        } else {
          notFound++;
          console.log(`Poster not found: ${movie.title}`);
        }

        await delay(1100);

      } catch (error) {
        failed++;
        console.log(
          `Failed: ${movie.title} - ${error.message}`
        );

        if (error.response?.status === 401) {
          throw new Error('OMDb API key is invalid or inactive.');
        }

        if (error.response?.status === 429) {
          throw new Error('OMDb request limit reached.');
        }

        await delay(1500);
      }
    }

    console.log('\n========== POSTER UPDATE SUMMARY ==========');
    console.log('Total checked:', movies.length);
    console.log('Posters updated:', updated);
    console.log('Not found:', notFound);
    console.log('Failed:', failed);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

updateMoviePosters();
