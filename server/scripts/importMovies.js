
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Movie = require('../models/Movie');

const csvPath = path.join(__dirname, '../data/cleaned_netflix.csv');

async function importMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    const rows = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const title = row.title?.trim();

        if (!title) return;

        const releaseYear = Number(row.release_year);

        rows.push({
          title,
          director: row.director?.trim() || '',
          cast: row.cast
            ? row.cast.split(',').map(item => item.trim()).filter(Boolean)
            : [],
          genre: row.listed_in
            ? row.listed_in.split(',').map(item => item.trim()).filter(Boolean)
            : [],
          description: row.description?.trim() || '',
          releaseYear: Number.isFinite(releaseYear)
            ? releaseYear
            : undefined,
          duration: row.duration?.trim() || '',
          poster: '',
          backdrop: '',
          language: '',
          rating: 0,
          imdbRating: null
        });
      })
      .on('end', async () => {
        try {
          const operations = rows.map(movie => ({
            updateOne: {
              filter: {
                title: movie.title,
                releaseYear: movie.releaseYear
              },
              update: { $setOnInsert: movie },
              upsert: true
            }
          }));

          if (operations.length > 0) {
            const result = await Movie.bulkWrite(operations, {
              ordered: false
            });

            console.log('Import completed!');
            console.log('CSV records:', rows.length);
            console.log('New movies inserted:', result.upsertedCount);
            console.log('Existing movies skipped:', result.matchedCount);
          } else {
            console.log('No valid movie records found.');
          }
        } catch (error) {
          console.error('Import error:', error);
        } finally {
          await mongoose.disconnect();
        }
      })
      .on('error', async (error) => {
        console.error('CSV reading error:', error);
        await mongoose.disconnect();
      });

  } catch (error) {
    console.error('Database connection error:', error);
    await mongoose.disconnect();
  }
}

importMovies();
