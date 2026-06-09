import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import StackQueueVisualizer from './components/StackQueueVisualizer';
import TreeVisualizer from './components/TreeVisualizer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('sorting');

  const renderContent = () => {
    switch (activeTab) {
      case 'sorting':
        return <SortingVisualizer />;
      case 'pathfinding':
        return <PathfindingVisualizer />;
      case 'linkedlist':
        return <LinkedListVisualizer />;
      case 'stackqueue':
        return <StackQueueVisualizer />;
      case 'tree':
        return <TreeVisualizer />;
      default:
        return <SortingVisualizer />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
          height: '100vh'
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
