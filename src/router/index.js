import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Services from '@/views/Services'
import Networks from '@/views/Networks'
import Diff from '@/views/Diff'
import Entitlements from '@/views/Entitlements'
import Login from '@/views/Login'
import PageNotFound from '@/views/PageNotFound'

import TableTest from '@/components/testkram/Tablator'
import expansion from '@/components/testkram/expansionTest'
import LayPlay from '@/components/testkram/LayoutPlayground'
import StoreTest from '@/components/testkram/StoreTest'

Vue.use(VueRouter)

const routes = [
	{
		path: '/test',
		component: expansion,
		meta: {
			title: 'expansion'
		}
	},
	{
		path: '/layplay',
		component: LayPlay,
		meta: {
			title: 'LayPlay'
		}
	},
	{
		path: '/tabletest',
		component: TableTest,
		meta: {
			title: 'Tablator test'
		}
	},
	{
		path: '/storetest',
		component: StoreTest,
		meta: {
			title: 'StoreTest'
		}
	},
	{
		path: '/services/:search',
		component: Services,
		props: true,
		name: 'services',
		meta: {
			title: 'Dienste'
		}
	},
	{
		path: '/networks',
		component: Networks,
		meta: {
			title: 'Netze'
		}		
	},
	{
		path: '/diff',
		component: Diff,
		meta: {
			title: 'Unterschiede'
		}
	},
	{
		path: '/entitlements',
		component: Entitlements,
		meta: {
			title: 'Berechtigungen'
		}
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
	}
];

const router = new VueRouter ({
	routes,
	mode: 'history'
	// base: '/login'
});

router.beforeEach ((to, from, next) => {
	if (!store.state.loggedIn && to.path != '/login') {
		// when reloading in browser without this,
		// the login component and the apptoolbar get 
		// rendered at the same time (for unkown reason)
		store.dispatch('setLoggedIn')
			.then(() => {
				if (!store.state.loggedIn) {
					router.push('/login');
				} else {
					next();
				}
			});
	} else {
		next();
	}
});

router.afterEach ((to) => {
	document.title = "PolicyWeb - " + to.meta.title;
});

export default router;