import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "./TaskList"; // Replace with your path

describe("TaskList component", () => {
  it("should render without errors", () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        {
          id: 1723354928554,
          description: "Task 1",
          completed: false,
          createdAt: 1723354928554,
        },
      ])
    );
    render(<TaskList />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  it("should add a new task", async () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByText("Add");

    userEvent.type(taskInput, "New Task");
    userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });

  it("should mark a task as completed", async () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByText("Add");

    userEvent.type(taskInput, "Complete Task");
    userEvent.click(addButton);

    const checkbox = screen.getByRole("checkbox");

    userEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should delete a task", async () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByText("Add");

    userEvent.type(taskInput, "Task to Delete");
    userEvent.click(addButton);

    const deleteButton = screen.getByText("Delete");

    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument();
    });
  });
});
