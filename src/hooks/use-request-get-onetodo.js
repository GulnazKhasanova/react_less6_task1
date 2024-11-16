import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

export const useRequestGetOneTodo = (id) => {

	const navigate = useNavigate();
	const [oneTodo, setOneTodo]= useState([]);


	useEffect(() => {
		// const rederect = () => navigate('/todo-not-exists')
	fetch('http://localhost:3005/todos/'+id+'')
		.then((responsData)=>responsData.json())
		.then((response) => {
				if(Object.keys(response).length === 0){
						navigate('/todo-not-exists')
						return;
					}
				setOneTodo(response);
		})
		.catch( (err) => console.log(err))
		}, [id, navigate])

		return { oneTodo
		}


}
