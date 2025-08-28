const OpenAI = require('openai');
const { AISuggestion, Trip, Place, Itinerary } = require('../models');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateTripSuggestions = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { preferences, budget, interests } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.userId },
      include: [
        {
          model: Itinerary,
          as: 'itineraries',
          include: [{ model: Place, as: 'place' }]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const prompt = `
      Generate travel suggestions for a trip to ${trip.destination} from ${trip.startDate} to ${trip.endDate}.
      
      Current itinerary: ${JSON.stringify(trip.itineraries.map(item => ({
        day: item.day,
        place: item.place.name,
        category: item.place.category
      })))}
      
      Budget: ${budget || trip.budget || 'Not specified'}
      Interests: ${interests || 'General tourism'}
      Preferences: ${preferences || 'None specified'}
      
      Please suggest:
      1. 3-5 additional places to visit
      2. Route optimization suggestions
      3. Budget-friendly alternatives if applicable
      
      Return as JSON with structure:
      {
        "places": [{"name": "", "category": "", "reasoning": "", "estimatedCost": 0}],
        "routeOptimizations": [{"suggestion": "", "reasoning": ""}],
        "budgetTips": [{"tip": "", "savings": 0}]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const suggestions = JSON.parse(completion.choices[0].message.content);

    // Save AI suggestions to database
    const aiSuggestions = [];
    
    // Save place suggestions
    for (const place of suggestions.places || []) {
      const suggestion = await AISuggestion.create({
        type: 'place',
        suggestion: place,
        reasoning: place.reasoning,
        confidence: 0.8,
        tripId,
        userId: req.userId
      });
      aiSuggestions.push(suggestion);
    }

    // Save route optimization suggestions
    for (const route of suggestions.routeOptimizations || []) {
      const suggestion = await AISuggestion.create({
        type: 'route',
        suggestion: route,
        reasoning: route.reasoning,
        confidence: 0.7,
        tripId,
        userId: req.userId
      });
      aiSuggestions.push(suggestion);
    }

    res.json({
      message: 'AI suggestions generated successfully',
      suggestions: aiSuggestions
    });
  } catch (error) {
    console.error('Generate suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate AI suggestions' });
  }
};

const optimizeRoute = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip ownership
    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.userId },
      include: [
        {
          model: Itinerary,
          as: 'itineraries',
          include: [{ model: Place, as: 'place' }],
          order: [['day', 'ASC'], ['order', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const itineraryByDay = {};
    trip.itineraries.forEach(item => {
      if (!itineraryByDay[item.day]) {
        itineraryByDay[item.day] = [];
      }
      itineraryByDay[item.day].push({
        id: item.id,
        name: item.place.name,
        lat: item.place.latitude,
        lng: item.place.longitude,
        category: item.place.category
      });
    });

    const prompt = `
      Optimize the daily routes for this trip itinerary:
      ${JSON.stringify(itineraryByDay, null, 2)}
      
      Consider:
      - Geographical proximity to minimize travel time
      - Logical flow (e.g., restaurants at meal times)
      - Opening hours and typical visit durations
      
      Return optimized order for each day as JSON:
      {
        "optimizations": [
          {
            "day": 1,
            "newOrder": [{"id": "uuid", "order": 0, "reasoning": ""}],
            "timeSaved": "30 minutes",
            "reasoning": "Overall optimization explanation"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const optimization = JSON.parse(completion.choices[0].message.content);

    // Save optimization suggestion
    const suggestion = await AISuggestion.create({
      type: 'optimization',
      suggestion: optimization,
      reasoning: 'AI-generated route optimization',
      confidence: 0.85,
      tripId,
      userId: req.userId
    });

    res.json({
      message: 'Route optimization generated',
      optimization: suggestion
    });
  } catch (error) {
    console.error('Optimize route error:', error);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
};

const acceptSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await AISuggestion.findOne({
      where: { id, userId: req.userId }
    });

    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    await suggestion.update({ isAccepted: true });

    res.json({
      message: 'Suggestion accepted',
      suggestion
    });
  } catch (error) {
    console.error('Accept suggestion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await AISuggestion.findOne({
      where: { id, userId: req.userId }
    });

    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    await suggestion.update({ isAccepted: false });

    res.json({
      message: 'Suggestion rejected',
      suggestion
    });
  } catch (error) {
    console.error('Reject suggestion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  generateTripSuggestions,
  optimizeRoute,
  acceptSuggestion,
  rejectSuggestion
};