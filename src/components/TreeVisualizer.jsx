import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, ArrowRight, BookOpen, GitCommit } from 'lucide-react';

export default function TreeVisualizer() {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodeVal, setActiveNodeVal] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [statusText, setStatusText] = useState('Ready');
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Initialize with some default nodes
  useEffect(() => {
    let root = { val: 20, left: null, right: null };
    root = insertHelper(root, 10);
    root = insertHelper(root, 30);
    root = insertHelper(root, 5);
    root = insertHelper(root, 15);
    root = insertHelper(root, 25);
    root = insertHelper(root, 35);
    setTree(root);
  }, []);

  // Tree depth helper to limit depth
  const getDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  };

  // Plain JS insertion helper
  const insertHelper = (root, val) => {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) {
      root.left = insertHelper(root.left, val);
    } else if (val > root.val) {
      root.right = insertHelper(root.right, val);
    }
    return root;
  };

  const handleInsert = async () => {
    if (inputValue === '') return;
    const val = parseInt(inputValue, 10);
    setInputValue('');
    
    if (isRunning) return;
    setIsRunning(true);
    setHighlightedNodes(new Set());
    
    // Simulate traversal path
    let curr = tree;
    const path = [];
    while (curr) {
      path.push(curr.val);
      if (val === curr.val) {
        setStatusText(`Value ${val} already exists in the BST!`);
        setIsRunning(false);
        return;
      }
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    // Highlight traversal path
    for (const stepVal of path) {
      setActiveNodeVal(stepVal);
      setStatusText(`Comparing ${val} with node ${stepVal}...`);
      await sleep(600);
    }

    // Clone tree and insert
    const tempTree = JSON.parse(JSON.stringify(tree));
    
    // Check height limitation
    const previewTree = insertHelper(tempTree, val);
    if (getDepth(previewTree) > 4) {
      setStatusText('Tree depth limit reached (max 4 levels allowed to prevent overlap).');
      setActiveNodeVal(null);
      setIsRunning(false);
      return;
    }

    setTree(previewTree);
    setActiveNodeVal(val);
    setStatusText(`Successfully inserted ${val} into the tree.`);
    await sleep(600);
    setActiveNodeVal(null);
    setIsRunning(false);
  };

  // Plain JS deletion helper
  const deleteHelper = (root, val) => {
    if (!root) return null;
    if (val < root.val) {
      root.left = deleteHelper(root.left, val);
    } else if (val > root.val) {
      root.right = deleteHelper(root.right, val);
    } else {
      // Node to delete found
      if (!root.left && !root.right) return null;
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      
      // Node has two children: Find inorder successor (min in right subtree)
      let successor = root.right;
      while (successor.left) successor = successor.left;
      root.val = successor.val;
      root.right = deleteHelper(root.right, successor.val);
    }
    return root;
  };

  const handleDelete = async () => {
    if (inputValue === '') return;
    const val = parseInt(inputValue, 10);
    setInputValue('');

    if (isRunning) return;
    setIsRunning(true);
    setHighlightedNodes(new Set());

    // Traverse and search node to delete
    let curr = tree;
    const path = [];
    let found = false;
    while (curr) {
      path.push(curr.val);
      if (val === curr.val) {
        found = true;
        break;
      }
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    for (const stepVal of path) {
      setActiveNodeVal(stepVal);
      setStatusText(`Searching for ${val} to delete... comparing with ${stepVal}`);
      await sleep(600);
    }

    if (!found) {
      setStatusText(`Value ${val} not found in tree. Nothing to delete.`);
      setActiveNodeVal(null);
      setIsRunning(false);
      return;
    }

    setStatusText(`Node ${val} found. Restructuring tree nodes...`);
    await sleep(600);

    const tempTree = JSON.parse(JSON.stringify(tree));
    const nextTree = deleteHelper(tempTree, val);
    setTree(nextTree);
    
    setStatusText(`Deleted node ${val} from BST.`);
    setActiveNodeVal(null);
    setIsRunning(false);
  };

  const handleSearch = async () => {
    if (inputValue === '') return;
    const val = parseInt(inputValue, 10);
    setInputValue('');

    if (isRunning) return;
    setIsRunning(true);
    setHighlightedNodes(new Set());

    let curr = tree;
    const path = [];
    let found = false;

    while (curr) {
      path.push(curr.val);
      if (val === curr.val) {
        found = true;
        break;
      }
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    for (const stepVal of path) {
      setActiveNodeVal(stepVal);
      setStatusText(`Searching: Comparing ${val} with node ${stepVal}...`);
      await sleep(700);
    }

    if (found) {
      setHighlightedNodes(new Set([val]));
      setStatusText(`Target value ${val} found in the tree!`);
    } else {
      setStatusText(`Target value ${val} not found in the BST.`);
    }

    setActiveNodeVal(null);
    setIsRunning(false);
  };

  // Traversals Recording
  const getInorderList = (node, arr = []) => {
    if (!node) return arr;
    getInorderList(node.left, arr);
    arr.push(node.val);
    getInorderList(node.right, arr);
    return arr;
  };

  const getPreorderList = (node, arr = []) => {
    if (!node) return arr;
    arr.push(node.val);
    getPreorderList(node.left, arr);
    getPreorderList(node.right, arr);
    return arr;
  };

  const getPostorderList = (node, arr = []) => {
    if (!node) return arr;
    getPostorderList(node.left, arr);
    getPostorderList(node.right, arr);
    arr.push(node.val);
    return arr;
  };

  const runTraversal = async (type) => {
    if (isRunning || !tree) return;
    setIsRunning(true);
    setHighlightedNodes(new Set());

    let list = [];
    if (type === 'inorder') list = getInorderList(tree);
    else if (type === 'preorder') list = getPreorderList(tree);
    else if (type === 'postorder') list = getPostorderList(tree);

    setTraversalOrder([]);
    setStatusText(`Running ${type.toUpperCase()} traversal...`);

    const visited = new Set();
    for (let i = 0; i < list.length; i++) {
      const val = list[i];
      setActiveNodeVal(val);
      visited.add(val);
      setHighlightedNodes(new Set(visited));
      setTraversalOrder((prev) => [...prev, val]);
      setStatusText(`Visited: ${val}`);
      await sleep(700);
    }

    setStatusText(`${type.toUpperCase()} traversal completed: ${list.join(' → ')}`);
    setActiveNodeVal(null);
    setIsRunning(false);
  };

  // Render SVG nodes recursively
  const renderNodes = (node, x, y, spacingX, parentX = null, parentY = null) => {
    if (!node) return null;

    const elements = [];

    // Line connector to parent
    if (parentX !== null && parentY !== null) {
      elements.push(
        <line
          key={`line-${node.val}`}
          x1={parentX}
          y1={parentY}
          x2={x}
          y2={y}
          stroke="var(--border-color)"
          strokeWidth="2"
          className="tree-edge-line"
        />
      );
    }

    // Left child branch
    if (node.left) {
      elements.push(...renderNodes(node.left, x - spacingX, y + 65, spacingX / 1.8, x, y));
    }

    // Right child branch
    if (node.right) {
      elements.push(...renderNodes(node.right, x + spacingX, y + 65, spacingX / 1.8, x, y));
    }

    const isActive = node.val === activeNodeVal;
    const isHighlighted = highlightedNodes.has(node.val);

    let nodeColor = '#11131e'; // bg-card
    let strokeColor = 'var(--border-color)';
    let radius = 20;

    if (isActive) {
      nodeColor = 'rgba(245, 158, 11, 0.2)';
      strokeColor = 'var(--color-warning)';
      radius = 24; // pop out effect
    } else if (isHighlighted) {
      nodeColor = 'rgba(139, 92, 246, 0.2)';
      strokeColor = 'var(--accent-primary)';
    }

    // Add node circle and text
    elements.push(
      <g key={`node-g-${node.val}`} style={{ cursor: 'pointer' }}>
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={nodeColor}
          stroke={strokeColor}
          strokeWidth="3"
          className="tree-node-circle"
          style={{ transition: 'all 0.25s ease' }}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="14px"
          fontWeight="bold"
          style={{ userSelect: 'none' }}
        >
          {node.val}
        </text>
      </g>
    );

    return elements;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
      {/* Controls panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-control"
            style={{ width: '80px' }}
            disabled={isRunning}
          />
          <button className="btn-primary" onClick={handleInsert} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '13px' }}>
            <Plus size={14} /> Insert
          </button>
          <button className="btn-secondary" onClick={handleSearch} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '13px' }}>
            <Search size={14} /> Find
          </button>
          <button className="btn-secondary" onClick={handleDelete} disabled={isRunning} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 14px', fontSize: '13px' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }} />

        {/* Traversal triggers */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => runTraversal('inorder')} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '13px' }}>
            Inorder (LVR)
          </button>
          <button className="btn-secondary" onClick={() => runTraversal('preorder')} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '13px' }}>
            Preorder (VLR)
          </button>
          <button className="btn-secondary" onClick={() => runTraversal('postorder')} disabled={isRunning} style={{ padding: '8px 14px', fontSize: '13px' }}>
            Postorder (LRV)
          </button>
        </div>
      </div>

      {/* Main tree SVG Canvas */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '380px', position: 'relative' }}>
        {/* Logger console */}
        <div
          style={{
            alignSelf: 'stretch',
            backgroundColor: '#0c0d15',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            padding: '10px 16px',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: activeNodeVal ? 'var(--color-warning)' : 'var(--text-secondary)'
          }}
        >
          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Tree status:</span> {statusText}
        </div>

        {/* Inorder progress visual track */}
        {traversalOrder.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', fontSize: '13px', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: '600' }}>Traversal Output:</span>
            {traversalOrder.map((val, idx) => (
              <React.Fragment key={idx}>
                <span style={{ padding: '3px 8px', background: 'rgba(139,92,246,0.15)', borderRadius: '4px', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent-primary)', fontWeight: '600' }}>
                  {val}
                </span>
                {idx < traversalOrder.length - 1 && <ArrowRight size={12} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Tree Render viewport */}
        <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          {!tree ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '15px', fontStyle: 'italic', margin: '80px 0' }}>
              BST is empty. Insert elements to construct the tree!
            </div>
          ) : (
            <svg width="680" height="300" style={{ display: 'block', margin: '0 auto' }}>
              {renderNodes(tree, 340, 30, 120)}
            </svg>
          )}
        </div>
      </div>

      {/* Info explanations cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GitCommit size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>BST Time Complexities</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)' }}>Operation</th>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Average</th>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Worst (Skewed)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Search Key</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(log N)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Insert Key</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(log N)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Delete Key</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(log N)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Space Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)' }} colSpan={2}>O(N)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>How BST Recursion Works</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            A **Binary Search Tree (BST)** is a binary tree where for each node, its **left child** contains values smaller than the node, and its **right child** contains values larger.
            <br /><br />
            - **Inorder** (Left-Visit-Right) visits nodes in ascending, sorted order.
            <br />
            - **Preorder** (Visit-Left-Right) is useful for cloning or serializing trees.
            <br />
            - **Postorder** (Left-Right-Visit) is standard for deletion and calculating tree sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
