import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, RefreshCw, BookOpen, Layers } from 'lucide-react';

export default function StackQueueVisualizer() {
  const [stack, setStack] = useState([78, 45, 12]); // 12 is top, 78 is bottom
  const [queue, setQueue] = useState([23, 56, 89]); // 23 is front, 89 is rear
  const [stackInput, setStackInput] = useState('');
  const [queueInput, setQueueInput] = useState('');
  const [stackLogs, setStackLogs] = useState('Ready');
  const [queueLogs, setQueueLogs] = useState('Ready');
  
  const [isStackActive, setIsStackActive] = useState(false);
  const [isQueueActive, setIsQueueActive] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Stack Operations
  const handlePush = async () => {
    if (stackInput === '') return;
    const val = parseInt(stackInput, 10);
    setStackInput('');
    setIsStackActive(true);
    setStackLogs(`Pushing ${val} onto Stack...`);
    await sleep(400);

    setStack((prev) => [val, ...prev]); // prepend so index 0 is Top
    setStackLogs(`Pushed ${val} onto the Stack (Top).`);
    setIsStackActive(false);
  };

  const handlePop = async () => {
    if (stack.length === 0) {
      setStackLogs('Stack Underflow! Cannot pop from an empty stack.');
      return;
    }
    const poppedVal = stack[0];
    setIsStackActive(true);
    setStackLogs(`Popping ${poppedVal} from Stack...`);
    await sleep(400);

    setStack((prev) => prev.slice(1));
    setStackLogs(`Popped value ${poppedVal} from Stack.`);
    setIsStackActive(false);
  };

  const handleStackPeek = () => {
    if (stack.length === 0) {
      setStackLogs('Stack is empty.');
      return;
    }
    setStackLogs(`Peek: Element at Stack Top is ${stack[0]}.`);
  };

  const handleClearStack = () => {
    setStack([]);
    setStackLogs('Cleared Stack.');
  };

  // Queue Operations
  const handleEnqueue = async () => {
    if (queueInput === '') return;
    const val = parseInt(queueInput, 10);
    setQueueInput('');
    setIsQueueActive(true);
    setQueueLogs(`Enqueueing ${val} into Queue (Rear)...`);
    await sleep(400);

    setQueue((prev) => [...prev, val]); // append to the end
    setQueueLogs(`Enqueued ${val} at Queue Rear.`);
    setIsQueueActive(false);
  };

  const handleDequeue = async () => {
    if (queue.length === 0) {
      setQueueLogs('Queue Underflow! Cannot dequeue from an empty queue.');
      return;
    }
    const dequeuedVal = queue[0];
    setIsQueueActive(true);
    setQueueLogs(`Dequeuing ${dequeuedVal} from Queue (Front)...`);
    await sleep(400);

    setQueue((prev) => prev.slice(1));
    setQueueLogs(`Dequeued value ${dequeuedVal} from Queue.`);
    setIsQueueActive(false);
  };

  const handleQueuePeek = () => {
    if (queue.length === 0) {
      setQueueLogs('Queue is empty.');
      return;
    }
    setQueueLogs(`Peek: Element at Queue Front is ${queue[0]}.`);
  };

  const handleClearQueue = () => {
    setQueue([]);
    setQueueLogs('Cleared Queue.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
      
      {/* Side by side layout for Stack and Queue visualizers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Stack section */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} className="text-gradient" /> Stack (LIFO)
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Val"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                className="input-control"
                style={{ width: '60px', padding: '6px 10px' }}
                disabled={isStackActive}
              />
              <button className="btn-primary" onClick={handlePush} disabled={isStackActive} style={{ padding: '6px 12px', fontSize: '12px' }}>
                Push
              </button>
              <button className="btn-secondary" onClick={handlePop} disabled={isStackActive} style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--color-danger)' }}>
                Pop
              </button>
              <button className="btn-secondary" onClick={handleStackPeek} style={{ padding: '6px 12px', fontSize: '12px' }}>
                Peek
              </button>
              <button className="btn-secondary" onClick={handleClearStack} style={{ padding: '6px 6px', fontSize: '12px' }}>
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Stack log */}
          <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#0b0c14', border: '1px solid var(--border-color)', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <span style={{ color: 'var(--color-warning)' }}>Stack Log:</span> {stackLogs}
          </div>

          {/* Stack Container representation */}
          <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' }}>
            {/* The Beaker */}
            <div
              style={{
                width: '120px',
                height: '280px',
                border: '4px solid var(--border-color)',
                borderTop: 'none',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px',
                gap: '8px',
                background: 'rgba(255,255,255,0.01)',
                position: 'relative'
              }}
            >
              {/* Labels */}
              <div style={{ position: 'absolute', left: '-75px', top: '10px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                Stack Entry <br /> (Open top)
              </div>
              <ArrowDown size={14} style={{ position: 'absolute', left: '-30px', top: '25px', color: 'var(--text-muted)' }} />

              {stack.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', marginBottom: '80px', textAlign: 'center' }}>
                  Stack is empty
                </div>
              ) : (
                stack.map((item, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={idx}
                      className="node-enter"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '8px',
                        border: `2px solid ${isTop ? 'var(--color-success)' : 'var(--border-color)'}`,
                        background: isTop ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                        boxShadow: isTop ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                        position: 'relative',
                        transition: 'border-color 0.25s, background-color 0.25s'
                      }}
                    >
                      {item}
                      {isTop && (
                        <span style={{ position: 'absolute', right: '-65px', fontSize: '10px', color: 'var(--color-success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ArrowLeft size={10} /> TOP
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Queue section */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '550px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} className="text-gradient" /> Queue (FIFO)
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Val"
                value={queueInput}
                onChange={(e) => setQueueInput(e.target.value)}
                className="input-control"
                style={{ width: '60px', padding: '6px 10px' }}
                disabled={isQueueActive}
              />
              <button className="btn-primary" onClick={handleEnqueue} disabled={isQueueActive} style={{ padding: '6px 12px', fontSize: '12px' }}>
                Enqueue
              </button>
              <button className="btn-secondary" onClick={handleDequeue} disabled={isQueueActive} style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--color-danger)' }}>
                Dequeue
              </button>
              <button className="btn-secondary" onClick={handleQueuePeek} style={{ padding: '6px 12px', fontSize: '12px' }}>
                Peek
              </button>
              <button className="btn-secondary" onClick={handleClearQueue} style={{ padding: '6px 6px', fontSize: '12px' }}>
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Queue log */}
          <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#0b0c14', border: '1px solid var(--border-color)', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <span style={{ color: 'var(--color-warning)' }}>Queue Log:</span> {queueLogs}
          </div>

          {/* Queue container pipe representation */}
          <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* The Pipe */}
            <div
              style={{
                width: '320px',
                height: '70px',
                borderTop: '4px solid var(--border-color)',
                borderBottom: '4px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0 10px',
                gap: '12px',
                background: 'rgba(255,255,255,0.01)',
                position: 'relative'
              }}
            >
              {/* Exit Indicator */}
              <div style={{ position: 'absolute', left: '-50px', top: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ArrowLeft size={16} className="text-gradient" />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EXIT</span>
              </div>

              {/* Enter Indicator */}
              <div style={{ position: 'absolute', right: '-60px', top: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ArrowLeft size={16} className="text-gradient" />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ENTER</span>
              </div>

              {queue.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                  Queue is empty
                </div>
              ) : (
                queue.map((item, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queue.length - 1;

                  let border = 'var(--border-color)';
                  let bg = 'var(--bg-card)';
                  let shadow = 'none';

                  if (isFront) {
                    border = 'var(--color-success)';
                    bg = 'rgba(16, 185, 129, 0.15)';
                    shadow = '0 0 10px rgba(16, 185, 129, 0.2)';
                  } else if (isRear) {
                    border = 'var(--color-info)';
                    bg = 'rgba(59, 130, 246, 0.15)';
                    shadow = '0 0 10px rgba(59, 130, 246, 0.2)';
                  }

                  return (
                    <div
                      key={idx}
                      className="node-enter"
                      style={{
                        width: '55px',
                        height: '42px',
                        borderRadius: '8px',
                        border: `2px solid ${border}`,
                        background: bg,
                        boxShadow: shadow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                        position: 'relative',
                        transition: 'border-color 0.25s, background-color 0.25s'
                      }}
                    >
                      {item}
                      
                      {isFront && (
                        <span style={{ position: 'absolute', bottom: '-26px', fontSize: '9px', color: 'var(--color-success)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          FRONT (1st)
                        </span>
                      )}

                      {isRear && (
                        <span style={{ position: 'absolute', bottom: '-26px', fontSize: '9px', color: 'var(--color-info)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          REAR (Last)
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info explanations cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Stack & Queue Complexities</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)' }}>Operation</th>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Stack</th>
                <th style={{ padding: '8px 0', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Queue</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Insertion (Push/Enqueue)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Deletion (Pop/Dequeue)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Access / Search</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>O(N)</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Peek Front/Top</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Understanding LIFO & FIFO</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            <b>Stack</b> utilizes **LIFO** (Last In, First Out). The last element pushed is the first to be popped. Imagine a stack of plates—you always take the top plate first.
            <br /><br />
            <b>Queue</b> utilizes **FIFO** (First In, First Out). The first element added is the first to be removed. Think of a checkout line—the customer at the front gets served first, and new customers join at the rear.
          </p>
        </div>
      </div>
    </div>
  );
}
