import { useState } from 'react';


export const useRequestDeletingTodos = (refreshTodos, setIsAdded, setInputValue) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const requestDeletingTodos = (id) =>{

		setIsDeleting(true);


		fetch('http://localhost:3005/todos/'+id+'', {
			method: 'DELETE'
		})
		.then((responsData)=>responsData.json())
		.then((response) => {
				console.log("Задача удалена Ответ сервера:", response);
				setIsAdded(true);
				setInputValue('');
				refreshTodos();
		})
		.finally(() => setIsDeleting(false))
	};

	return {
		isDeleting,
		requestDeletingTodos,
	};
}
