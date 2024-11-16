import { useState} from 'react';
import { useRequestGetTodos, useRequestAddTodos, useRequestUpdatingTodos, useRequestDeletingTodos, useRequestGetOneTodo } from './hooks';
import styles from  './App.module.css';
import { Routes, Route, NavLink,  Navigate, useParams} from 'react-router-dom';
export const App = () => {

	const [isCreating, setIsCreating] = useState(true);
	const [isUpdating, setIsUpdating] = useState(true);
	const [newUserId, setNewUserId] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const [clickChangeFlag, setClickChangeFlag] = useState(false);
	const [newId, setNewId] = useState('');
	const [sortTodos, setSortTodos] = useState(false);

	const [isAdded, setIsAdded] = useState(false);


	const onUserIdChange = ({ target }) => {
		setNewUserId(target.value);
		checkedIsCreating(target.value, newTitle, clickChangeFlag);
	}
	const onTitleChange = ({ target }) => {
		console.log( target.value )
		setNewTitle(target.value);
		if(clickChangeFlag){
			checkedIsCreating(target.value, oneTodo.userId, clickChangeFlag);
		} else 	checkedIsCreating(target.value,newUserId,clickChangeFlag);
	}
	const checkedIsCreating = (a,b, clickChangeFlag) => {
		if (a.length > 3 && b.length > 3){
			if(clickChangeFlag) setIsUpdating(false);
			else setIsCreating(false);
		}
	}

	const  clickChange =(id, userId) => {
		setClickChangeFlag(true);
		setNewId(id);
		setNewUserId(userId);
	}
	const [refreshTodosFlag, setRefreshTodosFlaf] = useState(false);

	const refreshTodos = () => setRefreshTodosFlaf(!refreshTodosFlag);
	const [inputValue, setInputValue] = useState('');
	const { isLoading, todos } = useRequestGetTodos(refreshTodosFlag, sortTodos, setIsAdded);
	const {	requestAddTodos, handleChecked } = useRequestAddTodos(refreshTodos, setIsCreating, setNewUserId, setNewTitle, setIsAdded);
	const { requestUpdatingTodos, handleClick } = useRequestUpdatingTodos(refreshTodos, setIsUpdating);
	const { isDeleting,	requestDeletingTodos } = useRequestDeletingTodos(refreshTodos, setIsAdded, setInputValue);

	const { oneTodo } = useRequestGetOneTodo(inputValue);

	const requestGETTodo = (val) =>{
		setInputValue(val);
	}

	const onSortTodos = () => {
		setSortTodos(!sortTodos);
	}

	const TodoPage = () => {
		 const { id } = useParams();
		 requestGETTodo(id);
		// if(!oneTodo) {
		// 	return null;
		// }
		return(<div>
				<h1>Страница задачи</h1>

				 <div  className={oneTodo.completed === 'true' ? styles.todo + ' '+ styles.completed
															   : styles.todo + ' '+ styles.new}>
					<span id={oneTodo.userId} >{oneTodo.userId}</span>
					<p>{oneTodo.title} </p>
					<button onClick={() => clickChange(oneTodo.id, oneTodo.userId)}>Редактировать</button>
					<button onClick={() => requestDeletingTodos(oneTodo.id)} disabled={isDeleting}><NavLink to='/addtodo' onClick={()=>setIsAdded(true)}>Удалить</NavLink></button>

					</div>
			</div>)
	}


	const MainPage = () => {

		return (<div>

				<button className={styles.sort} onClick={onSortTodos}>Сортировать</button>

				{isLoading
				? <div className={styles.loader}></div>
				: todos.map(({userId, id, title, completed}) => {
					return (
						<div key={id} className={completed === 'true' ? styles.todo + ' '+ styles.completed
																	: styles.todo + ' '+ styles.new}>
								<span id={userId} >{userId}</span>
								<NavLink to={`todo/${id}`} >{title}</NavLink>
						</div>)})
				}
		</div>
	);}

	const TodoList = () =>  (
				<div>
						<h1>Страница задач</h1>

				</div>)

	const TodosLoadError  = () => <div>Произошла ошибка загрузки</div>
	const TodoNotExists  = () => <div>Задача не найдена</div>
	const NotFound = () => <div>Такая страница не существует</div>;
	return (
		<div className={styles.app}>
			<h1>Todos list</h1>
			<div>
				<ul>
					<li><NavLink to='/' onClick={()=>setIsAdded(false)}>Главная</NavLink></li>
					<li><NavLink to='/addtodo' onClick={()=>setIsAdded(true)}>Страница задач</NavLink></li>
				</ul>
			</div>
			<Routes>
				<Route path='/' element={ <MainPage /> } />
				<Route path='/todo/:id' element={ <TodoPage /> }/>
				<Route path='/addtodo' element={ <TodoList /> } />
				<Route path='/todos-load-error' element={ <TodosLoadError /> }/>
				<Route path='/todo-not-exists' element={ <TodoNotExists /> }/>
				<Route path='/404' element={ <NotFound /> }/>
				<Route path='*' element={ <Navigate to='/404' /> }/>
			</Routes>


			{clickChangeFlag
			? <div className={styles.contentForm}>
				<form onSubmit={()=>requestUpdatingTodos(oneTodo.id, oneTodo.userId, newTitle)} className={styles.changeForm}>
					<input
					value={oneTodo.userId} readOnly/>
					<input
					placeholder="Введите описание задачи"
					onChange={onTitleChange}
					value={newTitle} />
				<button disabled={isUpdating} onClick={handleClick} >Сохранить</button>
				</form>
			 </div>
			: undefined}
			{isAdded
			? <div>
				<form onSubmit={()=>requestAddTodos(newUserId, newTitle)} className={styles.changeForm}>
							<input
							type="text"
							placeholder="Введите логин"
							onChange={onUserIdChange}
							value={newUserId} />
							<input
							type="text"
							placeholder="Введите описание задачи"
							onChange={onTitleChange}
							value={newTitle} />
							<button  disabled={isCreating} onClick={handleChecked}>Добавить</button>
						</form>
			</div>
			: undefined}


		</div>
	)
}




