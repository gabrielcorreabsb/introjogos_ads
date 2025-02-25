window.onload = () => {
    const game = new Game();
    // Adicionar handler de clique para iniciar áudio
    document.addEventListener('click', () => {
        const audio = document.getElementById('introMusic');
        if (audio) {
            audio.play()
                .then(() => console.log('Audio enabled by user interaction'))
                .catch(err => console.error('Audio play failed:', err));
        }
    }, { once: true });
};