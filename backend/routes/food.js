// Setup
const express = require('express');
const router = express.Router();
const db = require('../db');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_ID = 'asst_Be2zzUsAroZBdD99pZnpcvF8'; 
const userId = 1;

// Inventory

// Get
router.get('/food', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM food_inventory WHERE user_id = $1 ORDER BY expiry_date NULLS LAST',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching food items:', err);
    res.status(500).json({ error: 'Failed to fetch food items', message: err.message });
  }
});

// Create
router.post('/food', async (req, res) => {
  let { name, quantity, expiry_date, category } = req.body;
  expiry_date = expiry_date === '' ? null : expiry_date;

  try {
    const result = await db.query(
      'INSERT INTO food_inventory (name, quantity, expiry_date, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, quantity, expiry_date, category, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding food item:', err);
    res.status(500).json({ error: 'Failed to add food item' });
  }
});

// Update
router.put('/food/:id', async (req, res) => {
  const { id } = req.params;
  let { name, quantity, expiry_date, category } = req.body;
  expiry_date = expiry_date === '' ? null : expiry_date;

  try {
    const result = await db.query(
      'UPDATE food_inventory SET name=$1, quantity=$2, expiry_date=$3, category=$4, updated_at=NOW() WHERE id=$5 AND user_id=$6 RETURNING *',
      [name, quantity, expiry_date, category, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or not authorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating food item:', err);
    res.status(500).json({ error: 'Failed to update food item' });
  }
});

// Delete
router.delete('/food/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM food_inventory WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

// Recipes

router.post('/generate-recipes', async (req, res) => {
  const { style, allergies, servings, cookTime, difficulty } = req.body;

  try {
    // Load
    const result = await db.query(
      'SELECT name FROM food_inventory WHERE user_id = $1',
      [userId]
    );
    const ingredients = result.rows.map(row => row.name);

    // Thread
    const thread = await openai.beta.threads.create();

    // Prompt
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `
        You are a helpful culinary assistant.

        Given:
        - Ingredients: ${ingredients.join(', ')}
        - Style: ${style || 'any'}
        - Allergies: ${allergies || 'none'}
        - Preferred servings: ${servings || 'any'}
        - Preferred cook time: ${cookTime || 'any'}
        - Preferred difficulty: ${difficulty || 'any'}

        Generate 2-3 recipes. Return as valid JSON array using this format:
        [
          {
            "name": "string",
            "description": "string",
            "ingredients": ["ingredient 1", "ingredient 2", ...],
            "instructions": ["step 1", "step 2", ...],
            "cookTime": "e.g. 25 minutes",
            "servings": number,
            "difficulty": "Easy" | "Medium" | "Hard"
          }
        ]

        Only return raw JSON. No markdown, no explanation.
      `.trim()
    });

    // Execute
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });

    // Wait
    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (runStatus.status !== 'completed');

    // Response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;

    let recipes = JSON.parse(reply);

    // Images
    for (const recipe of recipes) {
      const imgRes = await openai.images.generate({
        prompt: `Top-down view of a finished dish called "${recipe.name}". ${style || ''} style. High quality food photography.`,
        n: 1,
        size: '512x512'
      });
      recipe.image = imgRes.data[0].url;
    }

    res.json(recipes);
  } catch (err) {
    console.error('Recipe generation error:', err);
    res.status(500).json({ error: 'Recipe generation failed', message: err.message });
  }
});

module.exports = router;
