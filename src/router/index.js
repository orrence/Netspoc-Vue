import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Services from '@/views/Services'
import Networks from '@/views/Networks'
import Diff from '@/views/Diff'
import Login from '@/views/Login'
import PageNotFound from '@/views/PageNotFound'

Vue.use(VueRouter)

const routes = [
	{
		path: '/index.html',
		redirect: '/login'
	},
	{
		path: '/',
		redirect: '/services',
	},
	{
		path: '/login',
		component: Login,
		meta: {
			title: 'Anmeldung'
			}		
	},
	{
		path: '*',
		component: PageNotFound,
		meta: {
			title: 'Page Not Found'
		}
	},
			{
				path: '/services',
				component: Services,
				props: true,
				name: 'services',
				meta: {
					title: 'Dienste',
					requiresAuth: true,
				}
			},
			{
				path: '/networks',
				component: Networks,
				meta: {
					title: 'Netze',
					requiresAuth: true,
				}		
			},
			{
				path: '/diff',
				component: Diff,
				meta: {
					title: 'Unterschiede',
					requiresAuth: true,
				}
			},
		
	
	
	
	
];

const router = new VueRouter ({
	routes,
	mode: 'history'
	// base: '/login'
});

router.beforeEach ((to, from, next) => {
	if(to.matched.some(record => record.meta.requiresAuth)) {
		// todo check if is already loggedin
	
		if (store.getters['auth/getLoggedIn'] == 'false' || store.getters['auth/getLoggedIn'] == null ) {
			router.push('/login');
		} 
			return next();
		
		/*store.dispatch('auth/requestLoggedIn')
		.then(() => {
			if (!store.getters['auth/getLoggedIn']) {
				router.push('/login');
			} else {
				next();
			}
		});*/
	} else  {
		next();
	}
	
});

router.afterEach ((to) => {
	document.title = "PolicyWeb - " + to.meta.title;
});

export default router;