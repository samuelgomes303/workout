import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import './CreateWorkout.css';

const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Data não indicada';

    const parsedDate = new Date(dateTime);
    if (Number.isNaN(parsedDate.getTime())) return dateTime;

    return parsedDate.toLocaleString('pt-PT');
};

const ScheduleWorkout = () => {
    const [workouts, setWorkouts] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [workoutId, setWorkoutId] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoadError('Inicie sessão para consultar e agendar treinos.');
                setIsLoading(false);
                return;
            }

            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [workoutsResponse, schedulesResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/v1/workout/list', {
                        headers,
                        signal: controller.signal,
                    }),
                    fetch('http://localhost:8080/api/v1/schedule/list', {
                        headers,
                        signal: controller.signal,
                    }),
                ]);

                if (!workoutsResponse.ok) {
                    throw new Error(`Falha ao carregar treinos (${workoutsResponse.status}).`);
                }
                if (!schedulesResponse.ok) {
                    throw new Error(`Falha ao carregar agendamentos (${schedulesResponse.status}).`);
                }

                const [workoutsData, schedulesData] = await Promise.all([
                    workoutsResponse.json(),
                    schedulesResponse.json(),
                ]);

                if (!Array.isArray(workoutsData) || !Array.isArray(schedulesData)) {
                    throw new Error('A API devolveu dados de agendamento num formato inválido.');
                }

                setWorkouts(workoutsData);
                setSchedules(schedulesData);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setLoadError(
                        error instanceof Error ? error.message : 'Erro ao carregar os dados.'
                    );
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        loadData();
        return () => controller.abort();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setSubmitError('A sua sessão expirou. Inicie sessão novamente.');
            return;
        }

        const selectedWorkout = workouts.find(
            (workout) => String(workout.id) === workoutId
        );
        if (!selectedWorkout) {
            setSubmitError('Selecione um treino válido.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/schedule/create/${selectedWorkout.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: selectedWorkout.name,
                        date,
                    }),
                }
            );

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(
                    responseText || `Falha ao criar agendamento (${response.status}).`
                );
            }

            const createdSchedule = await response.json();
            setSchedules((current) => [...current, createdSchedule]);
            setWorkoutId('');
            setDate('');
            setSuccessMessage('Treino agendado com sucesso.');
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Não foi possível criar o agendamento.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="workout-page">
            <Container className="workout-form-card">
                <header className="workout-heading">
                    <span className="workout-eyebrow">PLANEAMENTO</span>
                    <h1>Agendar treino</h1>
                    <p>Escolha um plano e defina a data e hora do agendamento.</p>
                </header>

                {isLoading && (
                    <div className="d-flex align-items-center gap-2" role="status">
                        <Spinner animation="border" size="sm" />
                        <span>A carregar...</span>
                    </div>
                )}
                {!isLoading && loadError && <Alert variant="danger">{loadError}</Alert>}

                {!isLoading && !loadError && (
                    <>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="scheduleWorkout">
                                <Form.Label>Treino</Form.Label>
                                <Form.Select
                                    value={workoutId}
                                    onChange={(event) => setWorkoutId(event.target.value)}
                                    required
                                >
                                    <option value="">Selecione um treino</option>
                                    {workouts.map((workout) => (
                                        <option key={workout.id} value={workout.id}>
                                            {workout.name} ({workout.state})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="scheduleDate">
                                <Form.Label>Data e hora</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required
                                />
                            </Form.Group>

                            {workouts.length === 0 && (
                                <Alert variant="info">
                                    Crie primeiro um treino para o poder agendar.
                                </Alert>
                            )}
                            {submitError && <Alert variant="danger" role="alert">{submitError}</Alert>}
                            {successMessage && <Alert variant="success" role="status">{successMessage}</Alert>}

                            <Button type="submit" disabled={isSubmitting || workouts.length === 0}>
                                {isSubmitting ? 'A agendar...' : 'Agendar treino'}
                            </Button>
                        </Form>

                        <section className="exercise-section" aria-labelledby="schedule-list-heading">
                            <h2 id="schedule-list-heading">Agendamentos existentes</h2>
                            {schedules.length === 0 ? (
                                <p className="text-muted">Ainda não tem treinos agendados.</p>
                            ) : (
                                <div className="d-grid gap-3">
                                    {schedules.map((schedule) => (
                                        <Card key={schedule.id}>
                                            <Card.Body>
                                                <Card.Title>{schedule.title}</Card.Title>
                                                <Card.Text>
                                                    Data: {formatDateTime(schedule.dataTimeSchedule)}
                                                </Card.Text>
                                                <Card.Text>Estado: {schedule.stateWorkout}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </Container>
        </main>
    );
};

export default ScheduleWorkout;