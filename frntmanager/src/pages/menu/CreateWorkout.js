import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './CreateWorkout.css';

const createEmptyExercise = () => ({
  id: `${Date.now()}-${Math.random()}`,
  exercise_id: '',
  sets: 3,
  repetitions: 10,
  weigth: 0,
});

const CreateWorkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
  });
  const [exercises, setExercises] = useState(() => [createEmptyExercise()]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exerciseLoadError, setExerciseLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setExerciseLoadError('Inicie sessão para carregar os exercícios.');
        setIsLoadingExercises(false);
        return;
      }
      
      try {
        const response = await fetch(
          'http://localhost:8080/api/v1/workout/listExercices',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          throw new Error(`Falha ao carregar exercícios (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('A resposta da API não é uma lista de exercícios.');
        }
        setAvailableExercises(data);
      } catch (error) {
        setExerciseLoadError(
          error instanceof Error ? error.message : 'Erro ao carregar exercícios.'
        );
      } finally {
        setIsLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  const clearFeedback = () => {
    setSubmitError('');
    setIsSubmitted(false);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    clearFeedback();
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
    clearFeedback();
  };

  const addExercise = () => {
    setExercises((currentExercises) => [...currentExercises, createEmptyExercise()]);
    clearFeedback();
  };

  const removeExercise = (id) => {
    setExercises((currentExercises) =>
      currentExercises.filter((exercise) => exercise.id !== id)
    );
    clearFeedback();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearFeedback();

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('A sua sessão expirou. Inicie sessão novamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/workout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          exercises: exercises.map(
            ({ exercise_id, sets, repetitions, weigth }, index) => ({
              exercise_id: Number(exercise_id),
              sets: Number(sets),
              repetitions: Number(repetitions),
              weigth: Number(weigth),
              order: index + 1,
            })
          ),
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let message = `Não foi possível criar o treino (${response.status}).`;

        if (responseText) {
          try {
            const errorBody = JSON.parse(responseText);
            message = errorBody.message || errorBody.error || message;
          } catch {
            // Mantém a mensagem com o código HTTP se a resposta não for JSON.
          }
        }

        throw new Error(message);
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível comunicar com o servidor.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="workout-page">
      <div className="workout-form-card">
        <div className="workout-heading">
          <span className="workout-eyebrow">PLANEAMENTO</span>
          <h1>Criar treino</h1>
          <p>Preencha os detalhes e adicione os exercícios do treino.</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="workout-fields">
            <Form.Group controlId="workoutName">
              <Form.Label>Nome do treino</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ex.: Treino de força"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group
              controlId="workoutDescription"
              className="workout-description"
            >
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Adicione notas ou objetivos para este treino"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>

          <section
            className="exercise-section"
            aria-labelledby="exercises-heading"
          >
            <div className="exercise-heading">
              <div>
                <h2 id="exercises-heading">Exercícios</h2>
                <p>
                  Selecione os exercícios e defina séries, repetições e peso.
                  A ordem segue a lista.
                </p>
              </div>
              <Button
                variant="outline-primary"
                type="button"
                onClick={addExercise}
              >
                + Adicionar exercício
              </Button>
            </div>

            {exerciseLoadError && (
              <p className="text-danger mb-3" role="alert">
                {exerciseLoadError}
              </p>
            )}

            {!isLoadingExercises &&
              !exerciseLoadError &&
              availableExercises.length === 0 && (
                <p className="text-muted mb-3" role="status">
                  Não existem exercícios disponíveis.
                </p>
              )}

            <div className="exercise-list">
              {exercises.map((exercise, index) => (
                <div className="exercise-row" key={exercise.id}>
                  <span className="exercise-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <Form.Group controlId={`exercise-id-${exercise.id}`}>
                    <Form.Label>Exercício</Form.Label>
                    <Form.Select
                      value={exercise.exercise_id}
                      onChange={(event) =>
                        handleExerciseChange(
                          exercise.id,
                          'exercise_id',
                          event.target.value
                        )
                      }
                      disabled={isLoadingExercises || availableExercises.length === 0}
                      required
                    >
                      <option value="">
                        {isLoadingExercises
                          ? 'A carregar exercícios...'
                          : 'Selecione um exercício'}
                      </option>
                      {availableExercises.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                          {item.category ? ` — ${item.category}` : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId={`exercise-sets-${exercise.id}`}>
                    <Form.Label>Séries</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      step="1"
                      value={exercise.sets}
                      onChange={(event) =>
                        handleExerciseChange(
                          exercise.id,
                          'sets',
                          event.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId={`exercise-repetitions-${exercise.id}`}>
                    <Form.Label>Repetições</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      step="1"
                      value={exercise.repetitions}
                      onChange={(event) =>
                        handleExerciseChange(
                          exercise.id,
                          'repetitions',
                          event.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId={`exercise-weight-${exercise.id}`}>
                    <Form.Label>Peso (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="1"
                      value={exercise.weigth}
                      onChange={(event) =>
                        handleExerciseChange(
                          exercise.id,
                          'weigth',
                          event.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>

                  {exercises.length > 1 && (
                    <Button
                      variant="outline-secondary"
                      type="button"
                      aria-label={`Remover exercício ${index + 1}`}
                      onClick={() => removeExercise(exercise.id)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="workout-actions">
            <Button
              variant="primary"
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingExercises ||
                Boolean(exerciseLoadError) ||
                availableExercises.length === 0
              }
            >
              {isSubmitting ? 'A criar...' : 'Criar treino'}
            </Button>
          </div>
        </Form>

        {submitError && (
          <p className="text-danger mt-3" role="alert">
            {submitError}
          </p>
        )}

        {isSubmitted && (
          <p className="text-success mt-3" role="status">
            Treino criado com sucesso.
          </p>
        )}
      </div>
    </main>
  );
};

export default CreateWorkout;