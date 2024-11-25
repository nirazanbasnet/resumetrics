import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import ResumeList from './pages/ResumeList';
import Details from './pages/Details';
import JobMatchDetails from './pages/JobMatchDetails';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';
import LinkedInProfileAnalyzer from './pages/LinkedInProfileAnalyzer';
import InterviewPrep from './pages/InterviewPrep';
import MarketIntelligence from './pages/MarketIntelligence';
import InterviewCoach from './pages/InterviewCoach';
import AdminUserList from './pages/AdminUserList';


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
          <Route path="/linkeding-profile-analyzer" element={<LinkedInProfileAnalyzer />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/market-intelligence" element={<MarketIntelligence />} />
          <Route path="/ai-interview-coach" element={<InterviewCoach />} />
          <Route path="/admin-user-list" element={<AdminUserList />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;