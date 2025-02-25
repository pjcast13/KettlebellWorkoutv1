import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Save } from 'lucide-react';

const KettlebellTracker = () => {
  // Initial workout data structure
  const initialWorkoutA = {
    name: "Workout A: Full Body Strength Focus",
    exercises: [
      { name: "Kettlebell Goblet Squats", targetReps: 12 },
      { name: "One-arm Kettlebell Rows", targetReps: 10 },
      { name: "Kettlebell Push Press", targetReps: 8 },
      { name: "Kettlebell Romanian Deadlifts", targetReps: 12 },
      { name: "Kettlebell Farmer's Carries", targetReps: "30s" }
    ]
  };

  const initialWorkoutB = {
    name: "Workout B: Power and Conditioning",
    exercises: [
      { name: "Kettlebell Swings", targetReps: 15 },
      { name: "Kettlebell Clean and Press", targetReps: 8 },
      { name: "Kettlebell Lunges", targetReps: 10 },
      { name: "Turkish Get-up", targetReps: 3 },
      { name: "Kettlebell Goblet Hold Squat", targetReps: "30s" }
    ]
  };

  // State to store all workout sessions
  const [workoutSessions, setWorkoutSessions] = useState(() => {
    const savedSessions = localStorage.getItem('kettlebellSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  // State for current workout session being entered
  const [currentSession, setCurrentSession] = useState({
    date: new Date().toISOString().substr(0, 10),
    workoutType: 'A',
    exercises: initialWorkoutA.exercises.map(ex => ({
      name: ex.name,
      sets: [{ reps: ex.targetReps, completed: false }]
    }))
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('current');

  // Save sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('kettlebellSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  // Add a new set to an exercise
  const addSet = (exerciseIndex) => {
    const updatedSession = { ...currentSession };
    const exercise = updatedSession.exercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    exercise.sets.push({ reps: lastSet.reps, completed: false });
    setCurrentSession(updatedSession);
  };

  // Remove a set from an exercise
  const removeSet = (exerciseIndex, setIndex) => {
    const updatedSession = { ...currentSession };
    if (updatedSession.exercises[exerciseIndex].sets.length > 1) {
      updatedSession.exercises[exerciseIndex].sets.splice(setIndex, 1);
      setCurrentSession(updatedSession);
    }
  };

  // Update reps for a specific set
  const updateReps = (exerciseIndex, setIndex, reps) => {
    const updatedSession = { ...currentSession };
    updatedSession.exercises[exerciseIndex].sets[setIndex].reps = reps;
    setCurrentSession(updatedSession);
  };

  // Toggle completion status of a set
  const toggleSetCompleted = (exerciseIndex, setIndex) => {
    const updatedSession = { ...currentSession };
    const currentCompleted = updatedSession.exercises[exerciseIndex].sets[setIndex].completed;
    updatedSession.exercises[exerciseIndex].sets[setIndex].completed = !currentCompleted;
    setCurrentSession(updatedSession);
  };

  // Switch between workout types
  const switchWorkoutType = (type) => {
    const workoutTemplate = type === 'A' ? initialWorkoutA : initialWorkoutB;
    setCurrentSession({
      ...currentSession,
      workoutType: type,
      exercises: workoutTemplate.exercises.map(ex => ({
        name: ex.name,
        sets: [{ reps: ex.targetReps, completed: false }]
      }))
    });
  };

  // Save current workout session
  const saveWorkoutSession = () => {
    const sessionToSave = {
      ...currentSession,
      id: Date.now().toString(),
      date: currentSession.date
    };
    
    setWorkoutSessions([sessionToSave, ...workoutSessions]);
    
    // Reset current session with today's date and alternate workout type
    switchWorkoutType(currentSession.workoutType === 'A' ? 'B' : 'A');
  };

  // Delete a saved workout session
  const deleteSession = (sessionId) => {
    setWorkoutSessions(workoutSessions.filter(session => session.id !== sessionId));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Custom tab component to avoid using external library
  const TabButton = ({ id, label, isActive, onClick }) => {
    return (
      <button
        className={`py-2 px-4 font-medium border-b-2 ${
          isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onClick(id)}
      >
        {label}
      </button>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Kettlebell Workout Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Custom tabs navigation */}
        <div className="flex border-b mb-4">
          <TabButton 
            id="current" 
            label="Current Workout" 
            isActive={activeTab === 'current'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="history" 
            label="Workout History" 
            isActive={activeTab === 'history'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="stats" 
            label="Stats & Progress" 
            isActive={activeTab === 'stats'} 
            onClick={setActiveTab} 
          />
        </div>
          
        {/* Current Workout Tab */}
        {activeTab === 'current' && (
          <div className="mb-4 space-y-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date:</label>
                <input
                  type="date"
                  value={currentSession.date}
                  onChange={(e) => setCurrentSession({...currentSession, date: e.target.value})}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Workout Type:</label>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => switchWorkoutType('A')}
                    variant={currentSession.workoutType === 'A' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Workout A
                  </Button>
                  <Button 
                    onClick={() => switchWorkoutType('B')}
                    variant={currentSession.workoutType === 'B' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Workout B
                  </Button>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold">
              {currentSession.workoutType === 'A' ? initialWorkoutA.name : initialWorkoutB.name}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Exercise</th>
                    <th className="px-4 py-2 text-left">Sets/Reps</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSession.exercises.map((exercise, exIndex) => (
                    <tr key={exIndex} className="border-t">
                      <td className="px-4 py-2">
                        {exercise.name}
                      </td>
                      <td className="px-4 py-2">
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={set.completed}
                                onChange={() => toggleSetCompleted(exIndex, setIndex)}
                                className="w-4 h-4"
                              />
                              <span className="font-medium">Set {setIndex + 1}:</span>
                              <input
                                type="text"
                                value={set.reps}
                                onChange={(e) => updateReps(exIndex, setIndex, e.target.value)}
                                className="w-16 px-2 py-1 border rounded"
                              />
                              <span>reps</span>
                              {exercise.sets.length > 1 && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => removeSet(exIndex, setIndex)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addSet(exIndex)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Set
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={saveWorkoutSession}>
                <Save className="h-4 w-4 mr-2" /> Save Workout
              </Button>
            </div>
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {workoutSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No workout sessions recorded yet. Complete a workout to see your history.
              </div>
            ) : (
              <div className="space-y-4">
                {workoutSessions.map((session) => (
                  <Card key={session.id} className="mb-4">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-md">
                          {formatDate(session.date)} - Workout {session.workoutType}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteSession(session.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Exercise</th>
                            <th className="text-left py-2">Sets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.exercises.map((exercise, i) => (
                            <tr key={i} className="border-b">
                              <td className="py-2">{exercise.name}</td>
                              <td className="py-2">
                                {exercise.sets.map((set, j) => (
                                  <span key={j} className="mr-2">
                                    {set.reps} {j < exercise.sets.length - 1 ? '•' : ''}
                                  </span>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <>
            {workoutSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Complete workouts to see your progress stats.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Workout Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500">Total Workouts</div>
                        <div className="text-2xl font-bold">{workoutSessions.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500">Workout A</div>
                        <div className="text-2xl font-bold">
                          {workoutSessions.filter(s => s.workoutType === 'A').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500">Workout B</div>
                        <div className="text-2xl font-bold">
                          {workoutSessions.filter(s => s.workoutType === 'B').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500">Last Workout</div>
                        <div className="text-xl font-bold">
                          {formatDate(workoutSessions[0].date)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Progress</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This section will show your progress on key exercises as you log more workouts.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KettlebellTracker;
