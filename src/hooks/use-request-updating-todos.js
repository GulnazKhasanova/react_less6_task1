import { useNavigate } from 'react-router-dom';

export const useRequestUpdatingTodos = (refreshTodos, setIsUpdating) => {

	const navigate = useNavigate();
	const handleClick = () => navigate('/');
	const requestUpdatingTodos = (newId, UserId, newTitle) =>{
		setIsUpdating(true);

		fetch('http://localhost:3005/todos/'+newId+'', {
			method: 'PUT',
			headers: { 'Content-Type':'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId:UserId,
				title: newTitle,
				completed: false
			})
		})
		.then((responsData)=>responsData.json())
		.then((response) => {
				console.log("Задача обновлена Ответ сервера:", response);
				refreshTodos();
		})
		.finally(() => {setIsUpdating(false);
			})
	};

	return {
		requestUpdatingTodos,
		handleClick
	};
}
