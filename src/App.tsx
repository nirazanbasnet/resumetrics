import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import ResumeList from './pages/ResumeList';
import Details from './pages/Details';
import JobMatchDetails from './pages/JobMatchDetails';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume-score" element={<Upload />} />
          <Route path="/resumes" element={<ResumeList />} />
          <Route path="/resume/:id" element={<Details />} />
          <Route path="/job-matching-cv" element={<JobMatchDetails />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;