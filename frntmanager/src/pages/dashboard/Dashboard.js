import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Container className="py-5">
      <h1 className="mb-3">Dashboard</h1>
      <p className="text-muted">Planeie e organize os seus treinos.</p>
      <Button as={Link} to="/workouts/create" variant="primary">
        Criar treino
      </Button>
      <Button as={Link} to="/workouts/list" variant="primary">
        Visualizar os meus treinos
      </Button>
      <Button as={Link} to="/workouts/schedule" variant="primary">
        Fazer agendamento de treino
      </Button>
      <Button as={Link} to="/workouts/report" variant="primary">
        Gerar relatório
      </Button>
    </Container>
  );
}

export default Dashboard;
