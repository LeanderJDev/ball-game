
// some default values
const defaultConfig = {
    width: 800,
    height: 800
}

// classes are functions that create objects
// and we're exporting it to use in another file
class Scene {
    // constructor function is the equivalent of
    // the init function
    constructor(collisionChart,velocityChart,canvasId = 'gameCanvas', config) {
        // get the canvas and context
        this.collisionChart=collisionChart
        this.velocityChart=velocityChart
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')

        // world/physics settings
        // merge default config & any passed in config
        this.config = {
            ...defaultConfig,
            ...config
        }

        // set the canvas size
        this.canvas.width = this.config.width
        this.canvas.height = this.config.height

        this.velocities = []
        this.collisions = []

        this.createBalls()

        // begin update loop
        // use an arrow function so that we can use `this` properly
        document.addEventListener('DOMContentLoaded', () => this.update())
    }

    createBalls() {
        const { config } = this
        // build an array of ball objects
        const balls = []

        for (let i = 0; i < 30; i++) {
            balls.push(
                new Ball(
                    // random X Y position
                    Math.random() * config.width, Math.random() * config.height,
                    // scene config
                    {
                        // default width, height
                        ...config,
                    },
                    // ball properties
                    {
                        // size 10-30
                        radius: 20,
                        // random color
                        hue: 0
                    }
                )
            )
        }

        this.balls = balls
    }

    update() {
        // destructure the scene's variables
        const { ctx, config, balls } = this

        // queue the next update
        window.requestAnimationFrame(() => this.update())

        // clear the canvas
        ctx.clearRect(0, 0, config.width, config.height)

        // update objects
        balls.forEach(ball => ball.update(balls))

        // draw objects
        balls.forEach(ball => ball.draw(ctx))

        var velocity = 0
        var collision = 0
        balls.forEach(ball => { velocity += Math.sqrt(ball.velX * ball.velX + ball.velY * ball.velY), collision += ball.props.hue })
        velocity /= balls.length
        this.velocities.push(velocity)
        this.collisions.push(collision)
        collisionChart.reset()
        velocityChart.reset()
        velocityChart.plotData(this.velocities,'#aa0000')
        collisionChart.plotData(this.collisions,'#00aa00')

        var velocity_min = Infinity
        var velocity_max = 0
        //this.velocities.forEach(vel => { velocity_max = Math.max(vel,velocity_max); velocity_min = Math.min(vel,velocity_min) })

        document.getElementById("collisions").innerHTML = "Collisions: " + collision;
        document.getElementById("average_collisions").innerHTML = "Average Collisions: " + collision / this.balls.length;
        document.getElementById("velocity").innerHTML = "Velocity: " + velocity;
        //document.getElementById("velocity_delta").innerHTML = "Max Velocity Delta: " + (velocity_max - velocity_min);
    }
}

class Chart {
    constructor(canvasId = 'chartCanvas') {
        this.canvas = document.getElementById(canvasId);
        console.log(this.canvas,canvasId)
        this.context = this.canvas.getContext("2d");
    }

    reset()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    plotData(dataSet,color) {
        this.context.strokeStyle = color;
        this.context.beginPath();
        var scale = this.canvas.height / (dataSet[dataSet.length-1]+5)
        //var scale = 0.1
        this.context.moveTo(0,this.canvas.height-dataSet[0]*scale);
        for (var i = 1; i < dataSet.length; i++) {
            this.context.lineTo(i * (this.canvas.width / dataSet.length), this.canvas.height-dataSet[i]*scale);
        }
        this.context.stroke();
    }
}

var collisionChart = new Chart("collisionCanvas")
var velocityChart = new Chart("velocityCanvas")
var scene = new Scene(collisionChart,velocityChart)
