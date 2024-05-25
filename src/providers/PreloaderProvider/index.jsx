import { useEffect } from 'react';

const PreloaderProvider = () => {
	useEffect(() => {
		document.querySelector('.preloader')?.remove();
	}, []);

	return null;
};
export default PreloaderProvider;
