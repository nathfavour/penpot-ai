const requestPermission = async () => {
    if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'localOllama' });
        if (result.state === 'granted') {
            return true;
        } else if (result.state === 'prompt') {
            const userResponse = confirm('Allow access to local Ollama instance?');
            return userResponse;
        }
    }
    return false;
};

export default requestPermission;
