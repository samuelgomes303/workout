import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './pages/header/Header';
import NoMatch from './pages/nomatch/NoMatch';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import CreateWorkout from './pages/menu/CreateWorkout';
import ListWorkout from './pages/menu/ListWorkout';
import ScheduleWorkout from './pages/menu/ScheduleWorkout';
import ReportWorkout from './pages/menu/ReportWorkout';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/workouts/create' element={<CreateWorkout/>}/>
        <Route path='/workouts/list' element={<ListWorkout/>}/>
        <Route path='/workouts/schedule' element={<ScheduleWorkout/>}/>
        <Route path='/workouts/report' element={<ReportWorkout/>}/>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='*' element={<NoMatch/>} />
      </Routes>
    </>
  );
}

export default App;
