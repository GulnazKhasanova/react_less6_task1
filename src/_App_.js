import { useState } from 'react';
import { useRequestGetTodos, useRequestAddTodos, useRequestUpdatingTodos, useRequestDeletingTodos, useRequestGetOneTodo } from './hooks';
import styles from './App.module.css';
import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom';

export const App = () => {

	const [isCreating, setIsCreating] = useState(true);
	const [isUpdating, setIsUpdating] = useState(true);
	const [newUserId, setNewUserId] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const [clickChangeFlag, setClickChangeFlag] = useState(false);
	const [newId, setNewId] = useState('');
	const [sortTodos, setSortTodos] = useState(false);
	const [oneTodo, setOneTodo] = useState([]);


	const onUserIdChange = ({ target }) => {
		setNewUserId(target.value);
		checkedIsCreating(target.value, newTitle, clickChangeFlag);
	};
	const onTitleChange = ({ target }) => {
		console.log(target.value);
		setNewTitle(target.value);
		checkedIsCreating(target.value, newUserId, clickChangeFlag);
	};
	const checkedIsCreating = (a, b, clickChangeFlag) => {
		if (a.length > 3 && b.length > 3) {
			if (clickChangeFlag) setIsUpdating(false);
			else setIsCreating(false);
		}
	};

	const clickChange = ({ id }) => {
		setClickChangeFlag(true);
		setNewId(id);
	};
	const [refreshTodosFlag, setRefreshTodosFlaf] = useState(false);

	const refreshTodos = () => setRefreshTodosFlaf(!refreshTodosFlag);

	const { isLoading, todos } = useRequestGetTodos(refreshTodosFlag, sortTodos);
	const { requestAddTodos } = useRequestAddTodos(refreshTodos, setIsCreating, setNewUserId, setNewTitle);
	const { requestUpdatingTodos } = useRequestUpdatingTodos(refreshTodos, setIsUpdating);
	const { isDeleting, requestDeletingTodos } = useRequestDeletingTodos(refreshTodos);
	const { requestGETTodo } = useRequestGetOneTodo(setOneTodo);

	const ExtendedLink = ({ to, children }) => (
		<NavLink to={to}>
			{({ isActive }) => isActive
				? (<>
					<span>{children}</span>
					<span>*</span>
				</>)
				: (children)}
		</NavLink>);
	const onSortTodos = () => {
		setSortTodos(!sortTodos);
	};
	const MainPage = () => (
		<div>

			<button className={styles.sort} onClick={onSortTodos}>Сортировать</button>

			{isLoading
				? <div className={styles.loader}></div>
				: todos.map(({ userId, id, title, completed }) => {
					return (
						<div key={id} className={completed === 'true' ? styles.todo + ' ' + styles.completed
							: styles.todo + ' ' + styles.new}>
							<span id={userId}>{userId}</span>
							<NavLink to={`todo/${id}`} onClick={() => requestGETTodo(id)}>{title}</NavLink>

							{/* <button  onClick={() => clickChange({id})} >Редактировать</button>
                            <button  onClick={()=>requestDeletingTodos({id})} disabled={isDeleting} >Удалить</button> */}

						</div>);
				})}
			<Outlet />
		</div>
	);

	const TodoPage = () => (

		<div>
			<h1>Страница задачи</h1>
			{console.log(oneTodo)}
			<div className={oneTodo.completed === 'true' ? styles.todo + ' ' + styles.completed // key={oneTodo.id}
				: styles.todo + ' ' + styles.new}>
				<span id={oneTodo.userId}>{oneTodo.userId}</span>
				<p>{oneTodo.title} </p>
				<button onClick={() => clickChange(oneTodo.id)}>Редактировать</button>
				<button onClick={() => requestDeletingTodos(oneTodo.id)} disabled={isDeleting}><NavLink to='/addtodo'>Удалить</NavLink></button>

			</div>
		</div>
	);
	const TodoList = () => (<div>
		<h1>Страница задач</h1>
		<form onSubmit={() => requestAddTodos(newUserId, newTitle)} className={styles.changeForm}>
			<input placeholder="Введите логин" onChange={onUserIdChange} value={newUserId}></input>
			<input placeholder="Введите описание задачи" onChange={onTitleChange} value={newTitle}></input>

			<button disabled={isCreating}>Добавить</button>
		</form>
	</div>);
	const TodosLoadError = () => <div>Произошла ошибка загрузки</div>;
	const TodoNotExists = () => <div>Задача не найдена</div>;
	const NotFound = () => <div>Такая страница не существует</div>;
	return (
		<div className={styles.app}>
			<h1>Todos list</h1>
			<div>
				<ul>
					<li><ExtendedLink to='/'>Главная</ExtendedLink></li>
					<li><ExtendedLink to='/addtodo'>Страница задач</ExtendedLink></li>
				</ul>
			</div>
			<Routes>
				<Route path='/' element={<MainPage />}>

					<Route path='/todo/:id' element={<TodoPage />} />
				</Route>
				<Route path='/addtodo' element={<TodoList />} />
				<Route path='/todos-load-error' element={<TodosLoadError />} />
				<Route path='/todo-not-exists' element={<TodoNotExists />} />
				<Route path='/404' element={<NotFound />} />
				<Route path='*' element={<Navigate to='/404' />} />
			</Routes>


			{clickChangeFlag
				? <div className={styles.contentForm}>
					<form onSubmit={() => requestUpdatingTodos(newId, newUserId, newTitle)} className={styles.changeForm}>
						<input
							placeholder="Введите логин"
							onChange={onUserIdChange}
							value={newUserId}></input>
						<input
							placeholder="Введите описание задачи"
							onChange={onTitleChange}
							value={newTitle}></input>
						<button disabled={isUpdating}>Сохранить</button>
					</form>
				</div>
				: undefined}


		</div>
	);
};
