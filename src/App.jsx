import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
