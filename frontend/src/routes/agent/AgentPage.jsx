import "./agentPage.css";

const AgentPage = () => {
  return (
    <div className="agent-page">
      <div className="agent-hero">
        <h1>Connect with Our Property Experts</h1>
        <p>
          Our dedicated agents are here to guide you through every step of your real estate journey—whether buying, selling, or renting.
        </p>
      </div>

      <div className="agent-list">
        <div className="agent-card">
          <div className="agent-info">
            <p><strong>Phone:</strong> <a href="tel:9103120272">9103120272</a></p>
          </div>
        </div>
        <div className="agent-card">
          <div className="agent-info">
            <p><strong>Phone:</strong> <a href="tel:6006224407">6006224407</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
