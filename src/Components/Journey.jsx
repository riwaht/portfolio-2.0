import Navbar from './Navbar';
import Footer from './Footer';
import JourneyBoard from './Journey/JourneyBoard';
import '../styles.css';

function Journey() {
  return (
    <div className="page-container">
      <Navbar />
      <JourneyBoard />
      <Footer />
    </div>
  );
}

export default Journey;
