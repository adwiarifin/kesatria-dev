export default {
	async scheduled(_controller, env) {
		const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
		// Throwing marks the invocation as failed in the Worker's logs.
		if (!res.ok) {
			throw new Error(`Deploy hook failed: ${res.status} ${await res.text()}`);
		}
	},
};
