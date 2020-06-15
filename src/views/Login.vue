<template>
<v-container>
	<h1>Netspoc-Web</h1>
	
	<v-card
	:loading="false"
	class="mx-auto"
	> 
		<v-card-title primary-title>
			<h4>Login</h4>
		</v-card-title>

		<v-system-bar 
		v-if="!valid"
		color="error"
		id="bar_login_failed"
		>
			Kombination aus Benutzername / E-Mail und Passwort inkorrekt
		</v-system-bar>
	
		<v-system-bar 
		v-else-if="!login || !password"
		color="warning"
		id="bar_login_empty"
		>
			Anmeldedaten eingeben
		</v-system-bar>

		<v-form 
		class="mx-2" 
		@submit="submit"
		onSubmit="return false"
		>
			<v-text-field
				id="txt_login"
				v-model="login"
				:rules="[v => !!v || 'Darf nicht leer sein']"
				required
				label="Benutzername / E-Mail"
				prepend-icon="person"
			></v-text-field>
	
			<v-text-field
				id="txt_password"
				v-model="password"
				:append-icon="show ? 'visibility' : 'visibility_off'"
				:type="show ? 'text' : 'password'"
				@click:append="show = !show"
				required
				label="Passwort"
				prepend-icon="lock"
			></v-text-field>
			
			<v-card-actions>
				<v-flex class="text-xs-right">
					<v-btn
					id="btn_login"
					type="submit"
					primary large block
					>Login</v-btn>	
				</v-flex>
			</v-card-actions>
		</v-form>
	</v-card>

	<br/>

	<v-card>
		<v-card-title primary-title>
			Hier koennte ihr Wiki stehen
		</v-card-title>
	</v-card>
</v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'app-login',
	data: () => ({
		login: null,
		password: null,
		valid: true,
		show: false
	}),
	methods: {
		...mapActions (['setLoggedIn']),

		submit () {
			var vm = this;

			const formData = new FormData();
			formData.append('email', vm.login);
			formData.append('pass', vm.password);
			formData.append('app', 'foo');
	
			if (vm.login) {
				vm.loading = true;
				vm.axios.post('/login', formData)
					.then(function (response) {
						vm.valid = /Unknown\spath/.test(response.data);
						vm.loading = false;
						vm.clear();
						if (vm.valid) {
							vm.setLoggedIn(true);
							vm.$router.push('networks');
						}
					})
					.catch(function (error) {
						alert('login: ' + error);
						vm.valid = false;
						vm.loading = false;
					});
			}
			else {
				vm.valid = false;
			}
		},
		clear () {
			this.password = null;
		}
	}
}
</script>
