<template>
<p>  
	Messages:
	<span class="count">{{ messageCount }}</span>
	<a @click.prevent="handleUpdate">(update)</a>
</p>
</template>

<script>
export default {
	name: 'testing-test',
	props: {
		initialCount: {
			type: Number,
			default: 0
		}
	},
	data: () => ({
		// messageCount: 0
		messageCount: this.initialCount
	}),
	methods: {
		handleUpdate () {
			this.messageCount += 1;
		}
	}
}
</script>