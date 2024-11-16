import { useState, useEffect } from 'react';

export const useRequestGetTodos = (refreshTodosFlag, sortTodos, setIsAdded) => {
	const [todos, setTodos]= useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3005/todos')
		.then((loadedData) => loadedData.json())
		.then((loadedTodos) => {
			sortTodos ? setTodos(loadedTodos.sort((a, b) => a.userId > b.userId ? 1 : -1))
				      : setTodos(loadedTodos);
		})
		.finally(() => {
			setIsLoading(false)
		})
		}, [refreshTodosFlag, sortTodos, setIsAdded])

		return {isLoading,
			todos
		}

}
