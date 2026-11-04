import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import './CreateWorkout.css';

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Data não indicada';

  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) return dateTime;

  return parsedDate.toLocaleString('pt-PT');
};

const createEditForm = (workout) => ({
  name: workout.name ?? '',
  date: workout.dateTime ? workout.dateTime.slice(0, 16) : '',
  stateWorkout: workout.state ?? 'PENDING',
  description: workout.description ?? '',
  exercises: (workout.exercises ?? [])
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((item, index) => ({
      exercise_id: String(item.exercise?.id ?? ''),
      exerciseName: item.exercise?.name ?? 'Exercício',
      sets: String(item.sets ?? ''),
      repetitions: String(item.repetitions ?? ''),
      weigth: String(item.weights ?? 0),
      order: index + 1,
    })),
});

const ListWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [transitioningWorkoutId, setTransitioningWorkoutId] = useState(null);
  const [transitionError, setTransitionError] = useState('');
  const [transitionSuccess, setTransitionSuccess] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadWorkouts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadError('Inicie sessão para carregar os treinos.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:8080/api/v1/workout/list',
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error(`Falha ao carregar treinos (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('A resposta da API não é uma lista de treinos.');
        }
        setWorkouts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(
            error instanceof Error ? error.message : 'Erro ao carregar treinos.'
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadWorkouts();
    return () => controller.abort();
  }, []);

  const startEditing = (workout) => {
    setEditingWorkoutId(workout.id);
    setEditForm(createEditForm(workout));
    setUpdateError('');
    setUpdateSuccess('');
  };

  const cancelEditing = () => {
    setEditingWorkoutId(null);
    setEditForm(null);
    setUpdateError('');
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleExerciseChange = (index, field, value) => {
    setEditForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleWorkoutTransition = async (workoutId, action) => {
    setTransitionError('');
    setTransitionSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setTransitionError('A sua sessão expirou. Inicie sessão novamente.');
      return;
    }

    setTransitioningWorkoutId(workoutId);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/workout/${action}/${workoutId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message ||
            `Falha ao ${action === 'start' ? 'iniciar' : 'concluir'} o treino (${response.status}).`
        );
      }

      const updatedWorkout = await response.json();
      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout
        )
      );
      setTransitionSuccess(
        action === 'start' ? 'Treino iniciado.' : 'Treino concluído.'
      );
    } catch (error) {
      setTransitionError(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o estado do treino.'
      );
    } finally {
      setTransitioningWorkoutId(null);
    }
  };

  const handleUpdate = async (event, workoutId) => {
    event.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setUpdateError('A sua sessão expirou. Inicie sessão novamente.');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/workout/update/${workoutId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name,
            date: editForm.date,
            stateWorkout: editForm.stateWorkout,
            description: editForm.description,
            exercises: editForm.exercises.map((exercise) => ({
              exercise_id: Number(exercise.exercise_id),
              sets: Number(exercise.sets),
              repetitions: Number(exercise.repetitions),
              weigth: Number(exercise.weigth),
              order: exercise.order,
            })),
          }),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        let message = `Não foi possível atualizar o treino (${response.status}).`;
        if (responseText) {
          try {
            const errorBody = JSON.parse(responseText);
            message = errorBody.message || errorBody.error || message;
          } catch {
            message = responseText;
          }
        }
        throw new Error(message);
      }

      const updatedWorkout = await response.json();
      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout
        )
      );
      setEditingWorkoutId(null);
      setEditForm(null);
      setUpdateSuccess('Treino atualizado com sucesso.');
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Erro ao atualizar o treino.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="workout-page">
      <Container className="workout-form-card">
        <header className="workout-heading">
          <span className="workout-eyebrow">PLANEAMENTO</span>
          <h1>Os meus treinos</h1>
          <p>Consulte e atualize os seus treinos e exercícios.</p>
        </header>

        {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
        {transitionError && (
          <Alert variant="danger" role="alert">
            {transitionError}
          </Alert>
        )}
        {transitionSuccess && (
          <Alert variant="success" role="status">
            {transitionSuccess}
          </Alert>
        )}
        {isLoading && <Spinner animation="border" role="status" />}
        {!isLoading && loadError && <Alert variant="danger">{loadError}</Alert>}
        {!isLoading && !loadError && workouts.length === 0 && (
          <Alert variant="info">Ainda não existem treinos para apresentar.</Alert>
        )}

        {!isLoading && !loadError && workouts.map((workout) => (
          <Card className="mb-3" key={workout.id}>
            <Card.Body>
              {editingWorkoutId === workout.id && editForm ? (
                <Form onSubmit={(event) => handleUpdate(event, workout.id)}>
                  <Form.Group className="mb-3" controlId={`name-${workout.id}`}>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control name="name" value={editForm.name} onChange={handleFieldChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`date-${workout.id}`}>
                    <Form.Label>Data e hora</Form.Label>
                    <Form.Control type="datetime-local" name="date" value={editForm.date} onChange={handleFieldChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`state-${workout.id}`}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control value={editForm.stateWorkout} readOnly />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`description-${workout.id}`}>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" value={editForm.description} onChange={handleFieldChange} />
                  </Form.Group>

                  <h2 className="h5">Exercícios existentes</h2>
                  <p className="text-muted">Não é possível adicionar ou remover exercícios neste update.</p>

                  {editForm.exercises.map((exercise, index) => (
                    <div className="border rounded p-3 mb-3" key={`${exercise.exercise_id}-${index}`}>
                      <strong>{exercise.exerciseName}</strong>
                      <div className="workout-fields mt-3">
                        <Form.Group controlId={`sets-${workout.id}-${index}`}>
                          <Form.Label>Séries</Form.Label>
                          <Form.Control type="number" min="1" name="sets" value={exercise.sets} onChange={(event) => handleExerciseChange(index, 'sets', event.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId={`reps-${workout.id}-${index}`}>
                          <Form.Label>Repetições</Form.Label>
                          <Form.Control type="number" min="1" name="repetitions" value={exercise.repetitions} onChange={(event) => handleExerciseChange(index, 'repetitions', event.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId={`weight-${workout.id}-${index}`}>
                          <Form.Label>Peso (kg)</Form.Label>
                          <Form.Control type="number" min="0" step="1" name="weigth" value={exercise.weigth} onChange={(event) => handleExerciseChange(index, 'weigth', event.target.value)} required />
                        </Form.Group>
                      </div>
                    </div>
                  ))}

                  {updateError && <Alert variant="danger" role="alert">{updateError}</Alert>}
                  <Button type="submit" disabled={isUpdating} className="me-2">
                    {isUpdating ? 'A guardar...' : 'Guardar alterações'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={cancelEditing} disabled={isUpdating}>
                    Cancelar
                  </Button>
                </Form>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <Card.Title>{workout.name}</Card.Title>
                      <Card.Text className="text-muted">Data: {formatDateTime(workout.dateTime)}</Card.Text>
                    </div>
                    <Button variant="outline-primary" onClick={() => startEditing(workout)}>
                      Editar
                    </Button>
                  </div>

                  <Card.Text>Estado: {workout.state}</Card.Text>
                  {workout.startedAt && (
                    <Card.Text>
                      Início: {formatDateTime(workout.startedAt)}
                    </Card.Text>
                  )}
                  {workout.finishedAt && (
                    <Card.Text>
                      Conclusão: {formatDateTime(workout.finishedAt)}
                    </Card.Text>
                  )}
                  {workout.description && <Card.Text>{workout.description}</Card.Text>}
                  {workout.state === 'PENDING' && (
                    <Button
                      className="me-2"
                      onClick={() =>
                        handleWorkoutTransition(workout.id, 'start')
                      }
                      disabled={transitioningWorkoutId === workout.id}
                    >
                      {transitioningWorkoutId === workout.id
                        ? 'A iniciar...'
                        : 'Iniciar treino'}
                    </Button>
                  )}
                  {workout.state === 'ACTIVE' && (
                    <Button
                      className="me-2"
                      variant="success"
                      onClick={() =>
                        handleWorkoutTransition(workout.id, 'finish')
                      }
                      disabled={transitioningWorkoutId === workout.id}
                    >
                      {transitioningWorkoutId === workout.id
                        ? 'A concluir...'
                        : 'Concluir treino'}
                    </Button>
                  )}
                  <h2 className="h5 mt-4">Exercícios</h2>
                  {workout.exercises?.length > 0 ? (
                    <ul className="mb-0">
                      {workout.exercises.slice().sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)).map((item) => (
                        <li key={item.id}>
                          {item.exercise?.name ?? 'Exercício'} — {item.sets} séries × {item.repetitions} repetições
                          {item.weights != null ? ` — ${item.weights} kg` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted mb-0">Este treino não tem exercícios associados.</p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        ))}
      </Container>
    </main>
  );
};

export default ListWorkout;