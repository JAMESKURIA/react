import React, { FormEvent } from "react";
import "./App.css";

type Todo = {
    id: number;
    text: string;
    complete: boolean;
};

// Function to generate unique id
function* generateId(value?: number) {
    let id = value ?? 1;

    while (true) {
        yield id;
        id++;
    }
}

const idGenerator = generateId(4);

function App() {
    const [todos, setTodos] = React.useState<Todo[]>([]);

    // Function to add todo item
    function addTodo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const text = formData.get("todo")?.toString();
        const id = Number(idGenerator.next().value);

        if (!text) return;

        setTodos((prev) => [
            ...prev,
            {
                id,
                text,
                complete: false,
            },
        ]);

        e.currentTarget.reset();
    }

    // Function to remove todo item
    function removeTodo(id: number) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }

    // Function to set todo item as done
    function setDone(id: number) {
        setTodos((prev) =>
            prev.map((todo) => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        complete: !todo.complete,
                    };
                }

                return todo;
            })
        );
    }

    return (
        <>
            <form onSubmit={addTodo}>
                <input type="text" name="todo" />
                <input type="submit" value="Add todo" />
            </form>
            <ul
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "100%",
                }}
            >
                <List
                    items={todos}
                    renderItem={(item) => {
                        const textDecoration = item.complete
                            ? "line-through"
                            : "none";

                        return (
                            <li
                                key={item.id}
                                style={{ display: "flex", gap: "10px" }}
                            >
                                <span
                                    onClick={() => setDone(item.id)}
                                    style={{ textDecoration }}
                                >
                                    {item.text}
                                </span>
                                <button onClick={() => removeTodo(item.id)}>
                                    Remove
                                </button>
                            </li>
                        );
                    }}
                />
            </ul>
        </>
    );
}

function List<T>({
    items,
    renderItem,
    emptyState,
}: {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    emptyState?: React.ReactNode;
}) {
    if (!items || !items.length)
        return emptyState ?? <span>No items in list.</span>;

    return items.map((item: T, idx: number) => renderItem(item, idx)).reverse();
}

export default App;
