class IntroScene {
    constructor(canvasManager) {
        this.canvas = canvasManager.canvas;
        this.ctx = canvasManager.ctx;
        this.skipButton = document.getElementById('skip-button');
        this.introMusic = document.getElementById('introMusic');


        // Config de animacao do audio e logo
        this.audioConfig = {
            volume: 0.5,
            fadeInDuration: 1000,
            fadeOutDuration: 1000,
            totalDuration: 5455
        };

        this.animationConfig = {
            fadeInSpeed: 0.01,
            fadeOutSpeed: 0.01,
            logoDisplayTime: 3455,
            textFadeDelay: 1000,
            totalDuration: 5455
        };

        // Variáveis de animação
        this.opacity = 0;
        this.fadeIn = true;
        this.introComplete = false;
        this.startTime = Date.now();
        this.lastTime = 0;

        // Carregar logo
        this.logo = new Image();
        this.logo.src = 'assets/imgs/weverson_avatar.png';

        // Configurar eventos
        this.skipButton.addEventListener('click', () => this.skipIntro());

        // Iniciar automaticamente quando a logo carregar
        this.logo.onload = () => {
            this.setupAudio();
            this.startIntro();
        };
    }

    setupAudio() {
        if (!this.introMusic) {
            console.error('Elemento de áudio não encontrado');
            return;
        }

        this.introMusic.volume = 0;
        this.introMusic.loop = false;

        // Configurar o áudio para tocar assim que possível
        this.introMusic.muted = false;
        this.introMusic.preload = 'auto';
    }

    startIntro() {
        this.startTime = Date.now();
        this.playIntroMusic();
        requestAnimationFrame((time) => this.animate(time));
    }

    createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = 'Iniciar Intro';
        startButton.style.position = 'absolute';
        startButton.style.top = '50%';
        startButton.style.left = '50%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.padding = '15px 30px';
        startButton.style.fontSize = '18px';
        startButton.style.cursor = 'pointer';
        startButton.style.zIndex = '1000';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';

        document.body.appendChild(startButton);

        startButton.addEventListener('click', () => {
            this.startIntroWithAudio();
            startButton.remove();
        });
    }

    startIntroWithAudio() {
        if (!this.audioStarted) {
            this.audioStarted = true;
            this.startTime = Date.now();
            this.setupAudio();
            this.playIntroMusic();
            requestAnimationFrame((time) => this.animate(time));
        }
    }

    async playIntroMusic() {
        if (!this.introMusic) return;

        try {
            this.introMusic.currentTime = 0;
            this.introMusic.volume = 0;

            console.log('Tentando tocar áudio...');

            const playPromise = this.introMusic.play();
            if (playPromise !== undefined) {
                await playPromise;
                console.log('Áudio tocando com sucesso');
            }
        } catch (error) {
            console.error('Erro ao tocar áudio:', error);
        }
    }

    animate(currentTime) {
        if (this.introComplete) return;

        if (!this.lastTime) this.lastTime = currentTime;
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        const elapsedTime = Date.now() - this.startTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (elapsedTime <= this.audioConfig.fadeInDuration) {
            this.opacity = Math.min(elapsedTime / this.audioConfig.fadeInDuration, 1);
        } else if (elapsedTime >= (this.animationConfig.totalDuration - this.audioConfig.fadeOutDuration)) {
            const fadeOutTime = this.animationConfig.totalDuration - elapsedTime;
            this.opacity = Math.max(fadeOutTime / this.audioConfig.fadeOutDuration, 0);
        } else {
            this.opacity = 1;
        }

        if (this.introMusic) {
            this.introMusic.volume = this.opacity * this.audioConfig.volume;
        }

        this.drawScene(elapsedTime);

        if (elapsedTime >= this.animationConfig.totalDuration) {
            this.introComplete = true;
            this.endIntro();
            return;
        }

        requestAnimationFrame((time) => this.animate(time));
    }

    drawScene(elapsedTime) {
        this.ctx.globalAlpha = this.opacity;
        const logoWidth = 500;
        const logoHeight = 500;
        const x = (this.canvas.width - logoWidth) / 2;
        const y = (this.canvas.height - logoHeight) / 2;
        this.ctx.drawImage(this.logo, x, y, logoWidth, logoHeight);

        if (elapsedTime > this.animationConfig.textFadeDelay) {
            this.ctx.font = '24px "Press Start 2P"';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Jesus Christ be praised!',
                this.canvas.width / 2,
                (this.canvas.height / 2) + 300);
        }

        this.ctx.globalAlpha = 1;
    }

    skipIntro() {
        this.fadeOutAudio();
        this.introComplete = true;
        this.endIntro();
    }

    fadeOutAudio() {
        if (!this.introMusic) return;

        const startVolume = this.introMusic.volume;
        const fadeOutDuration = 500;
        const startTime = Date.now();

        const fadeOut = () => {
            const currentTime = Date.now() - startTime;
            const progress = currentTime / fadeOutDuration;

            if (progress < 1) {
                this.introMusic.volume = startVolume * (1 - progress);
                requestAnimationFrame(fadeOut);
            } else {
                this.introMusic.pause();
                this.introMusic.currentTime = 0;
            }
        };

        fadeOut();
    }

    endIntro() {
        this.fadeOutAudio();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Início do Jogo', this.canvas.width / 2, this.canvas.height / 2);

        this.skipButton.style.display = 'none';
    }
}