import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Outlet, useParams, useNavigate, Navigate } from 'react-router-dom';
import styles from './App.module.css';

export const App = () => {
	const database = {
		productList: [
			{ id: 1, name: 'Телевизор' },
			{ id: 2, name: 'Смартфон' },
			{ id: 3, name: 'Планшет'},
		],
		products : {
			1: { id: 1, price: 10000, amount: 15, name: 'Телевизор' },
			2: { id: 2, price: 18500, amount: 25, name: 'Смартфон' },
			3: { id: 3, price: 11000, amount: 34, name: 'Планшет'}
		}
	};
	const fetchProductList = () => database.productList;
	const fetchProduct = (id) => new Promise((resolve)=>{
		setTimeout(() => {
			resolve(database.products[id]);
		}, 2500	)
	})

	const MainPage = () => <div>Контент главной страницы</div>;
	const NotFound = () => <div>Такая страница не существует</div>;
	const Catalog = () => (
	<div>
		<h1>Контент каталога</h1>
		<ul>
		{fetchProductList().map(({ id, name }) => (
			<li key={id}> <NavLink to={`product/${id}`}>{name}</NavLink></li>
		))}
		</ul>
			<Outlet />
	</div>);
	const Contacts = () => <div>Контент контактов</div>;
	// const ProductNotFound = () => <div>Такого товара не существует</div>;
	const ProductLoadError = () => <div>Ошибка загрузки товара</div>
	const ProductNotExists  = () => <div>Такого товара не существует</div>;
	const [product, setProduct] = useState();
	const Product =() => {
		const params = useParams();
		const navigate = useNavigate();

		useEffect(()=>{
		let isLoadingTimeout = false;
		let isProductLoaded = false;
		setTimeout(()=> {
			isLoadingTimeout = true;
			if(!isProductLoaded) {
				navigate('/product-load-error',{ replace: true });					 //navigate(-10); -- переадресация на 10 шагов назад по стрелочке в браузере
			}
		}, 2000);

			fetchProduct(params.id).then((loadedProduct) => {
				isProductLoaded = true;

				if(!isLoadingTimeout){
					if(!loadedProduct){
						navigate('/product-not-exists', { replace: true });
						return;
					}
					setProduct(loadedProduct);
				}

			});
		}, [params.id, navigate]);


		if(!product){
			return null;
		}

		const { amount, price, name } = product;
			return (<div>
					<h1>Товар - {name}</h1>
					<div>Стоимость: {price}</div>
					<div>На складе: {amount}</div>
					</div>)
			}
	const ExtendedLink = ({ to, children }) => (
		<NavLink to={to}>
			{({ isActive }) =>
			isActive
			?( <>
				<span>{children}</span>
				<span>*</span>
				</>)
			:( children )
			}
		</NavLink>
	)
	return (
		<div className={styles.app}>
			<div>
				<h1>Меню</h1>
				<ul>
					<li><ExtendedLink to='/'>Главная</ExtendedLink></li>
					<li><ExtendedLink to='/catalog'>Каталог</ExtendedLink></li>
					<li><ExtendedLink to='/contacts'>Контакты</ExtendedLink></li>
				</ul>
			</div>
			<Routes>
				<Route path='/' element={ <MainPage /> }/>
				<Route path='/catalog' element={ <Catalog/> }>
					<Route path='product/:id' element={ <Product /> }/>
				</Route>
				<Route path='/contacts' element={ <Contacts /> }/>
				<Route path='/product-load-error' element={ <ProductLoadError /> }/>
				<Route path='/product-not-exists' element={ <ProductNotExists /> }/>
				<Route path='/404' element={ <NotFound /> }/>
				<Route path='*' element={ <Navigate to='/404' /> }/>

			</Routes>
		</div>
	)
}




