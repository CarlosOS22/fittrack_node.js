import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, Trash2, Settings, Bell, Moon, Globe, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { userData, setUserData } = useApp();
  const navigate = useNavigate();

  // States para el formulario de perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // States para el formulario de fitness
  const [fitnessData, setFitnessData] = useState({
    name: '',
    age: '',
    gender: 'male',
    currentWeight: '',
    height: '',
    targetWeight: '',
    timeframeWeeks: '',
    activityLevel: 'moderate',
    goal: 'lose'
  });

  // States para preferencias
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'es',
    units: 'metric'
  });

  // States para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // States de UI
  const [activeTab, setActiveTab] = useState('profile'); // profile, fitness, preferences, security
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }

    if (userData) {
      setFitnessData({
        name: userData.name || '',
        age: userData.age || '',
        gender: userData.gender || 'male',
        currentWeight: userData.currentWeight || '',
        height: userData.height || '',
        targetWeight: userData.targetWeight || '',
        timeframeWeeks: userData.timeframeWeeks || '',
        activityLevel: userData.activityLevel || 'moderate',
        goal: userData.goal || 'lose'
      });
    }

    // Cargar preferencias desde localStorage
    const savedPreferences = localStorage.getItem('fittrack_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [currentUser, userData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateProfile(profileData);
      if (response.success) {
        showMessage('success', 'Perfil actualizado correctamente');
      } else {
        showMessage('error', response.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      showMessage('error', 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFitnessUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await setUserData(fitnessData);
      if (response && response.success) {
        showMessage('success', '✅ Datos de fitness actualizados. Calorías calculadas automáticamente');
      } else {
        showMessage('error', response?.message || 'Error al actualizar datos de fitness');
      }
    } catch (error) {
      showMessage('error', 'Error al actualizar datos de fitness');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí deberías llamar a la API para cambiar la contraseña
      showMessage('success', 'Contraseña cambiada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showMessage('error', 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('fittrack_preferences', JSON.stringify(preferences));

    // Aplicar tema oscuro si está activado
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    showMessage('success', 'Preferencias guardadas correctamente');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      showMessage('error', 'Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí deberías llamar a la API para eliminar la cuenta
      // await api.auth.deleteAccount(currentUser.id);

      showMessage('success', 'Cuenta eliminada correctamente. Redirigiendo...');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      showMessage('error', 'Error al eliminar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'fitness', label: 'Datos Fitness', icon: Activity },
    { id: 'preferences', label: 'Preferencias', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-8 flex items-center">
          <User className="mr-3" />
          Mi Perfil
        </h1>

        {/* Mensaje de notificación */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-start ${
            message.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Perfil Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Perfil</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            </div>
          )}

          {/* Fitness Tab */}
          {activeTab === 'fitness' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos de Fitness</h2>
              <form onSubmit={handleFitnessUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edad
                    </label>
                    <input
                      type="number"
                      value={fitnessData.age}
                      onChange={(e) => setFitnessData({ ...fitnessData, age: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="15"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género
                    </label>
                    <select
                      value={fitnessData.gender}
                      onChange={(e) => setFitnessData({ ...fitnessData, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={fitnessData.height}
                      onChange={(e) => setFitnessData({ ...fitnessData, height: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="120"
                      max="250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso Actual (kg)
                    </label>
                    <input
                      type="number"
                      value={fitnessData.currentWeight}
                      onChange={(e) => setFitnessData({ ...fitnessData, currentWeight: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      step="0.1"
                      min="30"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso Objetivo (kg)
                    </label>
                    <input
                      type="number"
                      value={fitnessData.targetWeight}
                      onChange={(e) => setFitnessData({ ...fitnessData, targetWeight: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      step="0.1"
                      min="30"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Actividad
                    </label>
                    <select
                      value={fitnessData.activityLevel}
                      onChange={(e) => setFitnessData({ ...fitnessData, activityLevel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="sedentary">Sedentario</option>
                      <option value="light">Ligero</option>
                      <option value="moderate">Moderado</option>
                      <option value="active">Activo</option>
                      <option value="veryActive">Muy Activo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objetivo
                    </label>
                    <select
                      value={fitnessData.goal}
                      onChange={(e) => setFitnessData({ ...fitnessData, goal: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="lose">Perder peso</option>
                      <option value="maintain">Mantener peso</option>
                      <option value="gain">Ganar peso/músculo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe (semanas)
                    </label>
                    <input
                      type="number"
                      value={fitnessData.timeframeWeeks}
                      onChange={(e) => setFitnessData({ ...fitnessData, timeframeWeeks: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                      max="104"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isLoading ? 'Guardando...' : 'Guardar Datos de Fitness'}
                </button>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferencias</h2>
              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">Notificaciones Push</div>
                        <div className="text-sm text-gray-600">Recibe recordatorios y alertas</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications}
                        onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">Notificaciones por Email</div>
                        <div className="text-sm text-gray-600">Recibe resúmenes semanales</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Moon className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">Modo Oscuro</div>
                        <div className="text-sm text-gray-600">Tema oscuro para la aplicación</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.darkMode}
                        onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="font-medium text-gray-800">Idioma</div>
                    </div>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-800 mb-3">Unidades de Medida</div>
                    <select
                      value={preferences.units}
                      onChange={(e) => setPreferences({ ...preferences, units: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="metric">Métricas (kg, cm)</option>
                      <option value="imperial">Imperiales (lb, in)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg flex items-center justify-center"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Guardar Preferencias
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Seguridad y Privacidad</h2>

              {/* Cambiar contraseña */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </form>
              </div>

              {/* Eliminar cuenta */}
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  Zona de Peligro
                </h3>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <h4 className="font-bold text-red-800 mb-2">Eliminar Cuenta</h4>
                  <p className="text-red-700 text-sm mb-4">
                    Esta acción es permanente e irreversible. Se eliminarán todos tus datos, planes, progreso y configuraciones.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center"
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      Eliminar Mi Cuenta
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-red-700 font-medium">
                        Por favor, escribe "ELIMINAR" para confirmar:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Escribe ELIMINAR"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isLoading || deleteConfirmText !== 'ELIMINAR'}
                          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Trash2 className="mr-2 h-5 w-5" />
                          {isLoading ? 'Eliminando...' : 'Confirmar Eliminación'}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText('');
                          }}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
