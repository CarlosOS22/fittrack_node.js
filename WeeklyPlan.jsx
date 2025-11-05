import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Flame, Activity, Trash2, UtensilsCrossed, Dumbbell, Edit2, Save, X, Eye, Clock, ChefHat } from 'lucide-react';
import ExerciseGif from '../components/ExerciseGif';

const WeeklyPlan = () => {
  const { weeklyPlan, calculateDailyMacros, removeRecipeFromWeeklyPlan, removeExerciseFromWeeklyPlan, updateExerciseInWeeklyPlan, userData } = useApp();
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editingSets, setEditingSets] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const days = [
    { key: 'Lunes', label: 'Lunes' },
    { key: 'Martes', label: 'Martes' },
    { key: 'Miércoles', label: 'Miércoles' },
    { key: 'Jueves', label: 'Jueves' },
    { key: 'Viernes', label: 'Viernes' },
    { key: 'Sábado', label: 'Sábado' },
    { key: 'Domingo', label: 'Domingo' }
  ];

  const currentDayPlan = weeklyPlan[selectedDay] || { recipes: [], exercises: [] };
  const dailyMacros = calculateDailyMacros(selectedDay);

  const handleStartEditSets = (exercise) => {
    const exerciseData = exercise.exercise_data || exercise;
    setEditingExerciseId(exercise.id);
    setEditingSets(exerciseData.sets || '');
  };

  const handleSaveSets = async (exercise) => {
    const exerciseData = exercise.exercise_data || exercise;
    const updatedData = {
      ...exerciseData,
      sets: parseInt(editingSets) || exerciseData.sets
    };

    try {
      await updateExerciseInWeeklyPlan(exercise.id, updatedData);
      setEditingExerciseId(null);
      setEditingSets('');
    } catch (error) {
      console.error('Error actualizando series:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setEditingSets('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-8 flex items-center">
          <Calendar className="mr-3" />
          Plan Semanal
        </h1>

        {/* Day Selector */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {days.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedDay === day.key
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <Flame className="h-8 w-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{dailyMacros.calories}</div>
            <div className="text-orange-100">Calorías</div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold mb-1">{dailyMacros.protein}g</div>
            <div className="text-primary-100">Proteína</div>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold mb-1">{dailyMacros.carbs}g</div>
            <div className="text-secondary-100">Carbohidratos</div>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-secondary-500 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold mb-1">{dailyMacros.fat}g</div>
            <div className="text-primary-100">Grasas</div>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-primary-600 text-white rounded-xl p-6 shadow-lg">
            <Activity className="h-8 w-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{currentDayPlan?.exercises?.length || 0}</div>
            <div className="text-secondary-100">Ejercicios</div>
          </div>
        </div>

        {/* Calorie Tracking Progress */}
        {userData && userData.dailyCalories && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Flame className="mr-2 text-orange-600" />
              Progreso de Calorías del Día
            </h2>

            {(() => {
              const targetCalories = userData.dailyCalories || 0;
              const currentCalories = dailyMacros.calories || 0;
              const remaining = targetCalories - currentCalories;
              const progressPercent = targetCalories > 0 ? Math.min(100, Math.round((currentCalories / targetCalories) * 100)) : 0;

              // Determine color based on progress
              let statusColor = '';
              let statusBg = '';
              let statusText = '';
              let statusIcon = '';

              if (currentCalories === 0) {
                statusColor = 'text-gray-600';
                statusBg = 'bg-gray-100';
                statusText = 'Sin comidas añadidas';
                statusIcon = '📝';
              } else if (progressPercent < 70) {
                statusColor = 'text-red-600';
                statusBg = 'bg-red-50';
                statusText = 'Te faltan bastantes calorías';
                statusIcon = '⚠️';
              } else if (progressPercent < 90) {
                statusColor = 'text-yellow-600';
                statusBg = 'bg-yellow-50';
                statusText = 'Vas por buen camino';
                statusIcon = '⚡';
              } else if (progressPercent <= 110) {
                statusColor = 'text-green-600';
                statusBg = 'bg-green-50';
                statusText = '¡Perfecto! Objetivo alcanzado';
                statusIcon = '✅';
              } else {
                statusColor = 'text-orange-600';
                statusBg = 'bg-orange-50';
                statusText = 'Has superado tu objetivo';
                statusIcon = '⚠️';
              }

              return (
                <div className="space-y-4">
                  {/* Stats Row */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                      <div className="text-sm text-orange-600 font-medium mb-1">Objetivo Diario</div>
                      <div className="text-3xl font-bold text-orange-700">{targetCalories}</div>
                      <div className="text-xs text-orange-600 mt-1">kcal</div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border-2 border-primary-200">
                      <div className="text-sm text-primary-600 font-medium mb-1">Consumidas</div>
                      <div className="text-3xl font-bold text-primary-700">{currentCalories}</div>
                      <div className="text-xs text-primary-600 mt-1">kcal</div>
                    </div>

                    <div className={`bg-gradient-to-br ${statusBg} rounded-xl p-4 border-2 ${statusColor.replace('text-', 'border-')}`}>
                      <div className={`text-sm ${statusColor} font-medium mb-1`}>
                        {remaining > 0 ? 'Te Faltan' : remaining < 0 ? 'Excedente' : 'Completo'}
                      </div>
                      <div className={`text-3xl font-bold ${statusColor}`}>
                        {Math.abs(remaining)}
                      </div>
                      <div className={`text-xs ${statusColor} mt-1`}>kcal</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso del día</span>
                      <span className="text-lg font-bold text-primary-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                          progressPercent < 70 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                          progressPercent < 90 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                          progressPercent <= 110 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                          'bg-gradient-to-r from-orange-400 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      >
                        {progressPercent > 10 && (
                          <span className="text-xs text-white font-bold">{progressPercent}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className={`${statusBg} rounded-lg p-4 border-l-4 ${statusColor.replace('text-', 'border-')}`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{statusIcon}</span>
                      <div>
                        <div className={`font-bold ${statusColor}`}>{statusText}</div>
                        {remaining > 0 && currentCalories > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            Añade más comidas para alcanzar tu objetivo diario
                          </div>
                        )}
                        {remaining < 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            Has consumido {Math.abs(remaining)} kcal más de tu objetivo
                          </div>
                        )}
                        {remaining === 0 && currentCalories > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            Has alcanzado exactamente tu objetivo de calorías
                          </div>
                        )}
                        {currentCalories === 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            Ve a la sección de Recetas y añade comidas a este día
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Macros Progress Mini Cards */}
                  {userData.macros && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Proteína</div>
                        <div className="text-sm font-bold text-primary-600">
                          {dailyMacros.protein}g / {userData.macros.protein}g
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (dailyMacros.protein / userData.macros.protein) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Carbohidratos</div>
                        <div className="text-sm font-bold text-secondary-600">
                          {dailyMacros.carbs}g / {userData.macros.carbs}g
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-secondary-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (dailyMacros.carbs / userData.macros.carbs) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Grasas</div>
                        <div className="text-sm font-bold text-primary-600">
                          {dailyMacros.fat}g / {userData.macros.fat}g
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (dailyMacros.fat / userData.macros.fat) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Meals Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <UtensilsCrossed className="mr-2 text-primary-600" />
              Comidas del Día
            </h2>

            {currentDayPlan?.recipes?.length > 0 ? (
              <div className="space-y-4">
                {currentDayPlan.recipes.map((meal, index) => {
                  const recipeData = meal.recipe_data || meal;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{recipeData.name}</h3>
                          <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                            {recipeData.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedRecipe(recipeData)}
                            className="text-blue-500 hover:text-blue-700 p-2"
                            title="Ver receta"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeRecipeFromWeeklyPlan(selectedDay, meal.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-sm mt-3">
                        <div className="bg-orange-50 rounded p-2">
                          <div className="font-bold text-orange-600">{recipeData.calories}</div>
                          <div className="text-xs text-gray-600">kcal</div>
                        </div>
                        <div className="bg-primary-50 rounded p-2">
                          <div className="font-bold text-primary-600">{recipeData.macros?.protein || 0}g</div>
                          <div className="text-xs text-gray-600">Prot</div>
                        </div>
                        <div className="bg-secondary-50 rounded p-2">
                          <div className="font-bold text-secondary-600">{recipeData.macros?.carbs || 0}g</div>
                          <div className="text-xs text-gray-600">Carbs</div>
                        </div>
                        <div className="bg-primary-50 rounded p-2">
                          <div className="font-bold text-primary-600">{recipeData.macros?.fat || 0}g</div>
                          <div className="text-xs text-gray-600">Grasas</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay comidas planificadas para este día</p>
                <p className="text-sm text-gray-400 mt-2">Ve a la sección de Recetas para añadir comidas</p>
              </div>
            )}
          </div>

          {/* Exercises Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Dumbbell className="mr-2 text-secondary-600" />
              Rutina de Entrenamiento
            </h2>

            {currentDayPlan?.exercises?.length > 0 ? (
              <div className="space-y-4">
                {currentDayPlan.exercises.map((exercise, index) => {
                  const exerciseData = exercise.exercise_data || exercise;
                  const isEditing = editingExerciseId === exercise.id;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1">{exerciseData.name}</h3>
                          <span className="text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
                            {exerciseData.muscleGroup}
                          </span>
                        </div>
                        <button
                          onClick={() => removeExerciseFromWeeklyPlan(selectedDay, exercise.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* GIF del ejercicio */}
                      {exerciseData.gifUrl && (
                        <ExerciseGif
                          src={exerciseData.gifUrl}
                          alt={exerciseData.name}
                          fallbackImage={exerciseData.image}
                          className="w-full h-48 object-contain mb-3"
                        />
                      )}

                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="font-medium">Series:</span>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingSets}
                                onChange={(e) => setEditingSets(e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold"
                                min="1"
                                max="10"
                              />
                              <button
                                onClick={() => handleSaveSets(exercise)}
                                className="text-green-600 hover:text-green-700 p-1"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-700 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">{exerciseData.sets}</span>
                              <button
                                onClick={() => handleStartEditSets(exercise)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="font-medium">Repeticiones:</span>
                          <span className="font-bold text-gray-800">{exerciseData.reps}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="font-medium">Descanso:</span>
                          <span className="font-bold text-gray-800">{exerciseData.restTime}s</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="font-medium">Equipamiento:</span>
                          <span className="font-bold text-gray-800">{exerciseData.equipment}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay ejercicios planificados para este día</p>
                <p className="text-sm text-gray-400 mt-2">Ve a la sección de Ejercicios para añadir entrenamientos</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen Semanal</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Día</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Comidas</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Ejercicios</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Calorías</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Proteína</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Carbos</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Grasas</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const macros = calculateDailyMacros(day.key);
                  const dayPlan = weeklyPlan[day.key];
                  return (
                    <tr
                      key={day.key}
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedDay === day.key ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => setSelectedDay(day.key)}
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">{day.label}</td>
                      <td className="text-center py-3 px-4">{dayPlan?.recipes?.length || 0}</td>
                      <td className="text-center py-3 px-4">{dayPlan?.exercises?.length || 0}</td>
                      <td className="text-center py-3 px-4 font-bold text-orange-600">{macros.calories}</td>
                      <td className="text-center py-3 px-4 font-bold text-primary-600">{macros.protein}g</td>
                      <td className="text-center py-3 px-4 font-bold text-secondary-600">{macros.carbs}g</td>
                      <td className="text-center py-3 px-4 font-bold text-primary-600">{macros.fat}g</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Receta */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRecipe(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedRecipe.name}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedRecipe.prepTime} min
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <ChefHat className="h-4 w-4" />
                        {selectedRecipe.difficulty}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedRecipe.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Imagen */}
              {selectedRecipe.image && (
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Macros */}
              <div className="p-6 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Información Nutricional</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-orange-600">{selectedRecipe.calories}</div>
                    <div className="text-xs text-gray-600 mt-1">Calorías</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-primary-600">{selectedRecipe.macros?.protein || 0}g</div>
                    <div className="text-xs text-gray-600 mt-1">Proteína</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-secondary-600">{selectedRecipe.macros?.carbs || 0}g</div>
                    <div className="text-xs text-gray-600 mt-1">Carbohidratos</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-primary-600">{selectedRecipe.macros?.fat || 0}g</div>
                    <div className="text-xs text-gray-600 mt-1">Grasas</div>
                  </div>
                </div>
              </div>

              {/* Ingredientes */}
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                  <UtensilsCrossed className="mr-2 h-5 w-5 text-primary-600" />
                  Ingredientes
                </h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients?.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instrucciones */}
              <div className="p-6 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                  <ChefHat className="mr-2 h-5 w-5 text-secondary-600" />
                  Instrucciones
                </h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions?.map((instruction, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="bg-secondary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-bold hover:from-primary-700 hover:to-secondary-700 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlan;
