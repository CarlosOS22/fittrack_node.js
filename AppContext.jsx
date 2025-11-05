import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // User data
  const [userData, setUserData] = useState(null);

  // Weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState({
    Lunes: { recipes: [], exercises: [] },
    Martes: { recipes: [], exercises: [] },
    Miércoles: { recipes: [], exercises: [] },
    Jueves: { recipes: [], exercises: [] },
    Viernes: { recipes: [], exercises: [] },
    Sábado: { recipes: [], exercises: [] },
    Domingo: { recipes: [], exercises: [] },
  });

  // Progress tracking
  const [progressData, setProgressData] = useState([]);

  // Recipe suggestions
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);

  // Shopping list
  const [shoppingList, setShoppingList] = useState([]);

  // Cargar datos cuando el usuario inicie sesión
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadUserData();
      loadWeeklyPlan();
      loadProgress();
      loadShoppingList();
    } else {
      // Limpiar datos cuando no hay sesión
      setUserData(null);
      setWeeklyPlan({
        Lunes: { recipes: [], exercises: [] },
        Martes: { recipes: [], exercises: [] },
        Miércoles: { recipes: [], exercises: [] },
        Jueves: { recipes: [], exercises: [] },
        Viernes: { recipes: [], exercises: [] },
        Sábado: { recipes: [], exercises: [] },
        Domingo: { recipes: [], exercises: [] },
      });
      setProgressData([]);
      setShoppingList([]);
    }
  }, [isAuthenticated, currentUser]);

  // Cargar datos del usuario desde la API
  const loadUserData = async () => {
    try {
      const response = await api.userData.get(currentUser.id);
      if (response.success && response.userData) {
        setUserData(response.userData);
      }
    } catch (error) {
      console.error('Error cargando datos de usuario:', error);
    }
  };

  // Cargar plan semanal desde la API
  const loadWeeklyPlan = async () => {
    try {
      const response = await api.weeklyPlan.get(currentUser.id);
      if (response.success) {
        setWeeklyPlan(response.weeklyPlan);
      }
    } catch (error) {
      console.error('Error cargando plan semanal:', error);
    }
  };

  // Cargar progreso desde la API
  const loadProgress = async () => {
    try {
      const response = await api.progress.get(currentUser.id);
      if (response.success) {
        setProgressData(response.progress);
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    }
  };

  // Guardar datos del usuario
  const saveUserData = async (data) => {
    if (!isAuthenticated) return;

    try {
      // Calculate TDEE and daily calories/macros if we have all the necessary data
      let enrichedData = { ...data };

      if (data.currentWeight && data.height && data.age && data.gender && data.activityLevel) {
        const tdee = calculateTDEE(
          parseFloat(data.currentWeight),
          parseFloat(data.height),
          parseInt(data.age),
          data.gender,
          data.activityLevel
        );

        const dailyCalories = calculateDailyCalories(
          tdee,
          data.goal || 'maintain',
          parseFloat(data.currentWeight),
          parseFloat(data.targetWeight) || parseFloat(data.currentWeight),
          data.timeframeWeeks || 12
        );

        const macros = calculateMacros(dailyCalories, data.goal || 'maintain');

        enrichedData = {
          ...enrichedData,
          tdee,
          dailyCalories,
          macros
        };
      }

      const response = await api.userData.save(currentUser.id, enrichedData);
      if (response.success) {
        // Recargar datos desde la base de datos para asegurar sincronización
        await loadUserData();
      }
      return response;
    } catch (error) {
      console.error('Error guardando datos de usuario:', error);
      throw error;
    }
  };

  // Add recipe to weekly plan
  const addRecipeToWeeklyPlan = async (day, recipe) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          recipes: [...prev[day].recipes, recipe]
        }
      }));
      return;
    }

    try {
      await api.weeklyPlan.addRecipe(currentUser.id, day, recipe);
      // Recargar el plan completo desde la API
      await loadWeeklyPlan();
    } catch (error) {
      console.error('Error añadiendo receta:', error);
      throw error;
    }
  };

  // Add exercise to weekly plan
  const addExerciseToWeeklyPlan = async (day, exercise) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          exercises: [...prev[day].exercises, exercise]
        }
      }));
      return;
    }

    try {
      await api.weeklyPlan.addExercise(currentUser.id, day, exercise);
      // Recargar el plan completo desde la API
      await loadWeeklyPlan();
    } catch (error) {
      console.error('Error añadiendo ejercicio:', error);
      throw error;
    }
  };

  // Remove recipe from weekly plan
  const removeRecipeFromWeeklyPlan = async (day, recipeId) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          recipes: prev[day].recipes.filter(r => r.id !== recipeId)
        }
      }));
      return;
    }

    try {
      await api.weeklyPlan.removeRecipe(currentUser.id, day, recipeId);
      // Recargar el plan completo desde la API
      await loadWeeklyPlan();
    } catch (error) {
      console.error('Error eliminando receta:', error);
      alert('Error al eliminar la receta. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  // Remove exercise from weekly plan
  const removeExerciseFromWeeklyPlan = async (day, exerciseId) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          exercises: prev[day].exercises.filter(ex => ex.id !== exerciseId)
        }
      }));
      return;
    }

    try {
      await api.weeklyPlan.removeExercise(currentUser.id, day, exerciseId);
      // Recargar el plan completo desde la API
      await loadWeeklyPlan();
    } catch (error) {
      console.error('Error eliminando ejercicio:', error);
      alert('Error al eliminar el ejercicio. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  // Update exercise in weekly plan (for sets, reps, etc.)
  const updateExerciseInWeeklyPlan = async (exerciseId, updatedExerciseData) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setWeeklyPlan(prev => {
        const newPlan = { ...prev };
        for (const day in newPlan) {
          newPlan[day] = {
            ...newPlan[day],
            exercises: newPlan[day].exercises.map(ex =>
              ex.id === exerciseId ? { ...ex, exercise_data: updatedExerciseData } : ex
            )
          };
        }
        return newPlan;
      });
      return;
    }

    try {
      await api.weeklyPlan.updateExercise(currentUser.id, exerciseId, updatedExerciseData);
      // Recargar el plan completo desde la API
      await loadWeeklyPlan();
    } catch (error) {
      console.error('Error actualizando ejercicio:', error);
      alert('Error al actualizar el ejercicio. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  // Add progress entry
  const addProgressEntry = async (entry) => {
    if (!isAuthenticated) {
      // Si no hay sesión, solo actualizar localmente
      setProgressData(prev => [...prev, { ...entry, date: new Date().toISOString(), id: Date.now() }]);
      return;
    }

    try {
      const response = await api.progress.add(currentUser.id, entry);
      if (response.success) {
        // Recargar progreso desde la API
        await loadProgress();
      }
      return response;
    } catch (error) {
      console.error('Error añadiendo progreso:', error);
      throw error;
    }
  };

  // Update progress entry
  const updateProgressEntry = async (entryId, updatedEntry) => {
    if (!isAuthenticated) {
      // Si no hay sesión, actualizar localmente
      setProgressData(prev => prev.map(entry =>
        entry.id === entryId ? { ...entry, ...updatedEntry } : entry
      ));
      return;
    }

    try {
      const response = await api.progress.update(currentUser.id, entryId, updatedEntry);
      if (response.success) {
        await loadProgress();
      }
      return response;
    } catch (error) {
      console.error('Error actualizando progreso:', error);
      throw error;
    }
  };

  // Delete progress entry
  const deleteProgressEntry = async (entryId) => {
    if (!isAuthenticated) {
      // Si no hay sesión, eliminar localmente
      setProgressData(prev => prev.filter(entry => entry.id !== entryId));
      return;
    }

    try {
      const response = await api.progress.delete(currentUser.id, entryId);
      if (response.success) {
        await loadProgress();
      }
      return response;
    } catch (error) {
      console.error('Error eliminando progreso:', error);
      throw error;
    }
  };

  // Add recipe suggestion
  const addRecipeSuggestion = async (suggestion) => {
    try {
      const response = await api.recipeSuggestions.submit(suggestion);
      if (response.success) {
        // Actualizar localmente
        setRecipeSuggestions(prev => [...prev, {
          ...suggestion,
          id: Date.now(),
          status: 'pending',
          date: new Date().toISOString()
        }]);
      }
      return response;
    } catch (error) {
      console.error('Error enviando sugerencia:', error);
      throw error;
    }
  };

  // Update recipe suggestion status (admin function)
  const updateRecipeSuggestionStatus = async (id, status) => {
    try {
      await api.recipeSuggestions.updateStatus(id, status);
      setRecipeSuggestions(prev =>
        prev.map(sugg => sugg.id === id ? { ...sugg, status } : sugg)
      );
    } catch (error) {
      console.error('Error actualizando sugerencia:', error);
      throw error;
    }
  };

  // Calculate daily macros from weekly plan
  const calculateDailyMacros = (day) => {
    const recipes = weeklyPlan[day]?.recipes || [];
    return recipes.reduce((acc, recipe) => {
      const recipeData = recipe.recipe_data || recipe;
      const macros = recipeData.macros || {};
      return {
        protein: acc.protein + (macros.protein || 0),
        carbs: acc.carbs + (macros.carbs || 0),
        fat: acc.fat + (macros.fat || 0),
        calories: acc.calories + (recipeData.calories || 0)
      };
    }, { protein: 0, carbs: 0, fat: 0, calories: 0 });
  };

  // Calculate TDEE (Total Daily Energy Expenditure) using Mifflin-St Jeor Equation
  const calculateTDEE = (weight, height, age, gender, activityLevel) => {
    // BMR calculation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
  };

  // Calculate daily calories based on goal
  const calculateDailyCalories = (tdee, goal, currentWeight, targetWeight, timeframeWeeks) => {
    // Calculate weekly weight change needed
    const weightDifference = targetWeight - currentWeight;
    const weeksToGoal = parseInt(timeframeWeeks) || 12;

    // 1 kg of fat = approximately 7700 calories
    const weeklyWeightChange = weightDifference / weeksToGoal;
    const dailyCalorieAdjustment = (weeklyWeightChange * 7700) / 7;

    let targetCalories;
    if (goal === 'lose') {
      // For weight loss, ensure minimum 1200 calories
      targetCalories = Math.max(1200, Math.round(tdee + dailyCalorieAdjustment));
    } else if (goal === 'gain') {
      // For weight gain
      targetCalories = Math.round(tdee + Math.abs(dailyCalorieAdjustment));
    } else {
      // Maintain weight
      targetCalories = tdee;
    }

    return targetCalories;
  };

  // Calculate macros distribution
  const calculateMacros = (dailyCalories, goal) => {
    let proteinPercent, carbsPercent, fatPercent;

    if (goal === 'lose') {
      // Higher protein for muscle preservation during weight loss
      proteinPercent = 0.35;
      fatPercent = 0.25;
      carbsPercent = 0.40;
    } else if (goal === 'gain') {
      // Balanced for muscle gain
      proteinPercent = 0.30;
      fatPercent = 0.25;
      carbsPercent = 0.45;
    } else {
      // Maintenance
      proteinPercent = 0.30;
      fatPercent = 0.30;
      carbsPercent = 0.40;
    }

    // Calculate grams (protein and carbs = 4 cal/g, fat = 9 cal/g)
    const protein = Math.round((dailyCalories * proteinPercent) / 4);
    const carbs = Math.round((dailyCalories * carbsPercent) / 4);
    const fat = Math.round((dailyCalories * fatPercent) / 9);

    return { protein, carbs, fat };
  };

  // ========== SHOPPING LIST ==========

  // Load shopping list
  const loadShoppingList = async () => {
    if (!isAuthenticated || !currentUser) return;

    try {
      const response = await api.shoppingList.get(currentUser.id);
      if (response.success) {
        setShoppingList(response.shoppingList);
      }
    } catch (error) {
      console.error('Error cargando lista de compra:', error);
    }
  };

  // Add item to shopping list
  const addToShoppingList = async (ingredient, quantity = null) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      const response = await api.shoppingList.add(currentUser.id, ingredient, quantity);
      if (response.success) {
        await loadShoppingList();
      }
      return response;
    } catch (error) {
      console.error('Error añadiendo a lista de compra:', error);
      throw error;
    }
  };

  // Update shopping list item
  const updateShoppingItem = async (itemId, updates) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      const response = await api.shoppingList.update(currentUser.id, itemId, updates);
      if (response.success) {
        await loadShoppingList();
      }
      return response;
    } catch (error) {
      console.error('Error actualizando item de compra:', error);
      throw error;
    }
  };

  // Remove item from shopping list
  const removeFromShoppingList = async (itemId) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      const response = await api.shoppingList.remove(currentUser.id, itemId);
      if (response.success) {
        await loadShoppingList();
      }
      return response;
    } catch (error) {
      console.error('Error eliminando de lista de compra:', error);
      throw error;
    }
  };

  // Función para parsear y normalizar ingredientes
  const parseIngredient = (ingredientString) => {
    const str = ingredientString.toLowerCase().trim();

    // Extraer cantidad numérica al inicio (ej: "2 huevos", "150g de pollo")
    const quantityMatch = str.match(/^(\d+(?:[.,]\d+)?)\s*([a-z]*)\s+(.+)$/);

    if (quantityMatch) {
      const quantity = parseFloat(quantityMatch[1].replace(',', '.'));
      const unit = quantityMatch[2] || '';
      let name = quantityMatch[3];

      // Normalizar nombre: quitar palabras comunes al final/inicio
      name = name.replace(/^(de |del |la |el |los |las |un |una |unos |unas )/gi, '');
      name = name.replace(/(fresco|frescas|frescos|congelado|congelada|congelados|congeladas|en lata|en conserva|natural|naturales)$/gi, '').trim();

      // Normalizar plurales a singular (simplificado)
      if (name.endsWith('s') && !name.endsWith('ss')) {
        name = name.slice(0, -1);
      }

      return { quantity, unit, name, original: ingredientString };
    }

    // Si no hay cantidad numérica al inicio, buscar fracciones (ej: "1/2 aguacate")
    const fractionMatch = str.match(/^(\d+)\/(\d+)\s+(.+)$/);
    if (fractionMatch) {
      const quantity = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
      let name = fractionMatch[3];
      name = name.replace(/^(de |del |la |el |los |las |un |una |unos |unas )/gi, '');
      name = name.replace(/(fresco|frescas|frescos|congelado|congelada|congelados|congeladas|en lata|en conserva|natural|naturales)$/gi, '').trim();
      if (name.endsWith('s') && !name.endsWith('ss')) {
        name = name.slice(0, -1);
      }
      return { quantity, unit: '', name, original: ingredientString };
    }

    // Si no hay cantidad, devolver como está pero normalizado
    let name = str.replace(/^(de |del |la |el |los |las |un |una |unos |unas )/gi, '');
    name = name.replace(/(fresco|frescas|frescos|congelado|congelada|congelados|congeladas|en lata|en conserva|natural|naturales)$/gi, '').trim();
    if (name.endsWith('s') && !name.endsWith('ss')) {
      name = name.slice(0, -1);
    }

    return { quantity: 1, unit: '', name, original: ingredientString };
  };

  // Generate shopping list from weekly plan
  const generateShoppingListFromPlan = async () => {
    if (!isAuthenticated || !currentUser) return;

    try {
      // Recopilar todos los ingredientes de todas las recetas del plan semanal
      const allIngredients = [];

      Object.keys(weeklyPlan).forEach(day => {
        const dayPlan = weeklyPlan[day];
        if (dayPlan && dayPlan.recipes) {
          dayPlan.recipes.forEach(recipe => {
            const recipeData = recipe.recipe_data || recipe;
            if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
              recipeData.ingredients.forEach(ingredient => {
                allIngredients.push(ingredient);
              });
            }
          });
        }
      });

      // Parsear y agrupar ingredientes
      const ingredientMap = {};

      allIngredients.forEach(ing => {
        const parsed = parseIngredient(ing);
        const key = parsed.name; // Usar el nombre normalizado como clave

        if (ingredientMap[key]) {
          // Si ya existe, sumar cantidades
          if (parsed.unit === ingredientMap[key].unit || !parsed.unit || !ingredientMap[key].unit) {
            ingredientMap[key].quantity += parsed.quantity;
            ingredientMap[key].count++;
          } else {
            // Si las unidades son diferentes, mantener separado
            const newKey = `${key}_${parsed.unit}`;
            if (ingredientMap[newKey]) {
              ingredientMap[newKey].quantity += parsed.quantity;
              ingredientMap[newKey].count++;
            } else {
              ingredientMap[newKey] = {
                name: parsed.name,
                quantity: parsed.quantity,
                unit: parsed.unit,
                count: 1,
                original: parsed.original
              };
            }
          }
        } else {
          ingredientMap[key] = {
            name: parsed.name,
            quantity: parsed.quantity,
            unit: parsed.unit,
            count: 1,
            original: parsed.original
          };
        }
      });

      // Obtener ingredientes que ya existen en la lista de compra
      const existingIngredients = shoppingList.map(item =>
        item.ingredient.toLowerCase().trim()
      );

      // Filtrar ingredientes que ya existen
      let addedCount = 0;
      let skippedCount = 0;

      for (const key in ingredientMap) {
        const item = ingredientMap[key];

        // Formatear la cantidad y nombre
        let displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);

        // Si la cantidad es mayor a 1, usar plural si es necesario
        if (item.quantity > 1 && !displayName.endsWith('s') && !displayName.includes(' de ')) {
          displayName = displayName + 's';
        }

        // Verificar si el ingrediente ya existe en la lista (comparación flexible)
        const normalizedDisplayName = displayName.toLowerCase().trim();
        const alreadyExists = existingIngredients.some(existing => {
          // Comparar directamente
          if (existing === normalizedDisplayName) return true;

          // Comparar sin la 's' final (singular vs plural)
          const existingSingular = existing.endsWith('s') ? existing.slice(0, -1) : existing;
          const displaySingular = normalizedDisplayName.endsWith('s') ? normalizedDisplayName.slice(0, -1) : normalizedDisplayName;

          return existingSingular === displaySingular;
        });

        if (alreadyExists) {
          skippedCount++;
          continue; // No añadir si ya existe
        }

        // Construir el string de cantidad
        let quantityStr = '';
        if (item.unit) {
          // Si hay unidad (g, kg, ml, etc), mostrar cantidad + unidad
          quantityStr = `${Math.round(item.quantity)}${item.unit}`;
        } else if (item.quantity !== 1) {
          // Si no hay unidad pero hay cantidad, mostrar el número
          // Redondear a 1 decimal si es necesario
          const qty = item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(1);
          quantityStr = qty.toString();
        }

        await api.shoppingList.add(currentUser.id, displayName, quantityStr || null);
        addedCount++;
      }

      // Recargar la lista
      await loadShoppingList();

      let message = '';
      if (addedCount > 0 && skippedCount > 0) {
        message = `${addedCount} ingredientes nuevos añadidos. ${skippedCount} ya existían en la lista.`;
      } else if (addedCount > 0) {
        message = `${addedCount} ingredientes añadidos.`;
      } else {
        message = 'Todos los ingredientes ya están en tu lista de compra.';
      }

      return { success: true, message, added: addedCount, skipped: skippedCount };
    } catch (error) {
      console.error('Error generando lista de compra:', error);
      throw error;
    }
  };

  const value = {
    userData,
    setUserData: saveUserData,
    weeklyPlan,
    setWeeklyPlan,
    progressData,
    setProgressData,
    recipeSuggestions,
    shoppingList,
    addRecipeToWeeklyPlan,
    addExerciseToWeeklyPlan,
    removeRecipeFromWeeklyPlan,
    removeExerciseFromWeeklyPlan,
    updateExerciseInWeeklyPlan,
    addProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    addRecipeSuggestion,
    updateRecipeSuggestionStatus,
    calculateDailyMacros,
    loadUserData,
    loadWeeklyPlan,
    loadProgress,
    loadShoppingList,
    addToShoppingList,
    updateShoppingItem,
    removeFromShoppingList,
    generateShoppingListFromPlan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
