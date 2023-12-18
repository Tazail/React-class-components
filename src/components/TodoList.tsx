import React, { ChangeEvent } from "react";

//Тип для об'єктів, що приходять з апі
type TodoType = {
  id: string;
  userId?: number;
  title: string;
  completed: boolean;
};

type StateType = {
  newTodoText: string;
  todos: TodoType[];
  isLoading: boolean;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

class TodoList extends React.Component<Record<string, string>, StateType> {
  constructor(props: Record<string, string>) {
    super(props);
    this.state = {
      todos: [],
      // newTodoText - змінна, яка фіксує зміни в input
      newTodoText: "",
      isLoading: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddNewTodo = this.handleAddNewTodo.bind(this);
  }

  componentDidMount(): void {
    this.setState({ isLoading: true });
    fetch(`${BASE_URL}/todos?_limit=20`)
      .then((response) => response.json())
      .then((todosArray: TodoType[]) => this.setState({ todos: todosArray }))
      .finally(() => this.setState({ isLoading: false }));
    // api calls
    // document.addEventListener('resize', () => {})
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>): void {
    console.log("component was updated");
  }

  componentWillUnmount(): void {
    // document.removeEventListener('resize', () => {})
    console.log("component will unmount");
  }

  // функція для onChange в input
  // ChangeEvent<HTMLInputElement> - тип для input
  // setState - готова ф-ція для звернення для State. Викликає рендер.
  handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ newTodoText: event.target.value });
  }

  // функція для onClick в button
  // функція для додавання нового Todo в масив todos з input
  async handleAddNewTodo() {
    try {
      this.setState({ isLoading: true });
      const createTodoBody: Omit<TodoType, "id"> = {
        title: this.state.newTodoText,
        completed: false,
        userId: 1,
      };
      const response = await fetch(`${BASE_URL}/todos/`, {
        method: "POST",
        body: JSON.stringify(createTodoBody),
      });
      const { id } = await response.json();

      this.setState({
        todos: [...this.state.todos, { id, ...createTodoBody }],
        newTodoText: "",
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render(): React.ReactNode {
    const { todos, newTodoText, isLoading } = this.state;
    return (
      <div>
        <input
          type="text"
          value={newTodoText}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleAddNewTodo}>Add TODO</button>
        {isLoading && <h3>Loading...</h3>}
        {todos.map(({ id, title, completed }) => (
          <li key={id}>
            {title} - {completed ? <b>DJNE</b> : <i>TODO</i>}
          </li>
        ))}
      </div>
    );
  }
}

export default TodoList;
