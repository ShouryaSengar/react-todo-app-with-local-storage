import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CustomForm from './CustomForm';

describe('CustomForm', () => {
  it('renders input field and add button', () => {
    render(<CustomForm addTask={vi.fn()} />);

    expect(screen.getByPlaceholderText(/enter task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls addTask and resets input on form submission', async () => {
    const user = userEvent.setup();
    const addTaskMock = vi.fn();
    render(<CustomForm addTask={addTaskMock} />);

    const input = screen.getByPlaceholderText(/enter task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Buy groceries');
    await user.click(button);

    expect(addTaskMock).toHaveBeenCalledTimes(1);
    expect(addTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Buy groceries',
        checked: false,
      })
    );
    expect(input).toHaveValue('');
  });
});
