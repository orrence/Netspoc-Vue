import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Services from '@/components/Services'
import OwnNetworks from '@/components/OwnNetworks'
import Diff from '@/components/Diff'
import Entitlements from '@/components/Entitlements'
import Login from '@/components/Login'
import PageNotFound from '@/components/PageNotFound'

// import TableTest from '@/components/testkram/MasterTable'
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
		path: '/storetest',
		component: StoreTest,
		meta: {
			title: 'StoreTest'
		}
	},
	{
		path: '/services/:search',
		component: Services,
		meta: {
			title: 'Services'
		}
	},
	{
		path: '/networks',
		component: OwnNetworks,
		meta: {
			title: 'Own Networks'
		}		
	},
	{
		path: '/diff',
		component: Diff,
		meta: {
			title: 'Diff'
		}
	},
	{
		path: '/entitlements',
		component: Entitlements,
		meta: {
			title: 'Entitlements'
		}
	},
	{
		path: '/login',
		component: Login,
		meta: {
			title: 'Login'
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