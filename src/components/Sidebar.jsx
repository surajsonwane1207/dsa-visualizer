import React, { useState } from 'react';
import { BarChart2, Compass, Link2, Layers, GitPullRequest, Menu, X } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'sorting', label: 'Sorting Algorithms', icon: <BarChart2 size={20} /> },
    { id: 'pathfinding', label: 'Pathfinding Visualizer', icon: <Compass size={20} /> },
    { id: 'linkedlist', label: 'Linked List', icon: <Link2 size={20} /> },
    { id: 'stackqueue', label: 'Stack & Queue', icon: <Layers size={20} /> },
    { id: 'tree', label: 'Binary Search Tree', icon: <GitPullRequest size={20} /> }
  ];

  const handleItemClick = (id) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div
        className="glass-panel"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          zIndex: 40,
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          '@media (maxWidth: 768px)': {
            display: 'flex'
          }
        }}
        className="mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="text-gradient"
            style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}
          >
            DSA Visualizer
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar container */}
      <div
        className={`glass-panel sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          minWidth: '280px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          zIndex: 50,
          transition: 'transform var(--transition-normal)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Brand/Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'var(--accent-gradient)',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <BarChart2 size={24} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '20px', lineHeight: '1.2', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                DSA Lab
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                ALGORITHM PLAYGROUND
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid transparent',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="sidebar-link"
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: isActive ? 'white' : 'var(--accent-primary)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            ENGINE VERSION 1.0.0
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Built with React & Vanilla CSS
          </span>
        </div>
      </div>

      {/* CSS injection for responsiveness (Sidebar drawer, etc.) */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 60px !important;
            left: 0 !important;
            height: calc(100vh - 60px) !important;
            transform: translateX(-100%);
            border-right: 1px solid var(--border-color) !important;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-header {
            display: flex !important;
          }
          .main-content {
            padding-top: 80px !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
        }
        .sidebar-link:hover {
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.15);
          color: var(--text-primary);
        }
        .sidebar-link:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}
