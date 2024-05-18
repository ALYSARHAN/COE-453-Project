import React, { useState, useEffect } from 'react';

export default function App() {
  const [meal, setMeal] = useState('');
  const [foodId, setFoodId] = useState(''); // New state for storing the food ID
  const [grams, setGrams] = useState(0);
  const [calories, setCalories] = useState(null);
  const [newMeal, setNewMeal] = useState('');
  const [newCalories, setNewCalories] = useState(0);
  const [listOfMeals, setListOfMeals] = useState([]);

  // Fetch the list of foods
  useEffect(() => {
    fetch('https://api-details-b0a51l0l.uc.gateway.dev/food')
      .then((res) => res.json())
      .then((json_obj) => setListOfMeals(json_obj.foods))
      .catch((err) => console.error(err));
  }, []);
  console.log(listOfMeals);
  // Event handler for when the meal selection changes
  const handleMealChange = (event) => {
    const selectedMeal = event.target.value;
    setMeal(selectedMeal);
    const selectedFood = listOfMeals.find((food) => food.name === selectedMeal);
    if (selectedFood) {
      setFoodId(selectedFood._id);
    } else {
      setFoodId('');
    }
  };

  // Event handler for when the grams input changes
  const handleGramsChange = (event) => {
    setGrams(event.target.value);
  };

  // Event handler for new food name input
  const handleNewMealChange = (event) => {
    setNewMeal(event.target.value);
  };

  // Event handler for new food calories input
  const handleNewCaloriesChange = (event) => {
    setNewCalories(event.target.value);
  };

  // Function to handle the submission to calculate the calories
  const handleSubmit = async () => {
    if (!foodId) {
      console.error('No food ID found for the selected meal');
      return;
    }

    try {
      const response = await fetch(
        'https://api-details-b0a51l0l.uc.gateway.dev/calculate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            mutation {
              getCalories(foodId: "${foodId}", weight: ${grams})
            }
          `,
          }),
        }
      );
      const result = await response.json();
      setCalories(result.data.getCalories);
      console.log(result);
    } catch (error) {
      console.error('Error calculating calories:', error);
    }
  };

  // Function to handle the submission of the new food list to an API
  const handleAddFoodSubmit = async () => {
    console.log(
      `Sending new food: ${newMeal} with ${newCalories} calories per 100 grams to the API`
    );

    try {
      const response = await fetch(
        'https://api-details-b0a51l0l.uc.gateway.dev/food/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newMeal, calories: newCalories }),
        }
      );

      const result = await response.json();
      const newFood = result.food;
      setListOfMeals((prevMeals) => [...prevMeals, newFood]);
      console.log(newFood);
    } catch (error) {
      console.error('Error adding new food:', error);
    }
  };

  return (
    <div>
      <div>
        <h1>Calories Calculator</h1>
        <div>
          <label htmlFor="meal">Choose a meal: </label>
          <select id="meal" name="meal" onChange={handleMealChange}>
            <option value="">Select a meal</option>
            {listOfMeals.map((food) => (
              <option key={food._id} value={food.name}>
                {food.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="grams">How many grams: </label>
          <input
            id="grams"
            type="number"
            value={grams}
            onChange={handleGramsChange}
          />
        </div>
        <div>
          <button onClick={handleSubmit}>Calculate</button>
        </div>
        <div>
          <label>Amount of Calories is: </label>
          <span>{calories !== null ? calories : 'N/A'}</span>
        </div>
      </div>
      <div>
        <h2>Add a New Dish</h2>
        <div>
          <label htmlFor="newMeal">Food Name:</label>
          <input
            id="newMeal"
            type="text"
            value={newMeal}
            onChange={handleNewMealChange}
          />
        </div>
        <div>
          <label htmlFor="newCalories">Calories per 100 grams:</label>
          <input
            id="newCalories"
            type="number"
            value={newCalories}
            onChange={handleNewCaloriesChange}
          />
        </div>
        <div>
          <button onClick={handleAddFoodSubmit}>Add Food</button>
        </div>
      </div>
    </div>
  );
}
