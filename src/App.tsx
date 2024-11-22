import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import ResumeList from './pages/ResumeList';
import Details from './pages/Details';
import { Toaster } from './components/ui/toaster';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/resumes" element={<ResumeList />} />
          <Route path="/resume/:id" element={<Details />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;