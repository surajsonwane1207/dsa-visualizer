import React, { useState, useRef } from 'react';
import { Plus, Trash2, Search, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function LinkedListVisualizer() {
  const [list, setList] = useState([
    { id: 1, val: 12 },
    { id: 2, val: 45 },
    { id: 3, val: 89 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchFoundIndex, setSearchFoundIndex] = useState(-1);
  const [statusText, setStatusText] = useState('Ready');
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper to generate unique IDs
  const generateId = () => Math.floor(Math.random() * 1000000);

  const runTraversal = async (targetIdx) => {
    setActiveIndex(-1);
    setSearchFoundIndex(-1);
    const limit = Math.min(targetIdx, list.length - 1);
    
    for (let i = 0; i <= limit; i++) {
      setActiveIndex(i);
      setStatusText(`Traversing node ${i} (value: ${list[i].val})...`);
      await sleep(600);
    }
  };

  const handleInsertHead = async () => {
    if (isRunning) return;
    if (inputValue === '') {
      setStatusText('Please enter a value.');
      return;
    }
    setIsRunning(true);
    setStatusText('Inserting value at head...');
    setActiveIndex(0);
    await sleep(500);

    const val = parseInt(inputValue, 10);
    setList((prev) => [{ id: generateId(), val }, ...prev]);
    setInputValue('');
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText(`Successfully inserted ${val} at the Head.`);
  };

  const handleInsertTail = async () => {
    if (isRunning) return;
    if (inputValue === '') {
      setStatusText('Please enter a value.');
      return;
    }
    setIsRunning(true);
    
    // Traverse to the end
    await runTraversal(list.length - 1);
    setStatusText('Reached tail. Creating new node and updating pointers...');
    await sleep(600);

    const val = parseInt(inputValue, 10);
    setList((prev) => [...prev, { id: generateId(), val }]);
    setInputValue('');
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText(`Successfully inserted ${val} at the Tail.`);
  };

  const handleInsertAtIndex = async () => {
    if (isRunning) return;
    if (inputValue === '' || inputIndex === '') {
      setStatusText('Please enter both value and index.');
      return;
    }
    const idx = parseInt(inputIndex, 10);
    if (idx < 0 || idx > list.length) {
      setStatusText(`Invalid index. Must be between 0 and ${list.length}.`);
      return;
    }
    
    setIsRunning(true);

    if (idx === 0) {
      setIsRunning(false);
      handleInsertHead();
      return;
    }

    // Traverse to idx - 1
    await runTraversal(idx - 1);
    setStatusText(`Reached node at index ${idx - 1}. Inserting new node and rewiring next pointers...`);
    await sleep(800);

    const val = parseInt(inputValue, 10);
    setList((prev) => {
      const next = [...prev];
      next.splice(idx, 0, { id: generateId(), val });
      return next;
    });

    setInputValue('');
    setInputIndex('');
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText(`Successfully inserted ${val} at index ${idx}.`);
  };

  const handleDeleteHead = async () => {
    if (isRunning) return;
    if (list.length === 0) {
      setStatusText('List is already empty.');
      return;
    }
    setIsRunning(true);
    setStatusText('Deleting head node. Shifting pointer to head.next...');
    setActiveIndex(0);
    await sleep(700);

    setList((prev) => prev.slice(1));
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText('Deleted Head node.');
  };

  const handleDeleteTail = async () => {
    if (isRunning) return;
    if (list.length === 0) {
      setStatusText('List is already empty.');
      return;
    }
    setIsRunning(true);

    if (list.length === 1) {
      setIsRunning(false);
      handleDeleteHead();
      return;
    }

    // Traverse to second-to-last node
    await runTraversal(list.length - 2);
    setStatusText('Reached second-to-last node. Severing connection to tail node...');
    await sleep(700);

    setList((prev) => prev.slice(0, -1));
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText('Deleted Tail node.');
  };

  const handleDeleteAtIndex = async () => {
    if (isRunning) return;
    if (inputIndex === '') {
      setStatusText('Please enter an index.');
      return;
    }
    const idx = parseInt(inputIndex, 10);
    if (idx < 0 || idx >= list.length) {
      setStatusText(`Invalid index. Must be between 0 and ${list.length - 1}.`);
      return;
    }

    setIsRunning(true);

    if (idx === 0) {
      setIsRunning(false);
      handleDeleteHead();
      return;
    }

    // Traverse to idx - 1
    await runTraversal(idx - 1);
    setStatusText(`Reached node at index ${idx - 1}. Updating next pointer to skip node at index ${idx}...`);
    await sleep(800);

    setList((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });

    setInputIndex('');
    setActiveIndex(-1);
    setIsRunning(false);
    setStatusText(`Deleted node at index ${idx}.`);
  };

  const handleSearch = async () => {
    if (isRunning) return;
    if (inputValue === '') {
      setStatusText('Please enter a search value.');
      return;
    }
    setIsRunning(true);
    setSearchFoundIndex(-1);

    const val = parseInt(inputValue, 10);
    let foundIdx = -1;

    for (let i = 0; i < list.length; i++) {
      setActiveIndex(i);
      setStatusText(`Comparing node ${i} (value: ${list[i].val}) with search target ${val}...`);
      await sleep(650);
      
      if (list[i].val === val) {
        foundIdx = i;
        setSearchFoundIndex(i);
        setStatusText(`Match found! Node with value ${val} is at index ${i}.`);
        break;
      }
    }

    if (foundIdx === -1) {
      setStatusText(`Finished searching. Value ${val} not found in the list.`);
    }

    setInputValue('');
    setActiveIndex(-1);
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
      {/* Controls Container */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        {/* Value Inputs */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-control"
            style={{ width: '90px' }}
            disabled={isRunning}
          />
          <input
            type="number"
            placeholder="Index"
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            className="input-control"
            style={{ width: '90px' }}
            disabled={isRunning}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleInsertHead} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '14px' }}>
            <Plus size={14} /> Insert Head
          </button>
          <button className="btn-primary" onClick={handleInsertTail} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '14px' }}>
            <Plus size={14} /> Insert Tail
          </button>
          <button className="btn-primary" onClick={handleInsertAtIndex} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '14px' }}>
            <Plus size={14} /> Insert At Index
          </button>
          <button className="btn-secondary" onClick={handleSearch} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '14px' }}>
            <Search size={14} /> Search
          </button>
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }} />

        {/* Deletion Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleDeleteHead} disabled={isRunning} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '8px 14px', fontSize: '14px' }}>
            <Trash2 size={14} /> Del Head
          </button>
          <button className="btn-secondary" onClick={handleDeleteTail} disabled={isRunning} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '8px 14px', fontSize: '14px' }}>
            <Trash2 size={14} /> Del Tail
          </button>
          <button className="btn-secondary" onClick={handleDeleteAtIndex} disabled={isRunning} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '8px 14px', fontSize: '14px' }}>
            <Trash2 size={14} /> Del Index
          </button>
        </div>
      </div>

      {/* Visual Canvas Block */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '320px', justifyContent: 'center' }}>
        {/* Traversal Logs Console */}
        <div
          style={{
            alignSelf: 'stretch',
            backgroundColor: '#0c0d15',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            padding: '12px 16px',
            marginBottom: '40px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: activeIndex !== -1 ? 'var(--color-warning)' : searchFoundIndex !== -1 ? 'var(--color-success)' : 'var(--text-secondary)'
          }}
        >
          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Console log:</span> {statusText}
        </div>

        {/* Nodes Canvas */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', width: '100%' }}>
          {list.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '16px', fontStyle: 'italic' }}>
              Linked List is empty. Insert a node to get started!
            </div>
          ) : (
            list.map((node, idx) => {
              const isActive = idx === activeIndex;
              const isFound = idx === searchFoundIndex;

              let nodeBorder = 'var(--border-color)';
              let nodeBg = 'rgba(21, 23, 34, 0.8)';
              let nodeShadow = 'none';

              if (isActive) {
                nodeBorder = 'var(--color-warning)';
                nodeBg = 'rgba(245, 158, 11, 0.15)';
                nodeShadow = '0 0 15px rgba(245, 158, 11, 0.3)';
              } else if (isFound) {
                nodeBorder = 'var(--color-success)';
                nodeBg = 'rgba(16, 185, 129, 0.15)';
                nodeShadow = '0 0 15px rgba(16, 185, 129, 0.3)';
              }

              return (
                <React.Fragment key={node.id}>
                  {/* Linked List Node */}
                  <div
                    className="node-enter"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '90px',
                      borderRadius: '12px',
                      border: `2px solid ${nodeBorder}`,
                      background: nodeBg,
                      boxShadow: nodeShadow,
                      overflow: 'hidden',
                      transition: 'border-color 0.25s, background-color 0.25s, box-shadow 0.25s'
                    }}
                  >
                    {/* Index header */}
                    <div style={{ padding: '4px', fontSize: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>
                      INDEX {idx}
                    </div>
                    {/* Node value */}
                    <div style={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {node.val}
                    </div>
                    {/* Node Pointer block */}
                    <div style={{ padding: '4px', fontSize: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)' }}>
                      {idx === list.length - 1 ? 'NULL' : 'NEXT →'}
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {idx < list.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--color-warning)' : 'var(--text-muted)', transition: 'color 0.25s' }}>
                      <ArrowRight size={24} style={{ animation: isActive ? 'pulse 1s infinite' : '' }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>

      {/* Narrative cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Linked List Complexities</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Access Element</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Search Element</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Insertion (Head)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Insertion (Tail)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>O(1) <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(if pointer kept)</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Deletion (Head)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Deletion (Tail)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Linked List Details</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains a <b>data field</b> and a <b>next pointer</b> pointing to the next node in the sequence. 
            <br /><br />
            To insert or delete at a custom index, we must traverse the list from the Head (O(N) time) until we reach the element directly preceding the target index.
          </p>
        </div>
      </div>
    </div>
  );
}
