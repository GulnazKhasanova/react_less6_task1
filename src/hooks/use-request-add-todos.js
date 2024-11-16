import { useNavigate } from 'react-router-dom';

export const useRequestAddTodos = (refreshTodos, setIsCreating, setNewUserId, setNewTitle,setIsAdded) => {
	const navigate = useNavigate();
	const handleChecked = () => {
		navigate('/')};

	const requestAddTodos = (newUserId, newTitle) =>{
		setIsAdded(true);
		setIsCreating(true);
		fetch('http://localhost:3005/todos', {
			method: 'POST',
			headers: { 'Content-Type':'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId:newUserId,
				title: newTitle,
				completed: 'false'
			})
		})
		.then((responsData)=>responsData.json())
		.then((response) => {
				console.log("Задача добавлена Ответ сервера:", response);
				setIsAdded(false);
				refreshTodos();
		})
		.finally(() => {
			setNewUserId('');
			setNewTitle('');
		})

	};

	return {
		requestAddTodos,
		handleChecked
	};
}
