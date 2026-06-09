import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart2, Info, Check, HelpCircle } from 'lucide-react';

const ALGO_DETAILS = {
  bubble: {
    name: 'Bubble Sort',
    timeBest: 'O(N)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    desc: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    pseudocode: `bubbleSort(array):
  n = length(array)
  for i = 0 to n - 1:
    for j = 0 to n - i - 2:
      if array[j] > array[j+1]:
        swap(array[j], array[j+1])`
  },
  selection: {
    name: 'Selection Sort',
    timeBest: 'O(N²)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'No',
    desc: 'Divides the input list into two parts: a sorted sublist built up from left to right, and a remaining unsorted sublist. It repeatedly finds the smallest element from the unsorted sublist and swaps it into place.',
    pseudocode: `selectionSort(array):
  n = length(array)
  for i = 0 to n - 1:
    minIdx = i
    for j = i + 1 to n - 1:
      if array[j] < array[minIdx]:
        minIdx = j
    if minIdx != i:
      swap(array[i], array[minIdx])`
  },
  insertion: {
    name: 'Insertion Sort',
    timeBest: 'O(N)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    desc: 'Builds a sorted array one item at a time by repeatedly taking the next element from the unsorted section and inserting it into its correct position within the already sorted section.',
    pseudocode: `insertionSort(array):
  n = length(array)
  for i = 1 to n - 1:
    key = array[i]
    j = i - 1
    while j >= 0 and array[j] > key:
      array[j+1] = array[j]
      j = j - 1
    array[j+1] = key`
  },
  merge: {
    name: 'Merge Sort',
    timeBest: 'O(N log N)',
    timeAvg: 'O(N log N)',
    timeWorst: 'O(N log N)',
    space: 'O(N)',
    stable: 'Yes',
    desc: 'A divide-and-conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves into a single sorted array.',
    pseudocode: `mergeSort(array, left, right):
  if left < right:
    mid = floor((left + right) / 2)
    mergeSort(array, left, mid)
    mergeSort(array, mid + 1, right)
    merge(array, left, mid, right)`
  },
  quick: {
    name: 'Quick Sort',
    timeBest: 'O(N log N)',
    timeAvg: 'O(N log N)',
    timeWorst: 'O(N²)',
    space: 'O(log N)',
    stable: 'No',
    desc: 'A divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot, placing smaller elements to its left and larger elements to its right.',
    pseudocode: `quickSort(array, left, right):
  if left < right:
    pIdx = partition(array, left, right)
    quickSort(array, left, pIdx - 1)
    quickSort(array, pIdx + 1, right)`
  }
};

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50); // delay in ms
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [isRunning, setIsRunning] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState(new Set());
  
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Generate random array
  const generateNewArray = () => {
    if (isRunning) return;
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 340) + 30);
    }
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted(new Set());
  };

  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  // Bubble sort animations recorder
  const getBubbleSortAnimations = (arr) => {
    const animations = [];
    const n = arr.length;
    const temp = [...arr];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        animations.push(['compare', j, j + 1]);
        if (temp[j] > temp[j + 1]) {
          animations.push(['swap', j, j + 1]);
          const t = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = t;
        }
      }
      animations.push(['sorted', n - i - 1]);
    }
    animations.push(['sorted', 0]);
    return animations;
  };

  // Selection sort animations recorder
  const getSelectionSortAnimations = (arr) => {
    const animations = [];
    const n = arr.length;
    const temp = [...arr];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        animations.push(['compare', minIdx, j]);
        if (temp[j] < temp[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        animations.push(['swap', i, minIdx]);
        const t = temp[i];
        temp[i] = temp[minIdx];
        temp[minIdx] = t;
      }
      animations.push(['sorted', i]);
    }
    animations.push(['sorted', n - 1]);
    return animations;
  };

  // Insertion sort animations recorder
  const getInsertionSortAnimations = (arr) => {
    const animations = [];
    const n = arr.length;
    const temp = [...arr];
    for (let i = 1; i < n; i++) {
      let key = temp[i];
      let j = i - 1;
      animations.push(['compare', j + 1, j]);
      while (j >= 0 && temp[j] > key) {
        animations.push(['compare', j, j + 1]);
        animations.push(['overwrite', j + 1, temp[j]]);
        temp[j + 1] = temp[j];
        j = j - 1;
      }
      animations.push(['overwrite', j + 1, key]);
      temp[j + 1] = key;
    }
    for (let i = 0; i < n; i++) {
      animations.push(['sorted', i]);
    }
    return animations;
  };

  // Quick sort animations recorder
  const getQuickSortAnimations = (arr) => {
    const animations = [];
    const temp = [...arr];

    const partition = (left, right) => {
      const pivot = temp[right];
      let i = left - 1;
      for (let j = left; j < right; j++) {
        animations.push(['compare', j, right]);
        if (temp[j] < pivot) {
          i++;
          animations.push(['swap', i, j]);
          const t = temp[i];
          temp[i] = temp[j];
          temp[j] = t;
        }
      }
      animations.push(['swap', i + 1, right]);
      const t = temp[i + 1];
      temp[i + 1] = temp[right];
      temp[right] = t;
      return i + 1;
    };

    const qSort = (left, right) => {
      if (left < right) {
        const pIdx = partition(left, right);
        animations.push(['sorted', pIdx]);
        qSort(left, pIdx - 1);
        qSort(pIdx + 1, right);
      } else if (left === right) {
        animations.push(['sorted', left]);
      }
    };

    qSort(0, temp.length - 1);
    for (let i = 0; i < temp.length; i++) {
      animations.push(['sorted', i]);
    }
    return animations;
  };

  // Merge sort animations recorder
  const getMergeSortAnimations = (arr) => {
    const animations = [];
    const temp = [...arr];

    const merge = (left, mid, right) => {
      const helper = [...temp];
      let i = left;
      let j = mid + 1;
      let k = left;

      while (i <= mid && j <= right) {
        animations.push(['compare', i, j]);
        if (helper[i] <= helper[j]) {
          animations.push(['overwrite', k, helper[i]]);
          temp[k] = helper[i];
          i++;
        } else {
          animations.push(['overwrite', k, helper[j]]);
          temp[k] = helper[j];
          j++;
        }
        k++;
      }

      while (i <= mid) {
        animations.push(['compare', i, i]);
        animations.push(['overwrite', k, helper[i]]);
        temp[k] = helper[i];
        i++;
        k++;
      }

      while (j <= right) {
        animations.push(['compare', j, j]);
        animations.push(['overwrite', k, helper[j]]);
        temp[k] = helper[j];
        j++;
        k++;
      }
    };

    const mSort = (left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mSort(left, mid);
        mSort(mid + 1, right);
        merge(left, mid, right);
      }
    };

    mSort(0, temp.length - 1);
    for (let i = 0; i < temp.length; i++) {
      animations.push(['sorted', i]);
    }
    return animations;
  };

  // Animate playback
  const handleSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    isRunningRef.current = true;
    setSorted(new Set());

    let animations = [];
    if (selectedAlgo === 'bubble') animations = getBubbleSortAnimations(array);
    else if (selectedAlgo === 'selection') animations = getSelectionSortAnimations(array);
    else if (selectedAlgo === 'insertion') animations = getInsertionSortAnimations(array);
    else if (selectedAlgo === 'quick') animations = getQuickSortAnimations(array);
    else if (selectedAlgo === 'merge') animations = getMergeSortAnimations(array);

    const sleepTime = Math.max(1, 201 - speed * 2); // mapping speed slider 1-100 to delay

    for (let step = 0; step < animations.length; step++) {
      if (!isRunningRef.current) break; // support cancel / reset intermediate

      const [type, idx1, idx2] = animations[step];
      
      if (type === 'compare') {
        setComparing([idx1, idx2]);
        setSwapping([]);
        await new Promise((r) => setTimeout(r, sleepTime));
      } else if (type === 'swap') {
        setSwapping([idx1, idx2]);
        setComparing([]);
        setArray((prev) => {
          const next = [...prev];
          const t = next[idx1];
          next[idx1] = next[idx2];
          next[idx2] = t;
          return next;
        });
        await new Promise((r) => setTimeout(r, sleepTime));
      } else if (type === 'overwrite') {
        setSwapping([idx1]);
        setComparing([]);
        setArray((prev) => {
          const next = [...prev];
          next[idx1] = idx2; // here idx2 represents the new height/value
          return next;
        });
        await new Promise((r) => setTimeout(r, sleepTime));
      } else if (type === 'sorted') {
        setSorted((prev) => {
          const next = new Set(prev);
          next.add(idx1);
          return next;
        });
      }
    }

    setComparing([]);
    setSwapping([]);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  // Reset during run
  const handleReset = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setTimeout(() => {
      generateNewArray();
    }, 50);
  };


  const details = ALGO_DETAILS[selectedAlgo];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
      {/* Top Header & Settings Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.keys(ALGO_DETAILS).map((key) => (
            <button
              key={key}
              className="btn-secondary"
              onClick={() => !isRunning && setSelectedAlgo(key)}
              style={{
                borderColor: selectedAlgo === key ? 'var(--accent-primary)' : 'var(--border-color)',
                background: selectedAlgo === key ? 'rgba(139, 92, 246, 0.15)' : '',
                opacity: isRunning && selectedAlgo !== key ? 0.4 : 1
              }}
              disabled={isRunning}
            >
              {ALGO_DETAILS[key].name}
            </button>
          ))}
        </div>

        {/* Speed and Size Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '140px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Array Size: <span style={{ color: 'var(--text-primary)' }}>{arraySize}</span>
            </label>
            <input
              type="range"
              min="10"
              max="80"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="range-slider"
              disabled={isRunning}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '140px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Speed
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={handleSort} disabled={isRunning}>
              <Play size={16} /> Visualize
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '400px', justifyContent: 'flex-end', position: 'relative' }}>
        {/* Colors Legend */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-primary)' }}></span> Default
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-warning)' }}></span> Comparing
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-danger)' }}></span> Swapping
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-success)' }}></span> Sorted
          </div>
        </div>

        {/* The Array Bars Container */}
        <div style={{ display: 'flex', width: '100%', height: '350px', alignItems: 'flex-end', justifyContent: 'center', gap: arraySize > 50 ? '2px' : '4px' }}>
          {array.map((val, idx) => {
            let color = 'var(--accent-primary)';
            if (comparing.includes(idx)) color = 'var(--color-warning)';
            else if (swapping.includes(idx)) color = 'var(--color-danger)';
            else if (sorted.has(idx)) color = 'var(--color-success)';

            return (
              <div
                key={idx}
                className="sorting-bar"
                style={{
                  height: `${(val / 380) * 100}%`,
                  width: '100%',
                  maxWidth: '30px',
                  backgroundColor: color,
                  boxShadow: comparing.includes(idx) || swapping.includes(idx)
                    ? `0 0 10px ${color}`
                    : 'none'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Info & Description Footer section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Statistics & details */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart2 size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Algorithm Metrics</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Best Time Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{details.timeBest}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Average Time Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>{details.timeAvg}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Worst Time Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>{details.timeWorst}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Space Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{details.space}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Stable Sort</td>
                <td style={{ padding: '8px 0', textAlign: 'right', color: details.stable === 'Yes' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {details.stable}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Narrative Description */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Info size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>How it Works</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
            {details.desc}
          </p>
        </div>

        {/* Pseudocode Display */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HelpCircle size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Pseudocode</h3>
          </div>
          <pre style={{ fontSize: '11px', margin: 0, overflowX: 'auto', maxHeight: '180px', lineHeight: '1.4' }}>
            {details.pseudocode}
          </pre>
        </div>
      </div>
    </div>
  );
}
