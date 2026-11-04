import { useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import './CreateWorkout.css';

const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('pt-PT');
};

const formatDuration = (value) => {
    if (!value) return '0 segundos';
    if (typeof value !== 'string') return String(value);

    const match = value.match(
        /^(-)?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/
    );
    if (!match) return value;

    const [, sign, days = '0', hours = '0', minutes = '0', seconds = '0'] = match;
    const parts = [];
    if (Number(days)) parts.push(`${days} dia(s)`);
    if (Number(hours)) parts.push(`${hours} hora(s)`);
    if (Number(minutes)) parts.push(`${minutes} minuto(s)`);
    if (Number(seconds)) parts.push(`${seconds} segundo(s)`);

    return `${sign ? '- ' : ''}${parts.length ? parts.join(', ') : '0 segundos'}`;
};

const ReportWorkout = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setReport(null);

        if (start >= end) {
            setError('A data/hora inicial tem de ser anterior à final.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('A sua sessão expirou. Inicie sessão novamente.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/workout/generateReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ start, end }),
            });

            if (!response.ok) {
                const body = await response.text();
                let message = `Não foi possível gerar o relatório (${response.status}).`;
                if (body) {
                    try {
                        const parsed = JSON.parse(body);
                        message = parsed.message || parsed.error || message;
                    } catch {
                        message = body;
                    }
                }
                throw new Error(message);
            }

            setReport(await response.json());
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Erro ao comunicar com o servidor.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="workout-page">
            <Container className="workout-form-card">
                <header className="workout-heading">
                    <span className="workout-eyebrow">PROGRESSO</span>
                    <h1>Relatório de treinos</h1>
                    <p>Escolha o período para consultar os treinos concluídos.</p>
                </header>

                <Form onSubmit={handleSubmit}>
                    <div className="workout-fields">
                        <Form.Group controlId="reportStart">
                            <Form.Label>De</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={start}
                                onChange={(event) => setStart(event.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reportEnd">
                            <Form.Label>Até</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={end}
                                onChange={(event) => setEnd(event.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    {error && <Alert className="mt-3" variant="danger" role="alert">{error}</Alert>}

                    <div className="workout-actions">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <><Spinner size="sm" className="me-2" />A gerar...</> : 'Gerar relatório'}
                        </Button>
                    </div>
                </Form>

                {report && (
                    <section className="exercise-section" aria-labelledby="report-result-heading">
                        <h2 id="report-result-heading">Resultado</h2>
                        <div className="d-grid gap-3 mt-3">
                            <Card><Card.Body>
                                <Card.Subtitle className="text-muted">Treinos concluídos</Card.Subtitle>
                                <Card.Title className="mt-2">{report.nrWorkoutCompleted ?? 0}</Card.Title>
                            </Card.Body></Card>
                            <Card><Card.Body>
                                <Card.Subtitle className="text-muted">Tempo total</Card.Subtitle>
                                <Card.Title className="h5 mt-2">{formatDuration(report.totalTimeSpent)}</Card.Title>
                            </Card.Body></Card>
                            <Card><Card.Body>
                                <Card.Subtitle className="text-muted">Duração média</Card.Subtitle>
                                <Card.Title className="h5 mt-2">{formatDuration(report.averageTimeSpent)}</Card.Title>
                            </Card.Body></Card>
                            <Card><Card.Body>
                                <Card.Subtitle className="text-muted">Treino mais longo</Card.Subtitle>
                                <Card.Title className="h5 mt-2">{formatDuration(report.longestDuration)}</Card.Title>
                            </Card.Body></Card>
                            <Card><Card.Body>
                                <Card.Subtitle className="text-muted">Treino mais curto</Card.Subtitle>
                                <Card.Title className="h5 mt-2">{formatDuration(report.shortestDuration)}</Card.Title>
                            </Card.Body></Card>
                        </div>
                        {report.date && (
                            <p className="text-muted mt-3 mb-0">
                                Relatório gerado em {formatDateTime(report.date)}
                            </p>
                        )}
                    </section>
                )}
            </Container>
        </main>
    );
};

export default ReportWorkout;