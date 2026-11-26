import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Container className="dashboard">
      <header className="dashboard__header">
        <span className="dashboard__eyebrow">WORKOUT MANAGER</span>
        <h1>O próximo treino começa aqui.</h1>
        <p>Planeie a sua rotina, acompanhe o progresso e mantenha-se em movimento.</p>
      </header>

      <nav className="dashboard__actions" aria-label="Ações de treino">
        <Button as={Link} to="/workouts/create" className="dashboard__action" variant="light">
          <span className="dashboard__action-copy">
            <span className="dashboard__action-label">PLANEAR</span>
            <span className="dashboard__action-title">Criar treino</span>
            <span className="dashboard__action-description">Monte uma nova rotina de exercícios.</span>
          </span>
          <span className="dashboard__arrow" aria-hidden="true">↗</span>
      </Button>
        <Button as={Link} to="/workouts/list" className="dashboard__action" variant="light">
          <span className="dashboard__action-copy">
            <span className="dashboard__action-label">ACOMPANHAR</span>
            <span className="dashboard__action-title">Os meus treinos</span>
            <span className="dashboard__action-description">Consulte e atualize as suas rotinas.</span>
          </span>
          <span className="dashboard__arrow" aria-hidden="true">↗</span>
      </Button>
        <Button as={Link} to="/workouts/schedule" className="dashboard__action" variant="light">
          <span className="dashboard__action-copy">
            <span className="dashboard__action-label">ORGANIZAR</span>
            <span className="dashboard__action-title">Agendar treino</span>
            <span className="dashboard__action-description">Reserve tempo para a próxima sessão.</span>
          </span>
          <span className="dashboard__arrow" aria-hidden="true">↗</span>
      </Button>
        <Button as={Link} to="/workouts/report" className="dashboard__action" variant="light">
          <span className="dashboard__action-copy">
            <span className="dashboard__action-label">VER PROGRESSO</span>
            <span className="dashboard__action-title">Gerar relatório</span>
            <span className="dashboard__action-description">Veja como tem evoluído ao longo do tempo.</span>
          </span>
          <span className="dashboard__arrow" aria-hidden="true">↗</span>
      </Button>
      </nav>
    </Container>
  );
}

export default Dashboard;
