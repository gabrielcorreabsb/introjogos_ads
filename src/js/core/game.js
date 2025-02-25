class Game {
    constructor() {
        this.canvasManager = new CanvasManager();
        this.currentScene = null;
        this.init();
    }

    init() {
        this.currentScene = new IntroScene(this.canvasManager);
    }

    changeScene(scene) {
        this.currentScene = scene;
    }
}