import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SortingVisualizer from './SortingVisualizer';
import PathfindingVisualizer from './PathfindingVisualizer';
import LinkedListVisualizer from './LinkedListVisualizer';
import StackQueueVisualizer from './StackQueueVisualizer';
import TreeVisualizer from './TreeVisualizer';

describe('DSA Visualizers Integration Suite', () => {
  
  describe('SortingVisualizer', () => {
    it('renders and allows selecting different sorting algorithms', () => {
      render(<SortingVisualizer />);
      
      const bubbleBtn = screen.getByRole('button', { name: /Bubble Sort/i });
      expect(bubbleBtn).toBeInTheDocument();
      
      const selectionBtn = screen.getByRole('button', { name: /Selection Sort/i });
      expect(selectionBtn).toBeInTheDocument();
      
      fireEvent.click(selectionBtn);
    });

    it('renders speed and size control sliders', () => {
      render(<SortingVisualizer />);
      const sizeLabel = screen.getByText(/Array Size:/i);
      expect(sizeLabel).toBeInTheDocument();
    });
  });

  describe('PathfindingVisualizer', () => {
    it('renders the grid and legend options', () => {
      render(<PathfindingVisualizer />);
      
      const dijkstraBtn = screen.getByRole('button', { name: /Dijkstra's Algorithm/i });
      expect(dijkstraBtn).toBeInTheDocument();
      
      expect(screen.getByText(/Start \(Drag me!\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Target \(Drag me!\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Wall \(Click & Drag\)/i)).toBeInTheDocument();
    });
  });

  describe('LinkedListVisualizer', () => {
    it('renders starting default nodes and handles Head Insertion', async () => {
      render(<LinkedListVisualizer />);
      
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('89')).toBeInTheDocument();
      
      const valInput = screen.getByPlaceholderText('Value');
      fireEvent.change(valInput, { target: { value: '99' } });
      
      const insertHeadBtn = screen.getByRole('button', { name: /Insert Head/i });
      fireEvent.click(insertHeadBtn);
      
      const newNode = await screen.findByText('99', {}, { timeout: 1500 });
      expect(newNode).toBeInTheDocument();
    });

    it('handles Searching values correctly', async () => {
      render(<LinkedListVisualizer />);
      
      const valInput = screen.getByPlaceholderText('Value');
      fireEvent.change(valInput, { target: { value: '45' } });
      
      const searchBtn = screen.getByRole('button', { name: /Search/i });
      fireEvent.click(searchBtn);
      
      const matchText = await screen.findByText(/Match found!/i, {}, { timeout: 2000 });
      expect(matchText).toBeInTheDocument();
    });
  });

  describe('StackQueueVisualizer', () => {
    it('renders stack beaker (LIFO) and queue pipe (FIFO) options side by side', () => {
      render(<StackQueueVisualizer />);
      
      expect(screen.getByText(/Stack \(LIFO\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Queue \(FIFO\)/i)).toBeInTheDocument();
      
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
    });

    it('allows pushing to Stack and enqueueing to Queue', async () => {
      render(<StackQueueVisualizer />);
      
      const stackInputs = screen.getAllByPlaceholderText('Val');
      const stackInput = stackInputs[0];
      fireEvent.change(stackInput, { target: { value: '55' } });
      
      const pushBtn = screen.getByRole('button', { name: 'Push' });
      fireEvent.click(pushBtn);
      
      const stackElement = await screen.findByText('55', {}, { timeout: 1500 });
      expect(stackElement).toBeInTheDocument();
      
      const queueInput = stackInputs[1];
      fireEvent.change(queueInput, { target: { value: '66' } });
      
      const enqueueBtn = screen.getByRole('button', { name: 'Enqueue' });
      fireEvent.click(enqueueBtn);
      
      const queueElement = await screen.findByText('66', {}, { timeout: 1500 });
      expect(queueElement).toBeInTheDocument();
    });
  });

  describe('TreeVisualizer', () => {
    it('renders the initial binary search tree structure', () => {
      render(<TreeVisualizer />);
      
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('triggers tree traversal highlighting', async () => {
      render(<TreeVisualizer />);
      
      const inorderBtn = screen.getByRole('button', { name: /Inorder/i });
      fireEvent.click(inorderBtn);
      
      // Pass a high timeout to this assertion as tree traversals take up to 5s to finish animating
      const completedText = await screen.findByText(/INORDER traversal completed/i, {}, { timeout: 12000 });
      expect(completedText).toBeInTheDocument();
    }, 15000); // 15 seconds test timeout config
  });

});
