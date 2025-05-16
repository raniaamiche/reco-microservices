const getRecommendations = (userId) => {
    console.log(`Generating recommendations for user: ${userId}`);
    return ["prod1", "prod2", "prod3"];
  };
  
  module.exports = { getRecommendations };
  